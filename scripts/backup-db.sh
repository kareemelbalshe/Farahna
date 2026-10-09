#!/bin/bash
# =============================================================================
# Farahna Platform — Production PostgreSQL Automated Backup Script
# =============================================================================

set -e

BACKUP_DIR="${BACKUP_DIR:-/backups/farahna}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/farahna_db_${TIMESTAMP}.sql.gz"
RETENTION_DAYS=14

mkdir -p "$BACKUP_DIR"

echo "📦 [$(date)] Starting Farahna database backup..."

# If running inside docker container or connecting to remote postgres
if [ -n "$DOCKER_CONTAINER" ]; then
  docker exec -t "$DOCKER_CONTAINER" pg_dump -U "${DB_USER:-farahna}" "${DB_NAME:-farahna_db}" | gzip > "$BACKUP_FILE"
elif [ -n "$DATABASE_URL" ]; then
  pg_dump "$DATABASE_URL" | gzip > "$BACKUP_FILE"
else
  pg_dump -U "${DB_USER:-postgres}" -h "${DB_HOST:-localhost}" -p "${DB_PORT:-5432}" "${DB_NAME:-farahna_db}" | gzip > "$BACKUP_FILE"
fi

FILESIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo "✅ [$(date)] Backup completed successfully: $BACKUP_FILE ($FILESIZE)"

# Prune old backups older than RETENTION_DAYS
echo "🧹 Pruning backups older than ${RETENTION_DAYS} days..."
find "$BACKUP_DIR" -type f -name "farahna_db_*.sql.gz" -mtime +"$RETENTION_DAYS" -exec rm -f {} \;
echo "✨ Backup maintenance finished."
