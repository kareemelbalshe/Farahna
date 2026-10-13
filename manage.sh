#!/bin/bash
# ==============================================================================
#  Farahna (فرحنا) — Universal Control & Production Deployment Script
# ==============================================================================
#
#  PRODUCTION COMMANDS (run on VPS):
#    ./manage.sh prod-ip         76.13.5.227:9090     → deploy with raw IP on port 9090
#    ./manage.sh prod-ip         76.13.5.227          → deploy with raw IP on port 80
#    ./manage.sh prod-domain     farahna.com          → deploy with domain + auto SSL (Nginx + Certbot)
#    ./manage.sh prod-cloudflare farahna.com:8880     → deploy via Cloudflare Proxy (SSL on CF, custom port on VPS)
#    ./manage.sh update                               → zero-data-loss update (git pull, build, migrate, seed sync)
#    ./manage.sh db-seed                              → seed super admin, demo weddings, themes, guests
#    ./manage.sh status                               → show container health & quick check
#    ./manage.sh logs [service]                       → tail real-time logs (nginx|api|web|postgres)
#    ./manage.sh down                                 → stop all containers (data is preserved)
#    ./manage.sh cleanup                              → free disk space (project-scoped images & cache)
#    ./manage.sh backup-db                            → create gzipped PostgreSQL backup
#    ./manage.sh restore-db <file>                    → restore database from backup file
#
#  LOCAL COMMANDS (run on dev machine):
#    ./manage.sh local                                → start PostgreSQL for local dev
#    ./manage.sh local-down                           → stop local dev database
#
# ==============================================================================

set -euo pipefail

# Enable modern Docker BuildKit for lightning-fast caching and lower RAM usage
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# ── Colors ───────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m'

COMPOSE_PROD="docker compose -f docker-compose.prod.yml --env-file .env.production"

# ── Helpers ──────────────────────────────────────────────────────────────────

ensure_swap() {
    # Ensure server has at least 2GB swap space to prevent Next.js build freezing & RAM thrashing
    local current_swap
    current_swap=$(free -m 2>/dev/null | awk '/Swap:/ {print $2}' || echo "0")
    if [ "${current_swap:-0}" -lt 2000 ]; then
        echo -e "${YELLOW}Configuring 2GB swap space to guarantee fast, crash-free Next.js builds...${NC}"
        local SUDO=""
        if [ "$(id -u)" -ne 0 ] && command -v sudo >/dev/null 2>&1; then
            SUDO="sudo"
        fi
        if [ ! -f /swapfile ]; then
            $SUDO fallocate -l 2G /swapfile 2>/dev/null || $SUDO dd if=/dev/zero of=/swapfile bs=1M count=2048 2>/dev/null || true
            if [ -f /swapfile ]; then
                $SUDO chmod 600 /swapfile
                $SUDO mkswap /swapfile >/dev/null 2>&1 || true
            fi
        fi
        if [ -f /swapfile ]; then
            $SUDO swapon /swapfile >/dev/null 2>&1 || true
            $SUDO sysctl vm.swappiness=10 >/dev/null 2>&1 || true
            echo -e "${GREEN}✓ 2GB swap space enabled (vm.swappiness=10).${NC}"
        fi
    fi
}

