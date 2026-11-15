# Handoff: Alta Proteína — Web MVP de pedidos + Panel interno

Versión 14-nov-2026. Idioma de la interfaz: español (Perú). Moneda: soles (S/). Mobile-first (390 px), escritorio a 1280 px.

## Overview
Web de pedidos semanales de comida alta en proteína, congelada y bajo pedido, en Lima. El cliente arma su semana desde el menú, paga con Yape (captura) o tarjeta (link de pago con recargo) y recibe todo el domingo. Detrás, un panel interno con contraseña única para validar pagos Yape, planificar la producción y organizar las entregas.

Prioridad del negocio: **que funcione simple y se vea confiable en el celular.**

## About the Design Files
Los archivos `.dc.html` de `disenos/` son **referencias de diseño hechas en HTML**: prototipos que muestran el aspecto y comportamiento esperados, **no código de producción para copiar**. La tarea es **recrearlos en un stack real**. No hay código existente; stack sugerido: **Next.js (App Router) + TypeScript + Tailwind**, base de datos Postgres (Supabase o Neon), almacenamiento de imágenes para capturas Yape (Supabase Storage / S3) y despliegue en Vercel. Si prefieres otro stack equivalente, adelante.

Para abrir los prototipos: abre `disenos/Prototipo.dc.html` en un navegador (necesita `support.js` en la misma carpeta). Los `Tanda N - ….dc.html` son tableros con todas las pantallas y estados lado a lado.

## Fidelity
**Alta fidelidad (hifi).** Colores, tipografía, espaciados, radios, copys y comportamiento son finales. Recrear con precisión. Excepciones reemplazables: logo (wordmark provisional), fotos (placeholders), nombres de salsas.

## Documentos de este paquete
- `README.md` — este archivo: pantallas y componentes.
- `ESPECIFICACION.md` — reglas de negocio, modelo de datos, estados, validaciones, tokens, accesibilidad, criterios de aceptación.
- `datos/configuracion-confirmada.json` — valores confirmados por el cliente (fuente de verdad para seeds).
- `datos/menu-ejemplo.json`, `datos/pedidos-ejemplo.json` — datos de ejemplo originales (los valores de zonas/fechas/mínimo están **superados** por `configuracion-confirmada.json`).
- `marca/` — tokens CSS/JSON, wordmark provisional, reglas de contraste.
- `textos/08-copy-textos-web.md` — todos los textos. **Usar tal cual**; los valores entre corchetes salen de configuración (ver ESPECIFICACION §1).
- `disenos/` — prototipos HTML.

---

## Rutas

### Pública (sin cuentas de usuario)
| Ruta | Pantalla | Prototipo |
|---|---|---|
| `/` | Inicio | `Inicio.dc.html` |
| `/menu` | Menú de la semana + hoja de personalización | `Menu.dc.html` |
| `/carrito` | Carrito | `Menu.dc.html?vista=carrito` |
| `/entrega` | Datos de entrega | `Checkout.dc.html` (vista entrega) |
| `/pago` | Medio de pago | `Checkout.dc.html` (vista pago) |
| `/pedido/[codigo]` | Confirmación y estado (enlace público) | `Checkout.dc.html` (vista pedido) |
| `/terminos` | Términos y entregas | `Terminos.dc.html` |

### Panel interno (contraseña única, sin usuarios)
| Ruta | Pantalla |
|---|---|
| `/panel/ingresar` | Acceso |
| `/panel` | Pedidos de la semana |
| `/panel/yape` | Validación de capturas |
| `/panel/produccion` | Resumen de producción + hoja para cocina |
| `/panel/entregas` | Entregas por zona |
| `/panel/configuracion` | Precios, productos, zonas, corte, pagos, rendimiento |
Prototipo: `Panel.dc.html` (prop `vista`).

---

