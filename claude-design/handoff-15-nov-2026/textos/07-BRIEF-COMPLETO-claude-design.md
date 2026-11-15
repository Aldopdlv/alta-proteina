# Alta Proteína — Brief completo para Claude Design (web MVP de pedidos)

Versión 14-nov-2026. Este documento consolida y amplía las notas 01 a 06. Donde algo no estaba decidido, propone un valor por defecto y lo marca con **[PROPUESTA]** para que Aldo y Ale lo confirmen o cambien. Nada de lo marcado así es definitivo.

---

## 1. Qué hay que diseñar, en una frase

Una web **mobile-first** de pedidos semanales de comida alta en proteína, congelada y bajo pedido, en Lima: el cliente arma su semana desde el menú, paga con tarjeta o Yape y recibe todo en un día fijo. Detrás, un **panel interno** con contraseña para validar pagos Yape, planificar la producción y organizar las entregas.

Prioridad declarada en 06-alcance-mvp.md: **que funcione simple y se vea confiable en el celular.**

## 2. Quién la usa

| Persona | Contexto | Qué necesita de la web |
|---|---|---|
| **Cliente** (25-40 años, entrena, trabaja, poco tiempo) | Llega desde Instagram o WhatsApp, casi siempre desde el celular, muchas veces de noche | Entender en 10 segundos qué es, ver gramos de proteína y precio, pedir en menos de 3 minutos, confiar en que va a llegar |
| **Admin** (Aldo y Ale) | Revisan desde el celular durante el día y desde la laptop el lunes de producción | Ver pedidos y pagos pendientes, aprobar capturas Yape, saber cuánto pollo comprar, ordenar las entregas por zona |
| **Chef aliado** | Recibe el resumen de producción (puede ser una captura o una impresión) | Porciones por producto y marinado, salsas, kg de pollo crudo |

## 3. Principios de diseño

1. **Honesto y concreto.** Cada producto muestra su proteína en gramos, su precio y cómo se recalienta. Nada de promesas de salud ni tono de gimnasio extremo.
2. **Una sola decisión por pantalla.** Menú, carrito, entrega, pago y confirmación son pasos separados y cortos.
3. **El corte semanal siempre visible.** El cliente debe saber en todo momento hasta cuándo puede pedir y qué día recibe.
4. **Confianza antes del pago.** Recargo de tarjeta visible antes de confirmar; en Yape, monto exacto y estado claro de "pendiente de confirmación".
5. **Cálido pero limpio.** Crema de fondo, oliva como color de marca, naranja solo para la acción principal. Mucho aire, tarjetas redondeadas, fotos reales de comida.

## 4. Identidad visual

Fuente: 01-marca.md, ampliado con la verificación de contraste de `marca/paleta-y-contraste.md`.

### 4.1 Paleta y roles

| Rol | Color | Uso |
|---|---|---|
| Fondo | Crema `#F5EFE0` | Fondo general de la web pública |
| Superficie | Blanco `#FFFFFF` | Tarjetas, formularios, modales |
| Marca / primario | Oliva `#5B6B2F` | Títulos destacados, wordmark, botones secundarios, iconos, enlaces |
| Primario oscuro | Oliva oscuro `#4A5826` | Hover y estados presionados del oliva |
| Acento / CTA | Naranja `#E8772E` | Fondo del botón principal, chips de oferta, barras de progreso |
| Acento como texto | Naranja oscuro `#A84E17` | Única variante de naranja permitida para texto pequeño o enlaces |
| Texto | `#2B2B2B` | Texto principal. También el texto **sobre** los botones naranjas |
| Texto secundario | `#5F5F5F` | Descripciones, ayudas |
| Bordes | `#E3DCCB` | Separadores y bordes de tarjeta sobre crema |
| Éxito | `#3E7C4A` | Pagado, entregado |
| Aviso | `#B8860B` | Pendiente de confirmación |
| Error | `#B3261E` | Rechazado, validaciones |

**Reglas de contraste (WCAG AA):**
- Botón principal = fondo naranja `#E8772E` con **texto oscuro `#2B2B2B`** (4,8:1). Nunca texto blanco sobre naranja (2,9:1, falla).
- El naranja `#E8772E` **no se usa como color de texto** sobre crema ni blanco (2,6:1). Si hace falta un texto naranja, usar `#A84E17`.
- Oliva sobre crema (5,1:1) y blanco sobre oliva (5,9:1) pasan para texto normal.

### 4.2 Tipografía

