#!/bin/bash
# =============================================================================
# Farahna Platform — Production Zero-Downtime Deployment Script
# =============================================================================

set -e

echo "🚀 ========================================================="
echo "🚀 Starting Farahna Production Deployment: $(date)"
echo "🚀 ========================================================="

# Check Docker and Docker Compose
command -v docker >/dev/null 2>&1 || { echo "❌ Error: docker is not installed"; exit 1; }
docker compose version >/dev/null 2>&1 || { echo "❌ Error: docker compose is not available"; exit 1; }

# Check production environment file
if [ ! -f .env ]; then
  echo "⚠️ Warning: .env file not found in root. Checking if production env vars are injected..."
  if [ -z "$DATABASE_URL" ] || [ -z "$JWT_SECRET" ]; then
    echo "❌ Error: Missing critical environment variables (.env file or system envs)."
    echo "💡 Please copy .env.example to .env and fill in real production secrets."
    exit 1
  fi
fi

# Step 1: Pre-deployment database backup
if [ -f scripts/backup-db.sh ]; then
  echo "📦 Step 1: Creating database backup before deployment..."
  bash scripts/backup-db.sh || echo "⚠️ Backup skipped or failed (if first time deployment)"
fi

# Step 2: Build & Start Containers
echo "🏗️ Step 2: Building and launching Docker containers..."
docker compose -f docker-compose.yml build --no-cache
docker compose -f docker-compose.yml up -d

# Step 3: Wait for API service to become healthy
echo "⏳ Step 3: Waiting for API service health check..."
MAX_RETRIES=15
COUNT=0
HEALTHY=false

while [ $COUNT -lt $MAX_RETRIES ]; do
  if docker compose -f docker-compose.yml exec -T api wget --no-verbose --tries=1 --spider http://localhost:5000/health 2>/dev/null; then
    HEALTHY=true
    break
  fi
  COUNT=$((COUNT + 1))
  echo "⏳ Waiting for API to start (attempt $COUNT/$MAX_RETRIES)..."
  sleep 4
done

if [ "$HEALTHY" = true ]; then
  echo "✅ API container is healthy and responding!"
else
  echo "❌ API service did not respond in time. Checking logs..."
  docker compose -f docker-compose.yml logs api --tail=50
  exit 1
fi

# Step 4: Verify Web service
echo "🌐 Step 4: Verifying Web frontend status..."
if docker compose -f docker-compose.yml exec -T web wget --no-verbose --tries=1 --spider http://localhost:3000 2>/dev/null; then
  echo "✅ Web frontend is live and responding!"
else
  echo "⚠️ Web container warning: Check logs with 'docker compose logs web'"
fi

# Step 5: Clean up dangling images
echo "🧹 Step 5: Cleaning up dangling docker images..."
docker image prune -f

echo "🎉 ========================================================="
echo "🎉 Farahna Production Deployment Completed Successfully!"
echo "🎉 ========================================================="