## Layout global (público)
- Fondo `#F5EFE0`. Contenedor `max-width: 1120px`, margen lateral 16 px (móvil) / 24 px (tablet).
- **Barra de corte** (arriba de todo): fondo `#5B6B2F`, texto `#F5EFE0`, Inter 500 14/1.4, padding 8×16, centrada. Texto antes del corte: `Pide hasta el jueves 7:00 p. m. · Recibes el domingo 22`. Después del corte: `El menú de esta semana cerró · Lo que pidas ahora llega el domingo 29`. Fechas calculadas (ESPECIFICACION §2).
- **Header**: alto 64 px, borde inferior 1 px `#E3DCCB`. Izquierda: wordmark (isotipo 36 px + "Alta Proteína" DM Sans 700 20 px, `letter-spacing:-0.4px`, `#5B6B2F`). Derecha: enlace "Menú" (DM Sans 600 16, oliva, alto 44, hover fondo `#EEF0E3`) e ícono de carrito 44×44 con contador (círculo naranja `#E8772E`, texto `#2B2B2B` DM Sans 600 12, min 20×20). **Sin menú hamburguesa.**
- **Foco visible** global: `outline: 2px solid #5B6B2F; outline-offset: 2px` (`:focus-visible`). Inputs: borde `#5B6B2F` + `box-shadow: 0 0 0 2px #5B6B2F`.

## Pantallas públicas

### 1. Inicio `/`
1. Barra de corte + header.
2. **Héroe** (flex-wrap; texto y foto 50/50 en escritorio, foto debajo en móvil; gap 28–64 px; padding vertical 32–80 px):
   - H1 "Comida de verdad, sin complicarte." DM Sans 700, `clamp(32px, 4.6cqw, 58px)`, line-height 1.1, `letter-spacing:-0.03em`.
   - Subtítulo Inter 16–18 `#5F5F5F`, max 46ch.
   - CTA naranja "Arma tu semana" → `/menu` (alto 52, radio 12, DM Sans 600 17, fondo `#E8772E`, texto `#2B2B2B`, hover `#DC6E28`). Enlace "Ver cómo funciona" → ancla.
   - Imagen 16:9, radio 16 (placeholder `#EDE5D2`).
3. **Así de simple**: H2 DM Sans 700 22–32. 3 tarjetas (grid auto-fit min 260 px, gap 12): fondo blanco, borde `#E3DCCB`, radio 16, padding 20; número DM Sans 700 40 oliva; título DM Sans 600 18; texto 15 `#5F5F5F`.
4. **El menú de esta semana** (sección con fondo `#EDE5D2`): 4 tarjetas de producto + tarjeta ancha de pack. Botón secundario "Ver todo el menú".
5. **Lo que ves es lo que comes**: 3 bloques con ícono en círculo 48 px `#EEF0E3`.
6. **Preguntas frecuentes**: acordeón (8 preguntas; la primera abierta por defecto). Fila: alto mín. 56, DM Sans 600 16, botón +/− en círculo 28 px `#EEF0E3`.
7. **Pie** fondo `#5B6B2F`, texto crema: wordmark invertido, zonas, enlaces WhatsApp / Instagram / Términos y entregas (alto 44), "Pagas con Yape o tarjeta", "Alta Proteína · Lima, Perú".

### 2. Menú `/menu`
- H1 "Menú de la semana" (DM Sans 700 26) + chip de corte (`#EEF0E3`, texto `#4A5826`, 13 px, con ícono reloj).
- **Chips de filtro** (scroll horizontal en móvil): Todos · Burritos y quesadillas · Arroz y fideos · Packs. Alto 40, radio 999, borde 1.5 oliva; activo = fondo oliva, texto blanco. `aria-pressed`.
- **Grid**: `repeat(auto-fill, minmax(min(100%, 240px), 1fr))`, gap 16. 1 columna en 390 px, 4 en 1280 px.
- **Tarjeta de producto** (blanca, radio 16, sombra `0 2px 8px rgba(43,43,43,.08)`, overflow hidden):
  - Imagen 4:3 (placeholder `#EDE5D2` + ícono de línea oliva + nombre). Arriba a la izquierda, apiladas: chip `150 g de pollo` (fondo oliva, texto crema, DM Sans 600 12, radio 999, padding 4×10) y chip `≈ 45 g de proteína` (fondo blanco, texto `#4A5826`, Inter 500 12).
  - Cuerpo padding 16: nombre DM Sans 600 18; descripción 14 `#5F5F5F`; fila precio (DM Sans 700 20, `tabular-nums`) + botón "Agregar" (secundario, alto 44) **o** stepper (− n +, botones 44×42, borde 1.5 oliva, radio 12); línea "Congelado · Microondas 3-4 min" 12 px; enlace "Elegir marinado y salsa" (abre la hoja).
  - "Agregar" rápido = 1 unidad con el primer marinado y la primera salsa.
  - **Agotado/inactivo**: opacidad 0.6, chip gris "Esta semana no", sin stepper ni enlace.