- Títulos: **DM Sans** (alternativa: Poppins), pesos 600 y 700, interletrado ligeramente negativo en tamaños grandes.
- Texto: **Inter**, pesos 400 y 500.
- Escala móvil (px): 32 / 26 / 22 / 18 / 16 / 14 / 12. Línea 1,3 en títulos y 1,5 en texto.
- Los números importantes (gramos, precios) van en DM Sans 600 con tabulación numérica.

### 4.3 Forma y espacio

- Retícula de 4 px; márgenes laterales de 16 px en móvil, 24 px en tablet, contenedor máximo de 1120 px en escritorio.
- Radios: 12 px en botones e inputs, 16 px en tarjetas, 24 px en hojas inferiores y modales.
- Sombras suaves y escasas (`0 2px 8px rgba(43,43,43,0.08)`); en crema, preferir borde `#E3DCCB` a sombra.
- Iconos de línea, trazo 1,75 px, esquinas redondeadas (familia tipo Lucide o Phosphor).
- Altura mínima de toque: 44 px. Botones principales de ancho completo en móvil.

### 4.4 Fotografía y placeholders

- Fotos reales, luz natural, fondos crema o madera clara, toma cenital o a 45°, plato ya recalentado y servido (no la bolsa congelada). Una foto de héroe mostrando varias porciones etiquetadas transmite "mi semana resuelta".
- **Hoy no hay fotos.** Usar placeholders ilustrados de línea en oliva sobre un bloque crema más oscuro (`#EDE5D2`), con el nombre del producto. Todas las imágenes deben ser reemplazables sin tocar el layout (proporción fija 4:3 en tarjetas, 16:9 en héroe).
- Logo: **no definido**. Usar el wordmark provisional de `marca/wordmark-provisional.svg` (hay versión invertida para fondo oliva). Ocupará el mismo espacio que el logo final.

### 4.5 Tono de los textos

Cercano, directo, honesto, frases cortas, tuteo. Los textos listos para usar están en `08-copy-textos-web.md`; usar esos y no inventar otros, salvo microcopy de estados.

## 5. Mapa del sitio y rutas

### Pública
| Ruta | Pantalla |
|---|---|
| `/` | Inicio: héroe, cómo funciona, menú destacado, confianza, preguntas frecuentes, pie |
| `/menu` | Menú de la semana (listado de productos y pack) |
| `/menu/[producto]` | Detalle y personalización (puede ser hoja inferior sobre el menú) |
| `/carrito` | Carrito y resumen |
| `/entrega` | Datos de entrega y zona |
| `/pago` | Elección de medio de pago (tarjeta o Yape) y confirmación |
| `/pedido/[codigo]` | Confirmación y estado del pedido (enlace público, sin cuenta) |
| `/terminos` | Términos, política de entrega y cambios |

### Panel interno
| Ruta | Pantalla |
|---|---|
| `/panel/ingresar` | Acceso con contraseña |
| `/panel` | Pedidos de la semana |
| `/panel/yape` | Validación de capturas Yape |
| `/panel/produccion` | Resumen de producción |
| `/panel/entregas` | Entregas por zona y día |
| `/panel/configuracion` | Precios, productos, zonas, corte y día de entrega |

Barra superior pública: wordmark a la izquierda, ícono de carrito con contador a la derecha. En móvil, sin menú hamburguesa: la web es un embudo, los únicos destinos son Menú y Carrito. Barra inferior fija con el CTA del paso actual.

## 6. Pantallas públicas, una por una

### 6.1 Inicio `/`

1. **Barra de corte** (fina, oliva, texto crema), arriba de todo: "Pide hasta el domingo 8:00 p. m. · Recibes el martes". Valores leídos de configuración. Después del corte cambia a "El menú de esta semana cerró · Lo que pidas ahora llega el martes 25".
2. **Héroe**: título, subtítulo, CTA naranja "Arma tu semana" (lleva a `/menu`), enlace secundario "Ver cómo funciona". Imagen 16:9 a la derecha en escritorio y debajo en móvil.
3. **Cómo funciona**, 3 pasos en tarjetas con número grande en oliva: Pide hasta el domingo → Cocinamos en lote → Recibes tu semana congelada.
4. **Menú destacado**: 4 tarjetas de producto (misma tarjeta que en `/menu`) y una del pack x7. Botón "Ver todo el menú".
5. **Por qué funciona**: 3 bloques de confianza (proteína visible, congelado el mismo día, recalienta en 4 minutos).
6. **Preguntas frecuentes**: acordeón con las 8 preguntas de `08-copy-textos-web.md`.
7. **Pie**: wordmark, zona de reparto, WhatsApp, Instagram, enlace a términos, medios de pago aceptados (Yape y tarjeta), "Lima, Perú".

