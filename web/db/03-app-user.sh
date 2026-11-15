#!/bin/bash
# Rol de aplicación con privilegios mínimos (patrón La Doble T / ALEPH).
# Sin DELETE: los pedidos nunca se borran, solo cambian de estado.
set -euo pipefail

: "${APP_DB_USER:?falta APP_DB_USER}"
: "${APP_DB_PASSWORD:?falta APP_DB_PASSWORD}"

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" \
     -v app_user="$APP_DB_USER" -v app_pass="$APP_DB_PASSWORD" -v db_name="$POSTGRES_DB" <<-'EOSQL'
	create role :"app_user" login password :'app_pass';
	grant connect on database :"db_name" to :"app_user";
	grant usage on schema public to :"app_user";
	grant select, insert, update on all tables in schema public to :"app_user";
	grant usage, select on all sequences in schema public to :"app_user";
	alter default privileges in schema public grant select, insert, update on tables to :"app_user";
	alter default privileges in schema public grant usage, select on sequences to :"app_user";
	revoke create on schema public from :"app_user";
EOSQL

echo "[init] rol '$APP_DB_USER' creado (select/insert/update, sin delete)"
