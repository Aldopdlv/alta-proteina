#!/bin/bash
# Aplica las migraciones pendientes de db/migraciones/ en orden (idempotente).
#   scripts/migrar.sh
set -euo pipefail
cd "$(dirname "$0")/.."
psql() { docker compose exec -T db psql -U postgres -d altaproteina -v ON_ERROR_STOP=1 -q "$@"; }

psql -c "create table if not exists schema_migraciones (nombre text primary key, aplicada timestamptz not null default now())"
shopt -s nullglob
for f in db/migraciones/*.sql; do
  nombre=$(basename "$f")
  if [ -n "$(psql -tAc "select 1 from schema_migraciones where nombre = '$nombre'")" ]; then continue; fi
  echo "→ $nombre"
  { echo "begin;"; cat "$f"; echo "insert into schema_migraciones (nombre) values ('$nombre');"; echo "commit;"; } | psql
done
psql -c "grant select, insert, update on all tables in schema public to altaproteina_app; grant usage, select on all sequences in schema public to altaproteina_app;"
echo "Migraciones al día."