### 6.2 Menú de la semana `/menu`

- Encabezado: "Menú de la semana" + la barra de corte repetida en formato chip.
- Filtros simples por chips **[PROPUESTA]**: Todos · Burritos y quesadillas · Arroz y fideos · Packs.
- **Tarjeta de producto** (anatomía, de arriba abajo):
  - Imagen 4:3 con etiqueta superpuesta en oliva: **"150 g de pollo"** y, debajo en pequeño, "≈ 45 g de proteína" **[PROPUESTA: mostrar ambos números; 150 g de pechuga cocida aportan unos 45 g de proteína y es el dato que el público objetivo busca]**.
  - Nombre (DM Sans 18/600) y descripción de una línea.
  - Fila: precio (DM Sans 20/700) a la izquierda; a la derecha, stepper − 1 + o botón "Agregar".
  - Línea de ayuda: "Congelado · Microondas 3-4 min".
  - Enlace "Elegir marinado y salsa" que abre la hoja de personalización (6.3).
- **Tarjeta del pack x7**: fondo oliva claro `#EEF0E3`, chip naranja "Ahorra S/ 4" (80 frente a 7×12 = 84; calcular, no escribir fijo), texto "7 burritos para toda la semana".
- Producto inactivo o agotado: tarjeta atenuada con chip "Esta semana no" y sin stepper.
- **Barra inferior fija** cuando hay ítems: "3 ítems · S/ 35" a la izquierda y botón naranja "Ver carrito" a la derecha.

### 6.3 Personalización (hoja inferior)

- Título con nombre del producto y precio.
- **Marinado** (obligatorio, una opción, por defecto la primera): ají panca · achiote · limón con ajo y orégano · teriyaki. Cada opción con una línea de descripción.
- **Salsa aparte**: "1 incluida" como radio; "Agregar salsa extra" como lista con precio por unidad (configurable; ejemplo S/ 2). Las salsas se entregan en envases pequeños, separados.
- Cantidad (stepper) y botón ancho "Agregar · S/ 24".
- Para el **pack x7** **[PROPUESTA]**: elegir un marinado para los 7 o "Mix de la casa" (reparto que decide la cocina). Evita que el cliente configure 7 unidades una por una.

### 6.4 Carrito `/carrito`

- Lista de líneas: miniatura, nombre, marinado y salsa elegidos, stepper, subtotal de línea, enlace "Quitar".
- Resumen: Subtotal · Delivery "se calcula en el siguiente paso" · Total parcial.
- Aviso de corte: "Tu pedido entra en la semana del martes 18".
- Mínimo de pedido **[PROPUESTA: S/ 30]** configurable; si no se alcanza, el botón principal queda deshabilitado con texto explicativo.
- CTA "Continuar a entrega". Enlace "Seguir pidiendo".
- Carrito vacío: ilustración de línea, "Todavía no armaste tu semana", botón "Ver el menú".

### 6.5 Entrega `/entrega`

Formulario en una sola columna, con validación en línea y teclado numérico donde corresponda:

| Campo | Detalle |
|---|---|
| Nombre y apellido | obligatorio |
| Celular | 9 dígitos, prefijo +51 fijo; se usa para WhatsApp |
| Zona | selector con las zonas activas y su costo fijo (ejemplo: "Magdalena · S/ 5"). Si la zona no está, mensaje "Todavía no llegamos ahí" con enlace a WhatsApp |
| Dirección | calle y número |
| Referencia | opcional ("Edificio verde, dpto. 302") |
| Día de entrega | **fijo**, no editable: "Martes 18 de noviembre, entre 6 y 9 p. m." **[PROPUESTA de ventana horaria]** |
| Notas | opcional |

Resumen lateral (escritorio) o plegable (móvil) con ítems, subtotal, delivery y total. CTA "Continuar al pago".

### 6.6 Pago `/pago`

Dos tarjetas de selección (radio grande):

**Tarjeta (link de pago)**
- Texto: "Recargo del 10 % en compras menores a S/ 100; 5 % desde S/ 100". Se calcula al instante sobre el subtotal + delivery y aparece como **línea separada** "Recargo por tarjeta (10 %) · S/ 4,00" en el resumen.
- Botón "Pagar S/ 44,00 con tarjeta" abre el link del proveedor (Culqi, Izipay o Mercado Pago; dejar el componente preparado con un placeholder de redirección).
- Al volver con pago aprobado: estado **Pagado**.

