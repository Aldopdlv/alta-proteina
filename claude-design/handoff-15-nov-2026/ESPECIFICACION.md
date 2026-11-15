# Alta Proteína — Especificación técnica (reglas, datos, estados)

Complementa `README.md`. Todo valor marcado como **config** debe vivir en base de datos y ser editable desde `/panel/configuracion`; nada de esto va hardcodeado.

## 1. Configuración confirmada (14-nov-2026)
Ver también `datos/configuracion-confirmada.json`.

| Clave | Valor |
|---|---|
| Corte semanal | **Jueves 19:00** (hora de Lima, America/Lima, UTC−5) |
| Día de cocina | **Sábado** |
| Entrega | **Domingo, 9:00 a 15:00** |
| Zonas activas | San Miguel · Magdalena del Mar · San Isidro · Miraflores · San Borja |
| Costo de delivery | **S/ 0 (envío gratis)** en todas las zonas |
| Pedido mínimo | **S/ 50** (sobre subtotal de productos) |
| Salsa extra | S/ 2 por unidad |
| Mostrar proteína | Sí: "150 g de pollo" + "≈ 45 g de proteína" |
| Pack x7 | Cliente elige cuántos de cada marinado (suma = 7) o "Mix de la casa" |
| Código de pedido | `AP-AAMM-NNNN` (ej. AP-2611-0042), correlativo mensual con 4 dígitos |
| Yape | +51 933 980 759 · Titular: Alta Proteína |
| WhatsApp de atención | +51 933 980 759 (mismo número) → `https://wa.me/51933980759` |
| Duración congelado | 30 días |
| Recargo tarjeta | 10 % si base < S/ 100; 5 % si base ≥ S/ 100 |
| Rendimiento de cocción | 0,6 (150 g cocidos = 250 g crudos) |

**Aún sin definir** (dejar configurable / adaptable): proveedor del link de pago (Culqi, Izipay o Mercado Pago), nombres definitivos de salsas, logo definitivo y fotos.

## 2. Semana de pedido y corte
- Una "semana" se identifica por su **fecha de entrega** (domingo).
- Pedido creado **antes** del jueves 19:00 → entrega el domingo de esa semana. Después del corte (jueves 19:00 → domingo) → entrega el domingo siguiente.
  - Ej.: hoy sábado 14-nov → próximo corte jueves 19-nov 19:00 → entrega domingo 22-nov. Si se pide el viernes 20-nov → domingo 29-nov.
- Barra de corte y aviso del carrito usan esta fecha. **Nada se bloquea** después del corte; solo cambia la semana.
- Formatos de fecha: `domingo 22`, `domingo 22 de noviembre`, horas `9 a. m.`, `7:00 p. m.` (es-PE, con espacios y puntos).

## 3. Precios y totales
```
lineaUnitario = precioProducto + (nSalsasExtra × precioSalsaExtra)
lineaTotal    = lineaUnitario × cantidad
subtotal      = Σ lineaTotal
delivery      = zona.costo            // hoy 0
base          = subtotal + delivery
recargo       = medio == 'tarjeta' ? round2(base × (base < 100 ? 0.10 : 0.05)) : 0
total         = base + recargo
```
- Mínimo: `subtotal >= 50`; si no, carrito bloquea "Continuar a entrega" y muestra `Te faltan S/ (50 − subtotal)`.
- Ahorro del pack: `7 × precio(Burrito) − precio(Pack)` (calcular, no escribir).
- Formato de moneda: `S/ 61` en menú/carrito si es entero; `S/ 61,00` (coma decimal, 2 decimales) en pago, pedido y panel.
- El recargo aparece como **línea separada** antes de confirmar.