show_help() {
    echo -e "${CYAN}${BOLD}╔══════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}${BOLD}║     Farahna (فرحنا) Control & Deployment Panel       ║${NC}"
    echo -e "${CYAN}${BOLD}╚══════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BOLD}Production Commands (on VPS):${NC}"
    echo -e "  ${GREEN}prod${NC}                         Deploy on isolated port 9420 (farahna.menuflowx.com)"
    echo -e "  ${GREEN}prod-ip <ip[:port]>${NC}       Deploy with raw IP (HTTP only via Nginx)"
    echo -e "  ${GREEN}prod-domain <domain>${NC}      Deploy with domain + auto HTTPS (Nginx + Certbot)"
    echo -e "  ${GREEN}prod-cloudflare <domain[:port]>${NC} Deploy via Cloudflare proxy (custom port, SSL on CF)"
    echo -e "  ${GREEN}update${NC}                    Zero-data-loss update (pull, build, migrate, seed sync, cleanup)"
    echo -e "  ${GREEN}db-seed${NC}                   Seed admin account, 5 Egyptian themes, demo data"
    echo -e "  ${GREEN}status${NC}                    Show health status of all containers"
    echo -e "  ${GREEN}logs [service]${NC}            Tail real-time logs (nginx|api|web|postgres|certbot)"
    echo -e "  ${GREEN}down${NC}                      Stop all containers (data volumes preserved)"
    echo -e "  ${GREEN}cleanup${NC}                   Free disk space (project-scoped images & build cache)"
    echo -e "  ${GREEN}backup-db${NC}                 Create timestamped gzipped PostgreSQL backup"
    echo -e "  ${GREEN}restore-db <file>${NC}         Restore database from backup file (.sql or .sql.gz)"
    echo ""
    echo -e "${BOLD}Local Dev Commands (on Dev Machine):${NC}"
    echo -e "  ${GREEN}local${NC}                     Start standalone PostgreSQL for local dev"
    echo -e "  ${GREEN}local-down${NC}                Stop local dev database"
    echo ""
    echo -e "${BOLD}Examples:${NC}"
    echo -e "  ./manage.sh prod-ip 76.13.5.227:9090"
    echo -e "  ./manage.sh prod-domain farahna.com"
    echo -e "  ./manage.sh prod-cloudflare farahna.com:8880"
    echo -e "  ./manage.sh update"
    echo -e "  ./manage.sh status"
    echo -e "  ./manage.sh logs api"
}

check_arg() {
    if [ -z "${1:-}" ]; then
        echo -e "${RED}Error: Missing argument.${NC}"
        echo -e "Usage: ./manage.sh $2"
        exit 1
    fi
}

# Wait for a service to report 'healthy' in docker compose ps
wait_for_healthy() {
    local SERVICE=$1
    local MAX_WAIT=${2:-180}   # seconds
    local ELAPSED=0
    local INTERVAL=5

    echo -e "${CYAN}⏳ Waiting for ${BOLD}${SERVICE}${NC}${CYAN} to be healthy (max ${MAX_WAIT}s)...${NC}"

    while [ $ELAPSED -lt $MAX_WAIT ]; do
        local STATUS
        STATUS=$($COMPOSE_PROD ps "$SERVICE" 2>/dev/null | tail -1 || true)

        if echo "$STATUS" | grep -qi "healthy"; then
            echo -e "${GREEN}✓ ${SERVICE} is healthy!${NC}"
            return 0
        fi

        ELAPSED=$((ELAPSED + INTERVAL))
        echo -e "${YELLOW}  ${SERVICE}: starting... (${ELAPSED}s / ${MAX_WAIT}s)${NC}"
        sleep $INTERVAL
    done

    echo -e "${RED}✗ ${SERVICE} did NOT become healthy within ${MAX_WAIT}s.${NC}"
    echo -e "${RED}Last 40 log lines:${NC}"
    $COMPOSE_PROD logs --tail=40 "$SERVICE" || true
    return 1
}

# ── .env.production Setup ────────────────────────────────────────────────────