**Yape**
- Sin recargo. Muestra: número de Yape en grande con botón "Copiar", QR (placeholder), titular, y el **monto exacto** a pagar en grande.
- Paso 2 dentro de la misma tarjeta: "Sube la captura de tu pago" (jpg/png/heic, máx. 5 MB, con vista previa). Casilla "Confirmo que ya pagué este monto".
- Botón "Enviar pedido". Al enviarlo el pedido queda en **Pendiente de confirmación** y se crea el código.
- Si falla la subida: mensaje y alternativa "Envíala por WhatsApp al 9XX XXX XXX con tu código de pedido".

Resumen fijo arriba del todo: ítems, delivery, recargo (si aplica), **Total**.

### 6.7 Confirmación y estado `/pedido/[codigo]`

- Código grande, formato **AP-2611-0042** **[PROPUESTA: AP-AAMM-correlativo]**.
- Chip de estado con color: Pendiente de confirmación (aviso) · Pagado (éxito) · Preparado (oliva) · Entregado (gris) · Rechazado (error, con motivo y botón "Volver a subir captura").
- Línea de tiempo vertical de 4 pasos.
- Bloque "Tu entrega": día, ventana, zona, dirección.
- Resumen del pedido con marinados y salsas.
- Botones: "Guardar enlace" (copia URL), "Escribir por WhatsApp", "Volver al menú".
- Esta página es el único "historial" del cliente: debe funcionar sin cuenta y verse bien si la abre días después.

### 6.8 Estados transversales

| Situación | Comportamiento |
|---|---|
| Corte pasado | Barra superior cambia de texto; el carrito indica la nueva semana; nada se bloquea |
| Sin productos activos | Menú muestra "Estamos armando el menú de la próxima semana" + WhatsApp |
| Cargando | Esqueletos (skeleton) en tarjetas y resumen; nunca spinner a pantalla completa |
| Error de red | Toast con "Reintentar"; el carrito se conserva en el dispositivo |
| Imagen faltante | Placeholder ilustrado del producto, nunca un recuadro roto |
| Formulario inválido | Mensaje bajo el campo, foco al primer error |

## 7. Panel interno

Acceso con contraseña única (sin usuarios). Diseño funcional, misma paleta pero con **fondo blanco** y oliva como color de acción; naranja solo para contadores de "pendiente".

### 7.1 Pedidos de la semana `/panel`
- Selector de semana (anterior / actual / siguiente) y contador de corte.
- Resumen superior en 4 fichas: Pedidos · Por confirmar (Yape) · Pagados · Venta de la semana (S/).
- Tabla (en móvil, tarjetas): código, nombre, celular (con enlace a WhatsApp), zona, ítems resumidos, total, medio de pago, **estado** editable con menú: Pendiente de pago → Pagado → Preparado → Entregado (y Rechazado).
- Filtro por estado y buscador por nombre o código.
- Detalle del pedido en panel lateral: todo lo del cliente, ítems con marinado y salsa, captura Yape si la hay, notas internas.

### 7.2 Validación Yape `/panel/yape`
- Cola de pedidos "Pendiente de confirmación", el más antiguo primero.
- Para cada uno: captura a tamaño grande con zoom, monto esperado junto al monto que debería verse, nombre del cliente, hora de envío.
- Botones "Aprobar" (verde) y "Rechazar" (rojo, pide motivo: monto distinto, captura ilegible, no se encontró el pago). Al rechazar, el cliente ve el motivo en su página de pedido.

### 7.3 Producción `/panel/produccion`
- Para la semana elegida, solo pedidos **pagados**.
- Tabla: producto × marinado → porciones. Fila de total por producto.
- Salsas: incluidas y extras por tipo.
- **Compra de pollo**: porciones × 150 g cocidos ÷ 0,6 = gramos crudos. Mostrar "Pollo crudo a comprar: 9,5 kg (38 porciones × 250 g)". Dato de rendimiento editable en configuración.
- Botón "Imprimir / Guardar PDF" con una hoja limpia para el chef (sin datos de clientes).

### 7.4 Entregas `/panel/entregas`
- Agrupadas por **zona** y ordenadas por dirección; cada entrega con nombre, celular (WhatsApp), dirección, referencia, ítems y total; casilla "Entregado".
- Vista "ruta" simple: lista secuencial con checkboxes para marcar en el camino desde el celular.
- Botón "Copiar lista" para pegar en WhatsApp al motorizado.

