# Alta Proteína — web de pedidos + panel

Implementación del diseño de Claude Design (`design_handoff_alta_proteina_mvp`, 14-nov-2026).
Next.js 15 (App Router) + TypeScript + Tailwind + Postgres 17, en Docker en el Dappnode, publicada con un túnel de Cloudflare.

- Pública: https://altaproteina.solvelab.digital (noindex hasta el lanzamiento: `SITIO_INDEXABLE=1`).
- Panel: `/panel` (contraseña única).
- Local en el Dappnode: http://127.0.0.1:8097

## Qué hace

| Ruta | Pantalla |
|---|---|
| `/` | Inicio: héroe, cómo funciona, menú destacado, razones, preguntas, pie |
| `/menu` | Menú con filtros y hoja de personalización (marinado, salsa, extras, mezcla del pack) |
| `/carrito` | Carrito (localStorage), mínimo S/ 50 |
| `/entrega` | Datos de entrega con validación |
| `/pago` | Yape con captura (sin recargo) o tarjeta con recargo 10 % / 5 % |
| `/pedido/AP-AAMM-NNNN?t=…` | Estado del pedido (enlace público con clave) |
| `/terminos` | Términos y entregas |
| `/panel` | Pedidos de la semana: fichas, búsqueda, filtros, estado editable, detalle con notas y avisos por WhatsApp |
| `/panel/yape` | Cola de capturas (todas las semanas, la más antigua primero): aprobar o rechazar con motivo |
| `/panel/produccion` | Porciones por producto × marinado, salsas, kg de pollo crudo + hoja imprimible para cocina |
| `/panel/entregas` | Entregas por zona, casilla "Entregado", lista para el motorizado |
| `/panel/configuracion` | TODO editable: productos (precio, activo, foto), marinados y salsas, zonas, corte y entrega, pagos (Yape, QR, tarjeta), rendimiento |

Reglas de negocio en `src/lib/` (puras y probadas): `semana.ts` (corte y semana de entrega en hora de Lima), `calculos.ts` (precios, recargo, pack), `produccion.ts`, `textos.ts` (copys que dependen de la configuración).

## Decisiones tomadas al implementar

- **Tarjeta sin proveedor todavía.** Mientras `proveedor_pago` esté vacío, "Pagar con tarjeta" crea el pedido en *Pendiente de pago* y el cliente lee que le llegará el link por WhatsApp. En el panel, el detalle del pedido trae el botón "Enviar link de pago" con el mensaje prellenado. Al pagar, se marca *Pagado* a mano. Cuando se elija Culqi, Izipay o Mercado Pago se conecta en `src/app/(sitio)/pago/acciones.ts`.
- **Pack x7 sin salsa incluida a elegir** (así está en el diseño): en producción cuenta como "Salsa a elección de la cocina (packs)". Las salsas extra sí se eligen.
- **Cola de Yape de todas las semanas**, para que ninguna captura quede escondida tras el selector de semana.
- **Avisos al cliente**: enlaces `wa.me` prellenados que el equipo abre a mano (sin API de WhatsApp en el MVP).
- **Avisos al equipo por Telegram** (opcional): con `TELEGRAM_BOT_TOKEN` y `TELEGRAM_CHAT_ID`, cada pedido nuevo llega con su captura como archivo.
- **Capturas privadas**: viven en un volumen y solo se ven con sesión del panel. Las fotos de producto y el QR sí son públicos (`/fotos/…`).

## Operación

```bash
cd /home/dappnode/alta-proteina/web
docker compose up -d --build          # desplegar (tras git pull)
scripts/migrar.sh                     # migraciones de db/migraciones/ (si hay)
docker compose logs -f app            # ver errores
node scripts/clave-panel.mjs "nueva-contraseña"   # → PANEL_CLAVE_HASH en .env; luego docker compose up -d
```

Respaldo diario (cron del host, 3:25 a. m.): `scripts/respaldo.sh` (base + capturas + fotos, 30 días, copia en `~/respaldos-fuera/altaproteina`).

## Pruebas

```bash
npm test                              # lógica pura (semana, precios, recargo, pack, producción, formatos)
# Integración contra un Postgres de PRUEBA (nunca el de producción):
DATABASE_URL=postgresql://…/altaproteina_test CAPTURAS_DIR=/tmp/cap \
  node --conditions=react-server --import tsx --test tests/pedidos.integracion.ts
```

## Pendientes conocidos

- Logo definitivo: reemplazar `src/componentes/Logo.tsx` y `public/marca/isotipo.svg`.
- Fotos de producto y QR de Yape: se suben desde Panel → Configuración.
- Nombres definitivos de salsas: Panel → Configuración → Marinados y salsas.
- Proveedor del link de pago.
- Bot de Telegram del equipo (opcional).