setup_env_file() {
    local TYPE=$1   # "ip" | "domain" | "cloudflare"
    local VALUE=$2  # e.g. "76.13.5.227:9090", "farahna.com", or "farahna.com:8880"

    local PROTOCOL="https"
    [ "$TYPE" = "ip" ] && PROTOCOL="http"

    local DOMAIN_ONLY PORT_ONLY FULL_URL

    DOMAIN_ONLY=$(echo "$VALUE" | cut -d':' -f1)
    PORT_ONLY=$(echo "$VALUE"   | cut -d':' -f2 -s)

    if [ "$TYPE" = "cloudflare" ]; then
        # Cloudflare provides SSL edge termination
        PROTOCOL="https"
        FULL_URL="https://${DOMAIN_ONLY}"
    else
        FULL_URL="${PROTOCOL}://${DOMAIN_ONLY}"
        # Append port to URL only for non-standard ports
        if [ -n "$PORT_ONLY" ] && [ "$PORT_ONLY" != "80" ] && [ "$PORT_ONLY" != "443" ]; then
            FULL_URL="${PROTOCOL}://${DOMAIN_ONLY}:${PORT_ONLY}"
        fi
    fi

    echo -e "${YELLOW}⚙  Configuring .env.production for ${TYPE}: ${FULL_URL}${NC}"

    # Backup existing file
    if [ -f ".env.production" ]; then
        cp .env.production .env.production.backup
        echo -e "${CYAN}   Backup saved → .env.production.backup${NC}"
    else
        # Create from template if missing
        cp .env.production.example .env.production
        echo -e "${GREEN}   Created .env.production from template.${NC}"
    fi

    # Fix CRLF line endings
    sed -i 's/\r$//' .env.production 2>/dev/null || true

    # ── Port configuration ──────────────────────────────────────────
    if [ "$TYPE" = "ip" ]; then
        if [ -n "$PORT_ONLY" ]; then
            sed -i "s|^HOST_HTTP_PORT=.*|HOST_HTTP_PORT=${PORT_ONLY}|g"   .env.production
        else
            sed -i "s|^HOST_HTTP_PORT=.*|HOST_HTTP_PORT=80|g"             .env.production
        fi
        sed -i "s|^HOST_HTTPS_PORT=.*|HOST_HTTPS_PORT=443|g"              .env.production
    elif [ "$TYPE" = "cloudflare" ]; then
        if [ -n "$PORT_ONLY" ]; then
            sed -i "s|^HOST_HTTP_PORT=.*|HOST_HTTP_PORT=${PORT_ONLY}|g"   .env.production
        else
            sed -i "s|^HOST_HTTP_PORT=.*|HOST_HTTP_PORT=8880|g"           .env.production
        fi
        sed -i "s|^HOST_HTTPS_PORT=.*|HOST_HTTPS_PORT=9443|g"             .env.production
    else
        # Domain mode: standard ports
        sed -i "s|^HOST_HTTP_PORT=.*|HOST_HTTP_PORT=80|g"                 .env.production
        sed -i "s|^HOST_HTTPS_PORT=.*|HOST_HTTPS_PORT=443|g"              .env.production
    fi

    # ── URLs & App Config ───────────────────────────────────────────
    sed -i "s|^APP_DOMAIN=.*|APP_DOMAIN=${DOMAIN_ONLY}|g"                  .env.production
    sed -i "s|^NEXT_PUBLIC_APP_URL=.*|NEXT_PUBLIC_APP_URL=${FULL_URL}|g"   .env.production
    sed -i "s|^NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=${FULL_URL}/api|g" .env.production
    sed -i "s|^CORS_ORIGIN=.*|CORS_ORIGIN=${FULL_URL}|g"                   .env.production

    # Ensure required base variables exist
    grep -q "^COMPOSE_PROJECT_NAME=" .env.production || echo "COMPOSE_PROJECT_NAME=farahna" >> .env.production

    echo -e "${GREEN}✓ .env.production updated successfully.${NC}"
}

# ── Production Stack ─────────────────────────────────────────────────────────