### 7.5 Configuración `/panel/configuracion`
Secciones en acordeón:
- **Productos**: nombre, descripción, precio, activo/inactivo, foto, instrucciones de recalentado, gramos de pollo.
- **Opciones**: marinados y salsas (nombre, activo, precio de salsa extra).
- **Zonas**: nombre y costo fijo de delivery; activa/inactiva.
- **Corte y entrega**: día y hora de corte; día y ventana de entrega; mínimo de pedido.
- **Pagos**: número y titular de Yape, QR; umbral y porcentajes del recargo de tarjeta; proveedor de link de pago.
- **Rendimiento de cocción** (60 % por defecto).

## 8. Componentes a definir en el sistema

Botón primario (naranja, texto oscuro) · Botón secundario (borde oliva) · Botón terciario (texto oliva) · Chip de estado (5 variantes) · Chip de filtro · Barra de corte · Tarjeta de producto · Tarjeta de pack · Stepper · Hoja inferior · Línea de carrito · Resumen de totales · Campo de formulario con validación · Selector de zona · Tarjeta de medio de pago · Cargador de captura con vista previa · Línea de tiempo de estado · Acordeón de preguntas · Toast · Esqueleto de carga · Ficha de resumen (panel) · Tabla responsiva (panel) · Panel lateral de detalle (panel) · Visor de imagen con zoom (panel).

## 9. Accesibilidad y rendimiento

- Contraste AA en todo texto (ver 4.1). Foco visible en oliva de 2 px.
- Etiquetas reales en todos los campos; errores asociados al campo.
- Objetivos de toque de 44 px; steppers con botones grandes.
- Imágenes con texto alternativo (nombre del producto).
- Peso: primera carga del menú por debajo de 1 MB en móvil; fotos en WebP con tamaños responsivos.

## 10. Lo que NO entra en el MVP

Cuentas de usuario, suscripción semanal automática, "repetir pedido", app móvil, cupones, programa de referidos, reseñas. El diseño puede dejar espacio para "repetir pedido" en la página de estado, pero sin construirlo.

## 11. Decisiones pendientes para Aldo y Ale (marcadas [PROPUESTA] en este documento)

1. Mostrar "≈ 45 g de proteína" junto a "150 g de pollo" en cada producto.
2. Día y ventana de entrega (ejemplo usado: martes, 6 a 9 p. m.) y hora de corte (ejemplo: domingo 8 p. m.).
3. Zonas activas al arrancar (ejemplo: Magdalena S/ 5, San Isidro S/ 6) y zonas "pronto".
4. Mínimo de pedido (ejemplo: S/ 30) y precio de salsa extra (ejemplo: S/ 2).
5. Pack x7: un marinado para todos o "Mix de la casa".
6. Formato del código de pedido (AP-AAMM-0001).
7. Proveedor del link de pago (Culqi, Izipay o Mercado Pago) y número de Yape definitivo.
8. Logo definitivo (ver `contexto/PROMPT-logo-higgsfield.md`) y sesión de fotos.

## 12. Cómo trabajar con Claude Design por tandas

Prompts sugeridos, en orden. Adjuntar siempre este paquete completo.

**Tanda 1 — Sistema visual e inicio.** "Con los archivos adjuntos, crea el sistema visual de Alta Proteína (paleta con las reglas de contraste de marca/paleta-y-contraste.md, tipografía DM Sans + Inter, tokens de marca/tokens.css, componentes de la sección 8 del brief) y diseña la pantalla de Inicio completa en móvil (390 px) y escritorio (1280 px), usando los textos exactos de 08-copy-textos-web.md y el wordmark provisional."

**Tanda 2 — Menú, personalización y carrito.** "Diseña /menu con las tarjetas de producto y pack según la sección 6.2, la hoja inferior de personalización (6.3) y el carrito (6.4) con sus estados vacío y con ítems, en móvil y escritorio. Usa los datos de datos/menu-ejemplo.json."

**Tanda 3 — Entrega, pago y confirmación.** "Diseña /entrega, /pago (tarjeta con recargo calculado y Yape con subida de captura) y /pedido/[codigo] con los 5 estados del chip, siguiendo las secciones 6.5 a 6.7. Incluye los estados de error de 6.8."

**Tanda 4 — Panel interno.** "Diseña el panel: ingreso, pedidos de la semana, validación Yape, producción (con el cálculo de pollo crudo), entregas por zona y configuración, según la sección 7, en escritorio y móvil. Usa datos/pedidos-ejemplo.json."

**Tanda 5 — Revisión.** "Revisa todas las pantallas contra la sección 9 (accesibilidad), unifica componentes repetidos y entrega el prototipo navegable."