- **Tarjeta de pack** (ocupa toda la fila: `grid-column: 1/-1`): fondo `#EEF0E3`, borde `#D9DEC4`. Chip naranja "Ahorra S/ 4" (calculado: 7×12 − 80), chip oliva "7 × 150 g de pollo", título "Pack semanal x7", precio S/ 80 + tachado S/ 84, botón "Elegir marinado" (abre la hoja).
- **Barra inferior fija** (si hay ítems): fondo blanco, borde superior, sombra `0 -8px 24px rgba(43,43,43,.12)`. Izquierda `3 ítems · S/ 35` (DM Sans 600 16); derecha botón naranja "Ver carrito".
- **Estados**: cargando → 4 tarjetas esqueleto (bloques `#EDE5D2`/`#F2ECDD`, nunca spinner de pantalla completa); sin menú publicado → tarjeta con texto de copy + botón WhatsApp; error de red → toast oscuro `#2B2B2B` abajo "No hay conexión. Tu carrito sigue guardado." + "Reintentar".

### 3. Hoja de personalización (sobre `/menu`)
- Móvil: hoja inferior (radio `24px 24px 0 0`, max-height 92 %, agarradera 40×4). Escritorio (≥720 px): modal centrado, max-width 520, radio 24. Fondo de overlay `rgba(43,43,43,.45)`.
- Cabecera: nombre (DM Sans 700 22) + precio; botón cerrar 44×44.
- **Plato**: Marinado (radio, elige uno; cada opción con descripción, alto mín. 56, seleccionado = borde oliva + fondo `#EEF0E3`) → Salsa incluida (chips radio, elige una) → Salsas extra (checkbox, "+ S/ 2" cada una; texto `1 salsa incluida. Cada salsa extra: S/ 2.`).
- **Pack x7**: radio "Elige tu mezcla" / "Mix de la casa (nosotros combinamos)". En "Elige tu mezcla": una fila por marinado con stepper; contador `n de 7 elegidos` (verde `#3E7C4A` si = 7, dorado `#6E5108` si no). El total debe ser **exactamente 7**; si no, el botón dice `Elige N más` y está deshabilitado (fondo `#EDE5D2`). Mezcla inicial: 7 del primer marinado. Salsas extra también disponibles.
- Pie fijo: stepper de cantidad + botón naranja ancho `Agregar · S/ 24` (precio = (precio + extras×2) × cantidad).

### 4. Carrito `/carrito`
- H1 "Tu semana". Columnas en escritorio (líneas 3fr / resumen 2fr, flex-wrap).
- Aviso oliva claro con calendario: `Tu pedido entra en la semana del domingo 22`.
- Líneas (lista blanca, radio 16): miniatura 72×72 radio 12, nombre DM Sans 600 16, detalle 13 `#5F5F5F` (ej. `Ají panca · Salsa: Chimichurri · Extra: Salsa criolla`; pack: `4 Ají panca, 3 Achiote` o `Mix de la casa`), total de línea, stepper, "Quitar".
- Resumen: Subtotal · `Delivery: gratis` · Total parcial (DM Sans 700 22).
- **Mínimo S/ 50**: si no se alcanza, aviso `El pedido mínimo es S/ 50. Te faltan S/ X.` (fondo `#FBF3DC`, texto `#6E5108`) y botón "Continuar a entrega" deshabilitado.
- Enlace "Seguir pidiendo". Vacío: ilustración de línea, "Todavía no armaste tu semana", texto, botón "Ver el menú".

