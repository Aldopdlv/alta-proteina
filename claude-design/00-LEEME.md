# Alta Proteína — Paquete para Claude Design
Construye una web MVP de pedidos para "Alta Proteína", comida alta en proteína, congelable y bajo pedido en Lima, Perú.
Lee los archivos en orden:
1. 01-marca.md — concepto, tono y paleta
2. 02-producto-y-precios.md — menú, precios y reglas
3. 03-flujo-cliente.md — pantallas públicas
4. 04-pagos.md — tarjeta con recargo y Yape con captura
5. 05-panel-admin.md — panel interno
6. 06-alcance-mvp.md — qué entra y qué no
7. **07-BRIEF-COMPLETO-claude-design.md** — el brief consolidado: pantalla por pantalla, componentes, estados, panel, accesibilidad y prompts por tandas. Si algo de 01-06 y 07 difiere, manda 07 (es la versión ampliada del 14-nov) salvo en lo marcado **[PROPUESTA]**, que aún no está decidido.
8. **08-copy-textos-web.md** — todos los textos de la web listos para usar (español de Perú). No inventar otros.

Carpetas de apoyo:
- `datos/menu-ejemplo.json` — productos, precios, marinados, salsas, zonas y configuración de ejemplo para prototipar con datos reales.
- `datos/pedidos-ejemplo.json` — pedidos ficticios en todos los estados, para el panel interno.
- `marca/tokens.css` y `marca/tokens.json` — tokens de diseño (colores con roles, tipografía, espacios, radios).
- `marca/paleta-y-contraste.md` — verificación WCAG de la paleta y reglas: **botón naranja con texto oscuro, nunca blanco; el naranja no es color de texto**.
- `marca/wordmark-provisional.svg` (+ `-invertido.svg` y PNG) — wordmark temporal que ocupa el lugar del logo definitivo.
- `contexto/` — los documentos de trabajo del proyecto (brief del audio del 10-nov, análisis de costos y menú, bosquejo de web y marca, prompt de logo). Son contexto, no instrucciones de diseño.

Lo que todavía no existe y debe tratarse como reemplazable: logo definitivo, fotos de producto, número de Yape, proveedor del link de pago, zonas y costos finales, día y hora de corte y entrega.

Idioma de la web: español (Perú). Moneda: soles (S/). Diseño mobile-first (390 px primero, luego 1280 px).
