#!/bin/bash
# Respaldo diario de la base + capturas + fotos (cron del host, 3:25 a. m.).
# Guarda 30 días en web/respaldos/ y copia el último fuera del proyecto.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p respaldos
fecha=$(date +%F)
docker compose exec -T db pg_dump -U postgres altaproteina | gzip > "respaldos/altaproteina-$fecha.sql.gz"
docker run --rm --user "$(id -u):$(id -g)" -v altaproteina_capturas:/c:ro -v altaproteina_fotos:/f:ro -v "$PWD/respaldos":/r alpine tar czf "/r/archivos-$fecha.tgz" -C / c f
find respaldos \( -name '*.gz' -o -name '*.tgz' \) | sort | head -n -60 | xargs -r rm --
mkdir -p "$HOME/respaldos-fuera/altaproteina"
cp "respaldos/altaproteina-$fecha.sql.gz" "respaldos/archivos-$fecha.tgz" "$HOME/respaldos-fuera/altaproteina/"