### 5. Entrega `/entrega`
- "Volver al carrito", indicador "Paso 1 de 2 · Entrega" en header. H1 "¿A dónde te lo llevamos?".
- Formulario una columna (inputs alto 48, radio 12, borde 1.5 `#E3DCCB`; error = borde `#B3261E` + mensaje 13 px rojo debajo; `aria-invalid`):
  Nombre y apellido · Celular (prefijo fijo +51, 9 dígitos, `inputmode=numeric`) · Zona (select: 5 zonas "· Envío gratis" + "Mi zona no está en la lista" → aviso con enlace WhatsApp) · Dirección · Referencia (opcional) · bloque fijo `Recibes el domingo 22 de noviembre, entre 9 a. m. y 3 p. m.` · Notas (opcional).
- Validación al enviar; foco al primer error. Mensajes: `Escribe tu nombre` · `El celular debe tener 9 dígitos` · `Elige tu zona` · `Escribe tu dirección`.
- Resumen: lateral sticky en escritorio; plegable arriba en móvil ("Ver resumen · N ítems" + total).
- CTA "Continuar al pago".

### 6. Pago `/pago`
- "Volver a entrega". Resumen arriba: Ítems · Delivery (zona) "Gratis" · Recargo por tarjeta (solo si tarjeta, texto `#A84E17`) · **Total** (DM Sans 700 24).
- H1 "¿Cómo quieres pagar?". Dos tarjetas radio (borde 2 px; seleccionada = oliva). **Yape primero.**
- **Yape** (`Sin recargo.` en verde): bloque crema con `Yapea exactamente S/ 61,00 a:`, número **933 980 759** (DM Sans 700 26) + botón "Copiar" (copia `933980759`, cambia a "Copiado" 1,6 s), QR (placeholder 104×104), `Titular: Alta Proteína`. Paso 2: zona de subida punteada oliva "Elegir imagen · JPG, PNG o HEIC, hasta 5 MB" → vista previa con nombre/peso y "Cambiar". Error de subida: caja roja con texto del copy + "Intentar de nuevo". Casilla "Confirmo que ya pagué este monto". "Enviar pedido" habilitado solo con captura + casilla → crea pedido en **Pendiente de confirmación** → `/pedido/[codigo]`.
- **Tarjeta (link de pago)**: texto de recargo; botón naranja `Pagar S/ 67,10 con tarjeta` → redirige al proveedor (por definir; dejar adaptador). Al volver aprobado → **Pagado**. Texto de ayuda con candado.

### 7. Estado del pedido `/pedido/[codigo]`
- Chip de estado + H1 `¡Listo! Tu pedido es el` + código grande (DM Sans 700 34, oliva). Mensaje del estado (copy).
- Línea de tiempo vertical 4 pasos: Pedido recibido → Pago confirmado → Cocinado y congelado → Entregado (completado = círculo oliva con check; rechazado = círculo rojo con X en el paso 2).
- Tarjetas "Tu entrega" (día, ventana, zona · dirección · referencia) y "Tu pedido" (líneas, delivery, recargo si aplica, Total · medio).
- Botones: "Guardar enlace" (copia URL, "Enlace copiado"), "Escribir por WhatsApp" (`https://wa.me/51933980759?text=…` con mensaje prellenado del copy), "Volver al menú". Rechazado: botón "Volver a subir captura".
- Debe funcionar sin cuenta y verse bien días después.

### 8. Términos `/terminos`
H1 "Términos y entregas" + lista numerada de 5 puntos (copy) + botones WhatsApp / Ver el menú.