## 4. Modelo de datos (sugerido)
```
Producto   { id, nombre, descripcion, categoria('burritos-quesadillas'|'arroz-fideos'|'packs'),
             precio, polloCocidoG=150, proteinaG=45, recalentado, salsasIncluidas, imagenUrl?, activo, orden }
Pack       = Producto con categoria 'packs', contenido { productoId: 'burrito-pollo', cantidad: 7 }
Marinado   { id, nombre, descripcion, activo, orden }
Salsa      { id, nombre, activa, orden }
Zona       { id, nombre, costoDelivery=0, activa }
Config     { corteDia=4(jue), corteHora='19:00', cocinaDia=6(sáb), entregaDia=0(dom), ventana='09:00-15:00',
             pedidoMinimo=50, precioSalsaExtra=2, recargoUmbral=100, recargoBajo=0.10, recargoAlto=0.05,
             yapeNumero='933980759', yapeTitular='Alta Proteína', yapeQrUrl?, whatsapp='51933980759',
             rendimientoCoccion=0.6, mostrarProteina=true, proveedorPago? }
Pedido     { id, codigo, creadoEn, semanaEntrega(date), cliente{nombre, celular}, zonaId, direccion,
             referencia?, notas?, subtotal, delivery, recargo, total, medio('yape'|'tarjeta'),
             estado, motivoRechazo?, capturaUrl?, pagoProveedorRef?, notasInternas?, entregadoEn? }
LineaPedido{ pedidoId, productoId, cantidad, precioUnitario,
             marinadoId?            // platos
             salsaIncluidaId?       // platos
             salsasExtra: salsaId[]
             packModo?: 'mezcla'|'mix-casa', packMezcla?: { marinadoId: n }[] }   // suma = 7
```
Guardar precios **congelados en la línea** (si cambian después, el pedido no se altera).

## 5. Estados del pedido
| Estado (BD) | Etiqueta cliente | Etiqueta panel | Chip fondo / texto |
|---|---|---|---|
| `pendiente` | Pendiente de confirmación | Pendiente de pago | `#FBF3DC` / `#6E5108` |
| `pagado` | Pagado | Pagado | `#E6F0E8` / `#3E7C4A` |
| `preparado` | Preparado | Preparado | `#EEF0E3` / `#5B6B2F` |
| `entregado` | Entregado | Entregado | `#ECECEC` / `#5F5F5F` |
| `rechazado` | Rechazado (+ motivo) | Rechazado | `#F9E3E1` / `#B3261E` |

Transiciones: Yape enviado → `pendiente` → (panel Aprobar) `pagado` | (Rechazar + motivo) `rechazado` → (cliente resube captura) `pendiente`. Tarjeta aprobada (webhook/retorno) → `pagado`. Panel: `pagado` → `preparado` → `entregado` (también editable manualmente en la tabla). Mensajes de cada estado: ver `textos/08-copy-textos-web.md` § Confirmación (sustituir lunes→sábado, martes→domingo).

Notificaciones WhatsApp (plantillas en el copy): por ahora **enlaces `wa.me` prellenados** que el admin abre manualmente; sin API de WhatsApp en el MVP.

## 6. Producción (panel)
- Considera pedidos `pagado` y `preparado` de la semana.
- Porciones: platos = cantidad; pack = 7 × cantidad, repartidas según `packMezcla` (o fila "Mix de la casa (pack)").
- Salsas: 1 incluida por porción (de su tipo) + extras.
- **Pollo crudo (kg)** = porciones × 150 g ÷ 0,6 ÷ 1000. Mostrar `Pollo crudo a comprar: 5,25 kg (21 porciones × 250 g)`.
- Hoja para cocina imprimible, sin datos de clientes.

## 7. Validaciones
- Nombre: no vacío. Celular: exactamente 9 dígitos (solo números; guardar como `+51XXXXXXXXX`). Zona: una activa. Dirección: no vacía.
- Captura Yape: JPG/PNG/HEIC, ≤ 5 MB; con vista previa. Casilla "Confirmo que ya pagué este monto" obligatoria.
- Pack "Elige tu mezcla": suma = 7.
- Servidor: recalcular todos los totales; no confiar en el cliente.