run_production() {
    echo ""
    echo -e "${CYAN}${BOLD}[1/4] Stopping old containers (data volumes preserved)...${NC}"
    $COMPOSE_PROD down --remove-orphans || true

    echo ""
    echo -e "${CYAN}${BOLD}[2/4] Building images sequentially (RAM safeguards)...${NC}"
    ensure_swap
    $COMPOSE_PROD build api
    $COMPOSE_PROD build web

    echo ""
    echo -e "${CYAN}${BOLD}[2.5/4] Starting all containers...${NC}"
    $COMPOSE_PROD up -d

    echo ""
    echo -e "${CYAN}${BOLD}[3/4] Waiting for services to become healthy...${NC}"
    wait_for_healthy "postgres" 120
    wait_for_healthy "api"      180
    wait_for_healthy "web"      180
    wait_for_healthy "nginx"    120

    echo ""
    echo -e "${CYAN}${BOLD}[4/4] Syncing database schema (prisma migrate deploy & db push)...${NC}"
    $COMPOSE_PROD exec -T api \
        npx prisma migrate deploy --schema apps/api/prisma/schema.prisma || true
    $COMPOSE_PROD exec -T api \
        npx prisma db push --schema apps/api/prisma/schema.prisma --skip-generate


    echo ""
    echo -e "${GREEN}${BOLD}══════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}${BOLD}🎉  Farahna (فرحنا) is LIVE on Nginx!${NC}"
    echo -e "${GREEN}${BOLD}══════════════════════════════════════════════════════${NC}"
    echo -e "    Site URL : ${CYAN}${BOLD}${FULL_URL:-http://your-server}${NC}"
    echo -e "    Health   : ${CYAN}${FULL_URL:-http://your-server}/health${NC}"
    echo -e "    API Docs : ${CYAN}${FULL_URL:-http://your-server}/api${NC}"
    echo -e "    Logs     : ${YELLOW}./manage.sh logs${NC}"
    echo -e "    Status   : ${YELLOW}./manage.sh status${NC}"
    echo -e "${GREEN}${BOLD}══════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${YELLOW}First time? Run:  ${BOLD}./manage.sh db-seed${NC}"
    echo -e "${YELLOW}Admin login:      ${BOLD}admin@farahna.com / Farahna@2026!${NC}"
}

# ── Command Router ───────────────────────────────────────────────────────────

