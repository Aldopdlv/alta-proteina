# ALTA PROTEÍNA

Comida preparada alta en proteína, congelada y bajo pedido, con corte semanal, en Lima. La impulsan Aldo y Ale; cocina un chef aliado con local propio; insumos y reparto a cargo del equipo. Zona inicial: Magdalena y San Isidro.

## Estado

| Fecha | Hito |
|---|---|
| 10-nov-2026 | Audio con el concepto inicial, transcrito y resumido con ideas y preguntas para la reunión con el chef |
| 11-nov-2026 | Análisis inicial: modelo bajo pedido con corte semanal, costos por porción (pollo S/ 14,31/kg, 150 g cocidos = 250 g crudos) y menú |
| 11-nov-2026 | Bosquejo de web MVP y marca: nombre de trabajo, paleta oliva/crema/naranja, flujo de pedido, pagos tarjeta con recargo y Yape con captura, panel interno |
| 14-nov-2026 | Paquete completo para Claude Design (`claude-design/`): brief consolidado, textos, datos de ejemplo, tokens, contraste verificado y wordmark provisional. Zip listo para subir |

## Concepto en una línea

Platos con 150 g de pollo cocido por porción, congelados el mismo día, que el cliente pide una vez por semana desde una web simple, paga con Yape o tarjeta y recibe en un día fijo en su zona.

> Nota: el brief del 10-nov proponía suscripción semanal y un estándar de 40 g de proteína por porción. Las decisiones del 11-nov lo reemplazan por pedido semanal sin suscripción (por ahora) y 150 g de pollo cocido por porción, que equivalen a unos 45 g de proteína. El brief se conserva como registro.

## Documentos

### Diseño de la web (`claude-design/`)
- [00-LEEME.md](claude-design/00-LEEME.md): orden de lectura del paquete.
- [01-marca.md](claude-design/01-marca.md) a [06-alcance-mvp.md](claude-design/06-alcance-mvp.md): notas base de marca, producto, flujo, pagos, panel y alcance.
- [07-BRIEF-COMPLETO-claude-design.md](claude-design/07-BRIEF-COMPLETO-claude-design.md): brief consolidado pantalla por pantalla, componentes, estados, panel interno, accesibilidad, decisiones pendientes y prompts por tandas.
- [08-copy-textos-web.md](claude-design/08-copy-textos-web.md): textos de la web listos para usar.
- `datos/`: menú y pedidos de ejemplo en JSON. `marca/`: tokens, verificación de contraste y wordmark provisional.
- **Zip para Claude Design:** [ALTA-PROTEINA-paquete-claude-design.zip](claude-design/ALTA-PROTEINA-paquete-claude-design.zip). Se regenera con `bash claude-design/armar-paquete.sh` (requiere python3).

### Trabajo del proyecto (`docs/`)
- [BRIEF-INICIAL-audio-10-nov-2026.md](docs/BRIEF-INICIAL-audio-10-nov-2026.md): transcripción del audio inicial, resumen, ideas y preguntas para el chef.
- [ANALISIS-costos-y-menu-11-nov-2026.md](docs/ANALISIS-costos-y-menu-11-nov-2026.md): supuestos de costo, costo por porción, precio sugerido, menú y técnica de congelado.
- [WEB-MVP-y-marca-11-nov-2026.md](docs/WEB-MVP-y-marca-11-nov-2026.md): marca, decisiones, flujo del cliente, panel y alcance del MVP.
- [PROMPT-logo-higgsfield.md](docs/PROMPT-logo-higgsfield.md): prompt para generar variantes del logo.

## Decisiones pendientes

1. Mostrar "≈ 45 g de proteína" junto a "150 g de pollo" en cada producto.
2. Día y hora de corte, día y ventana de entrega (ejemplos usados: domingo 8 p. m. y martes de 6 a 9 p. m.).
3. Zonas activas y costo de delivery por zona; mínimo de pedido; precio de salsa extra.
4. Pack x7: un marinado para todos o "mix de la casa".
5. Proveedor del link de pago y número de Yape.
6. Logo definitivo y sesión de fotos de producto.
7. Trato con el chef (precio por porción) y capacidad semanal.

## Próximos pasos

1. Subir el zip a Claude Design y correr las tandas 1 a 5 del brief.
2. Generar variantes de logo con el prompt de `docs/PROMPT-logo-higgsfield.md` y elegir una.
3. Reunión con el chef: capacidad, costo real de tres recetas y forma del trato.
4. Confirmar las decisiones pendientes y actualizar `datos/menu-ejemplo.json` con los valores reales.

## Convenciones del repositorio

- `docs/`: transcripciones, análisis, briefs y decisiones, nombrados por su contenido y fecha (`TEMA-DD-mmm-AAAA.md`).
- `claude-design/`: todo lo que necesita Claude Design para diseñar la web; el zip es un snapshot y se regenera con el script.
- Las decisiones tomadas se registran en el documento correspondiente y se reflejan en la tabla de estado de este README.