## 8. Estado en cliente
- Carrito persistido en `localStorage` (sobrevive a errores de red y recargas). Sin cuentas.
- Checkout guarda datos de entrega en sesión hasta crear el pedido.
- `/pedido/[codigo]` es pública (código no adivinable fácilmente: añadir token corto en la URL, p. ej. `/pedido/AP-2611-0042?t=xxxx`).

## 9. Panel: acceso y seguridad
- Contraseña única (hash en variable de entorno); sesión por cookie httpOnly. Sin usuarios.
- Capturas Yape en almacenamiento privado; URLs firmadas para verlas en el panel.

## 10. Design tokens
**Color**
| Token | Hex | Uso |
|---|---|---|
| crema | `#F5EFE0` | fondo web pública |
| crema-oscura | `#EDE5D2` | placeholders, sección de menú, botón deshabilitado |
| blanco | `#FFFFFF` | tarjetas, formularios, fondo panel |
| oliva | `#5B6B2F` | marca, botones secundarios, enlaces, foco |
| oliva-oscuro | `#4A5826` | hover/presionado, texto sobre oliva claro |
| oliva-claro | `#EEF0E3` | pack, chips suaves, selección |
| naranja | `#E8772E` | **solo** fondo de CTA principal y contadores; hover `#DC6E28` |
| naranja-oscuro | `#A84E17` | único naranja permitido como texto |
| texto | `#2B2B2B` | texto y **texto sobre naranja** (nunca blanco sobre naranja) |
| texto-secundario | `#5F5F5F` | descripciones |
| borde | `#E3DCCB` | bordes y separadores |
| éxito | `#3E7C4A` / fondo `#E6F0E8` | |
| aviso (texto) | `#6E5108` / fondo `#FBF3DC` | `#B8860B` no cumple AA como texto |
| error | `#B3261E` / fondo `#F9E3E1` | |
| neutro | `#5F5F5F` / fondo `#ECECEC` | |

**Tipografía**: títulos DM Sans 600/700 (interletrado −0.02em a −0.03em en grandes); texto Inter 400/500. Escala móvil 32/26/22/18/16/14/12; line-height 1.3 títulos, 1.5 texto. Precios y gramos en DM Sans con `font-variant-numeric: tabular-nums`. Mínimo 12 px.

**Espacio**: retícula de 4 px (4, 8, 12, 16, 20, 24, 32, 40, 48). Contenedor 1120 px.
**Radios**: 12 controles/botones/inputs · 16 tarjetas · 24 hojas y modales · 999 chips.
**Sombras**: tarjeta `0 2px 8px rgba(43,43,43,.08)`; hoja/barra inferior `0 -8px 24px rgba(43,43,43,.12)`. En crema preferir borde a sombra.
**Alturas**: toque mínimo 44; botón principal 48–52; input 48.

## 11. Accesibilidad (criterios)
- Contraste AA en todo texto (ver tabla). Foco visible oliva 2 px.
- Labels reales; errores asociados al campo (`aria-invalid`, `aria-describedby`); foco al primer error.
- Objetivos de toque ≥ 44 px. `alt` = nombre del producto.
- Primera carga del menú < 1 MB en móvil.

## 12. Fuera del MVP
Cuentas, suscripción automática, repetir pedido, app, cupones, referidos, reseñas, API de WhatsApp.

## 13. Criterios de aceptación clave
1. Un cliente nuevo arma un pedido ≥ S/ 50 y paga con Yape en < 3 minutos desde el celular.
2. Pedido bajo S/ 50 no puede avanzar del carrito.
3. Pedido hecho el jueves 19:01 queda asignado al domingo de la semana siguiente.
4. Recargo de tarjeta visible como línea separada antes de pagar y correcto en ambos tramos.
5. Pack con mezcla ≠ 7 no se puede agregar.
6. Aprobar/rechazar Yape cambia el estado visible en `/pedido/[codigo]`.
7. Producción muestra kg de pollo crudo correctos solo con pedidos pagados.
8. Todo valor de §1 se puede cambiar desde Configuración sin desplegar.