case "${1:-}" in

    # ─────────────────────────────────────────────────────────────────────────
    prod)
        echo -e "${YELLOW}${BOLD}Deploying Farahna on isolated port 9420 (farahna.menuflowx.com)...${NC}"
        FULL_URL=$(grep "^NEXT_PUBLIC_APP_URL=" .env.production 2>/dev/null | cut -d= -f2 || echo "https://farahna.menuflowx.com")
        run_production
        ;;

    # ─────────────────────────────────────────────────────────────────────────
    prod-ip)
        check_arg "${2:-}" "prod-ip <ip[:port]>  (e.g. ./manage.sh prod-ip 76.13.5.227:9090)"
        VALUE="$2"
        PROTOCOL="http"
        FULL_URL="http://$(echo "$VALUE" | cut -d':' -f1)"
        PORT_ONLY=$(echo "$VALUE" | cut -d':' -f2 -s)
        [ -n "$PORT_ONLY" ] && [ "$PORT_ONLY" != "80" ] && FULL_URL="${FULL_URL}:${PORT_ONLY}"
        setup_env_file "ip" "$VALUE"

        # Activate IP Nginx configuration
        if [ -f "infra/nginx/conf.d/ip.conf" ]; then
            cp infra/nginx/conf.d/ip.conf infra/nginx/conf.d/default.conf
            echo -e "${GREEN}✓ Activated IP Nginx configuration (HTTP only).${NC}"
        fi

        run_production
        ;;

    # ─────────────────────────────────────────────────────────────────────────
    prod-cloudflare)
        check_arg "${2:-}" "prod-cloudflare <domain[:port]>  (e.g. ./manage.sh prod-cloudflare farahna.com:8880)"
        VALUE="$2"
        DOMAIN_ONLY=$(echo "$VALUE" | cut -d':' -f1)
        PROTOCOL="https"
        FULL_URL="https://${DOMAIN_ONLY}"
        setup_env_file "cloudflare" "$VALUE"

        # Activate Cloudflare Nginx configuration
        if [ -f "infra/nginx/conf.d/cloudflare.conf" ]; then
            cp infra/nginx/conf.d/cloudflare.conf infra/nginx/conf.d/default.conf
            echo -e "${GREEN}✓ Activated Cloudflare Nginx configuration (SSL handled by Cloudflare).${NC}"
        fi

        run_production
        ;;

    # ─────────────────────────────────────────────────────────────────────────
    prod-domain)
        check_arg "${2:-}" "prod-domain <domain>  (e.g. ./manage.sh prod-domain farahna.com)"
        VALUE="$2"
        DOMAIN_ONLY=$(echo "$VALUE" | cut -d':' -f1)
        PROTOCOL="https"
        FULL_URL="https://${DOMAIN_ONLY}"
        setup_env_file "domain" "$VALUE"

        mkdir -p infra/certbot/conf infra/certbot/www

        # Check if SSL certificate already exists
        if [ ! -f "infra/certbot/conf/live/${DOMAIN_ONLY}/fullchain.pem" ]; then
            echo -e "${YELLOW}🔒 Requesting Let's Encrypt SSL certificate for ${DOMAIN_ONLY}...${NC}"

            # 1. Temporarily activate IP config on port 80 to answer ACME challenges
            cp infra/nginx/conf.d/ip.conf infra/nginx/conf.d/default.conf

            # 2. Start PostgreSQL, API, Web and Nginx
            $COMPOSE_PROD up -d nginx web api postgres

            # Wait briefly for Nginx to boot
            sleep 5

            # 3. Request certificate via Certbot webroot
            echo -e "${CYAN}Issuing certificate from Let's Encrypt...${NC}"
            $COMPOSE_PROD run --rm --entrypoint "certbot certonly --webroot -w /var/www/certbot --email admin@${DOMAIN_ONLY} -d ${DOMAIN_ONLY} --agree-tos --no-eff-email --force-renewal" certbot || {
                echo -e "${RED}⚠️ Certbot challenge failed. Please verify that DNS for ${DOMAIN_ONLY} points to this VPS IP.${NC}"
                echo -e "${YELLOW}Falling back to HTTP mode on port 80 for now...${NC}"
            }
        fi

        # 4. If certificate was obtained, activate HTTPS domain config
        if [ -f "infra/certbot/conf/live/${DOMAIN_ONLY}/fullchain.pem" ]; then
            sed "s|__DOMAIN__|${DOMAIN_ONLY}|g" infra/nginx/conf.d/domain.conf > infra/nginx/conf.d/default.conf
            echo -e "${GREEN}✓ Activated Domain HTTPS Nginx configuration with Let's Encrypt SSL.${NC}"
        else
            cp infra/nginx/conf.d/ip.conf infra/nginx/conf.d/default.conf
            echo -e "${YELLOW}Running in HTTP mode (SSL certificate pending).${NC}"
        fi

        run_production
        ;;

    # ─────────────────────────────────────────────────────────────────────────
    update)
        echo -e "${YELLOW}${BOLD}Updating Farahna Platform (zero data loss)...${NC}"

        echo ""
        echo -e "${CYAN}[1/6] Pulling latest code from Git...${NC}"
        git stash save "Auto-stash before update" 2>/dev/null || true
        git pull || true
        git stash pop 2>/dev/null || true

        echo ""
        echo -e "${CYAN}[2/6] Building updated images (RAM safeguards & BuildKit)...${NC}"
        ensure_swap

        # Temporarily stop web container to free 500MB+ RAM during build
        $COMPOSE_PROD stop web 2>/dev/null || true

        $COMPOSE_PROD build web
        $COMPOSE_PROD build api

        echo ""
        echo -e "${CYAN}[3/6] Restarting containers with updated images...${NC}"
        $COMPOSE_PROD up -d --force-recreate --no-build
        wait_for_healthy "api" 120

        echo ""
        echo -e "${CYAN}[4/6] Syncing database schema (migration & push)...${NC}"
        $COMPOSE_PROD exec -T api \
            npx prisma migrate deploy --schema apps/api/prisma/schema.prisma || true
        $COMPOSE_PROD exec -T api \
            npx prisma db push --schema apps/api/prisma/schema.prisma --skip-generate

        echo ""
        echo -e "${CYAN}[5/6] Updating and syncing seed data (themes, plans, settings, demo data)...${NC}"
        $COMPOSE_PROD exec -T api npm run db:seed || true

        # Reclaim disk space
        echo ""
        echo -e "${CYAN}[6/6] Reclaiming disk space (project-scoped cleanup)...${NC}"
        bash "$0" cleanup

        echo ""
        echo -e "${GREEN}${BOLD}✓ Update complete! Zero data loss & seed data synced successfully.${NC}"
        ;;

    # ─────────────────────────────────────────────────────────────────────────
    db-seed)
        echo -e "${YELLOW}Syncing database schema & seeding Farahna Egyptian Wedding Database...${NC}"
        $COMPOSE_PROD exec -T api \
            npx prisma db push --schema apps/api/prisma/schema.prisma --skip-generate || true
        $COMPOSE_PROD exec -T api npm run db:seed
        echo ""
        echo -e "${GREEN}${BOLD}✓ Database seeding completed successfully!${NC}"
        echo -e "  Super Admin: ${CYAN}admin@farahna.com${NC}     Password: ${CYAN}Farahna@2026!${NC}"
        echo -e "  Admin:       ${CYAN}moderator@farahna.com${NC} Password: ${CYAN}Moderator@2026!${NC}"
        echo -e "  Editor:      ${CYAN}editor@farahna.com${NC}    Password: ${CYAN}Editor@2026!${NC}"
        ;;

    # ─────────────────────────────────────────────────────────────────────────
    status)
        echo -e "${CYAN}${BOLD}Container Status:${NC}"
        $COMPOSE_PROD ps
        echo ""
        echo -e "${CYAN}${BOLD}Quick Health Checks:${NC}"
        HTTP_PORT=$(grep "^HOST_HTTP_PORT=" .env.production 2>/dev/null | cut -d= -f2 || echo "80")
        echo -n "  Nginx Gateway (/health) : "
        curl -s --max-time 5 "http://127.0.0.1:${HTTP_PORT}/health" && echo "" \
            || echo -e "${RED}Not responding on port ${HTTP_PORT}${NC}"
        ;;

    # ─────────────────────────────────────────────────────────────────────────
    logs)
        if [ -z "${2:-}" ]; then
            $COMPOSE_PROD logs -f --tail=100
        else
            $COMPOSE_PROD logs -f --tail=100 "$2"
        fi
        ;;

    # ─────────────────────────────────────────────────────────────────────────
    down)
        echo -e "${YELLOW}Stopping all production containers (data volumes are preserved)...${NC}"
        $COMPOSE_PROD down
        echo -e "${GREEN}✓ All containers stopped safely. Data & uploads are intact.${NC}"
        ;;

    # ─────────────────────────────────────────────────────────────────────────
    cleanup)
        echo -e "${CYAN}${BOLD}Cleaning up Farahna Docker resources (project-scoped)...${NC}"
        echo -e "${YELLOW}  Only Farahna containers & images are affected.${NC}"
        echo ""

        # [1] Remove stopped containers belonging to THIS project only
        echo -e "${CYAN}[1/3] Removing stopped Farahna containers...${NC}"
        STOPPED=$(docker ps -a \
            --filter "label=com.docker.compose.project=farahna" \
            --filter "status=exited" \
            -q 2>/dev/null || true)
        if [ -n "$STOPPED" ]; then
            echo "$STOPPED" | xargs docker rm -f
            echo -e "${GREEN}  ✓ Removed stopped containers${NC}"
        else
            echo -e "  No stopped containers to remove"
        fi

        # [2] Remove old (untagged) images from this project
        echo -e "${CYAN}[2/3] Removing old Farahna untagged images...${NC}"
        OLD_IMAGES=$(docker images --format "{{.Repository}}:{{.Tag}} {{.ID}}" \
            | grep -E "^farahna" \
            | grep "<none>" \
            | awk '{print $2}' || true)
        if [ -n "$OLD_IMAGES" ]; then
            echo "$OLD_IMAGES" | xargs docker rmi -f 2>/dev/null || true
            echo -e "${GREEN}  ✓ Removed old untagged images${NC}"
        else
            echo -e "  No old images to remove"
        fi

        # [3] Remove dangling images & old BuildKit build cache (>7 days)
        echo -e "${CYAN}[3/3] Pruning build cache (>7 days)...${NC}"
        docker builder prune -f --filter "until=168h" 2>/dev/null || true
        echo -e "${GREEN}  ✓ Cleaned old build cache${NC}"

        echo ""
        echo -e "${GREEN}${BOLD}✓ Cleanup complete! Database & uploads are safe.${NC}"
        ;;

    # ─────────────────────────────────────────────────────────────────────────
    backup-db)
        echo -e "${CYAN}${BOLD}Creating PostgreSQL database backup...${NC}"
        mkdir -p ./backups
        TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
        BACKUP_FILE="./backups/farahna_db_${TIMESTAMP}.sql.gz"

        $COMPOSE_PROD exec -T postgres \
            pg_dump -U "${POSTGRES_USER:-farahna}" "${POSTGRES_DB:-farahna_db}" \
            | gzip > "$BACKUP_FILE"

        FILESIZE=$(du -h "$BACKUP_FILE" | cut -f1)
        echo -e "${GREEN}${BOLD}✓ Backup created successfully:${NC} ${CYAN}${BACKUP_FILE}${NC} (${FILESIZE})"
        ;;

    # ─────────────────────────────────────────────────────────────────────────
    restore-db)
        check_arg "${2:-}" "restore-db <backup_file_path>  (e.g. ./manage.sh restore-db ./backups/backup.sql.gz)"
        FILE_PATH="$2"

        if [ ! -f "$FILE_PATH" ]; then
            echo -e "${RED}Error: File not found: ${FILE_PATH}${NC}"
            exit 1
        fi

        echo -e "${RED}${BOLD}⚠️  WARNING: Restoring database will overwrite current data!${NC}"
        read -p "Are you sure you want to proceed? (yes/no): " CONFIRM
        if [ "$CONFIRM" != "yes" ]; then
            echo -e "${YELLOW}Database restore cancelled.${NC}"
            exit 0
        fi

        echo -e "${CYAN}Restoring database from ${FILE_PATH}...${NC}"
        if [[ "$FILE_PATH" == *.gz ]]; then
            gunzip -c "$FILE_PATH" | $COMPOSE_PROD exec -T postgres psql -U "${POSTGRES_USER:-farahna}" -d "${POSTGRES_DB:-farahna_db}"
        else
            cat "$FILE_PATH" | $COMPOSE_PROD exec -T postgres psql -U "${POSTGRES_USER:-farahna}" -d "${POSTGRES_DB:-farahna_db}"
        fi

        echo -e "${GREEN}${BOLD}✓ Database restored successfully!${NC}"
        ;;

    # ─────────────────────────────────────────────────────────────────────────
    local)
        echo -e "${CYAN}Starting standalone PostgreSQL for local development...${NC}"
        docker compose -f docker-compose.dev.yml up -d postgres
        echo -e "${GREEN}✓ Local database started!${NC}"
        echo -e "  PostgreSQL → ${CYAN}localhost:5432${NC}"
        echo -e "  Database   → ${CYAN}farahna_db${NC}"
        echo ""
        echo -e "Start API:  ${YELLOW}npm run dev:api${NC}"
        echo -e "Start Web:  ${YELLOW}npm run dev:web${NC}"
        ;;

    # ─────────────────────────────────────────────────────────────────────────
    local-down)
        echo -e "${YELLOW}Stopping local dev database...${NC}"
        docker compose -f docker-compose.dev.yml down
        echo -e "${GREEN}✓ Local database stopped.${NC}"
        ;;

    # ─────────────────────────────────────────────────────────────────────────
    set-password)
        check_arg "${2:-}" "set-password <email> [new_password]  (e.g. ./manage.sh set-password admin@farahna.com 'StrongPass@2026!')"
        EMAIL="$2"
        NEW_PASS="${3:-}"

        echo -e "${CYAN}Updating password for ${EMAIL}...${NC}"
        if $COMPOSE_PROD ps --services 2>/dev/null | grep -q api; then
            $COMPOSE_PROD exec -T api npx tsx src/scripts/setPassword.ts "$EMAIL" "$NEW_PASS"
        else
            echo -e "${YELLOW}Production container not running, running via local node...${NC}"
            npm --prefix apps/api run set-password "$EMAIL" "$NEW_PASS" 2>/dev/null || npx --prefix apps/api tsx src/scripts/setPassword.ts "$EMAIL" "$NEW_PASS"
        fi
        ;;

    # ─────────────────────────────────────────────────────────────────────────
    *)
        show_help
        ;;
esac