## Panel interno
- Fondo blanco; oliva = color de acción; naranja **solo** para contadores de pendiente.
- **Escritorio (≥760 px)**: sidebar 232 px fondo `#F5EFE0` (wordmark + "Panel interno", nav: Pedidos, Yape [badge naranja con nº pendientes], Producción, Entregas, Configuración; ítem activo fondo blanco texto `#4A5826`; "Salir" abajo). Contenido max 1080 px, padding 28×32.
- **Móvil**: header 56 px con título; **barra inferior** de 5 ítems (ícono + etiqueta DM Sans 600 12, alto 52).
- Selector de semana (‹ Semana del domingo 22 de noviembre ›) en todas las vistas.

1. **Ingresar**: tarjeta centrada sobre crema, "Panel de Alta Proteína", campo Contraseña, botón oliva "Ingresar".
2. **Pedidos**: 4 fichas (Pedidos · Por confirmar [punto naranja si >0] · Pagados · Venta de la semana). Buscador (nombre o código) + chips por estado. Escritorio: tabla (Código [abre detalle] · Cliente + celular con enlace WhatsApp · Zona · Ítems resumidos · Total · Pago · Estado como select con colores de chip). Móvil: tarjetas. **Panel lateral de detalle** (440 px; pantalla completa en móvil): estado, motivo si rechazado, cliente, ítems con marinado y salsas, total y medio, captura Yape, notas internas. Vacío: "Todavía no hay pedidos para esta semana."
3. **Yape**: cola de "Pendiente de confirmación", la más antigua primero. Por pedido: captura 180×320 con "Ampliar" (visor a pantalla completa), código, nombre, hora de envío, **monto esperado** grande. "Aprobar" (fondo `#3E7C4A`, texto blanco) → Pagado. "Rechazar" (borde rojo) → chips de motivo (Monto distinto · Captura ilegible · No encontramos el pago · Otro) + "Rechazar pago". Vacío: "No hay capturas por revisar."
4. **Producción**: solo pedidos **pagados** (y preparados). Bloque oliva: "Pollo crudo a comprar" en kg (DM Sans 700 34) + botón "Imprimir hoja para cocina". Tabla porciones por producto × marinado con total por producto y total general; tabla de salsas por tipo. **Hoja para cocina**: vista imprimible sin datos de clientes (porciones, salsas, pollo crudo) con "Imprimir / Guardar PDF" (`window.print()` con CSS de impresión).
5. **Entregas**: pagados/preparados/entregados agrupados por zona; tarjeta por entrega con casilla "Entregado" (44 px), nombre, total, dirección, referencia, ítems, código, enlace WhatsApp. "Copiar lista para el motorizado" (texto plano agrupado por zona).
6. **Configuración**: acordeón — Productos (precio, activo) · Marinados y salsas · Zonas y delivery · Corte y día de entrega · Pagos (Yape y tarjeta) · Rendimiento de cocción. Cada sección con "Guardar cambios". En el prototipo los campos son de solo lectura; **en producción deben ser editables** y alimentar toda la web.

## Assets
- Wordmark provisional: `marca/wordmark-provisional.svg` (+ invertido y PNG). En los prototipos el isotipo está inline como SVG (círculo oliva, hoja crema, punto naranja). **El logo definitivo llega esta semana**; dejar el componente `<Logo>` aislado.
- Fotos: no existen. Usar placeholders con proporción fija (4:3 tarjetas, 16:9 héroe, 72×72 miniaturas) para reemplazarlas sin tocar el layout. WebP responsivo.
- Íconos: línea 1,75 px, esquinas redondeadas → usar **Lucide** (shopping-bag, clock, calendar, eye, snowflake, timer, upload, image, lock, x, check, chevron-left, list, receipt, cooking-pot, truck, sliders).
- Fuentes: Google Fonts **DM Sans** (500/600/700) y **Inter** (400/500/600).

## Files (`disenos/`)
- `Prototipo.dc.html` — índice navegable.
- `Inicio.dc.html`, `Menu.dc.html`, `Checkout.dc.html`, `Terminos.dc.html`, `Panel.dc.html` — pantallas (la lógica está en el `<script>` al final de cada archivo).
- `Tanda 1 … Tanda 4 ….dc.html` — tableros con cada estado.
- `support.js` — runtime de los prototipos (no usar en producción).
