# Logo — monograma «AP» (17-nov-2026)

Dirección elegida por Aldo: **D — monograma AP** (ver `docs/PROMPT-logo-higgsfield.md`).
Las 4 variantes salen de Higgsfield (GPT Image, 1:1). Son bocetos raster: el logo final se redibuja en SVG.

| Archivo | Nota |
|---|---|
| isotipo-AP-v1.png | P en naranja; hoja cruza la A |
| isotipo-AP-v2.png | P en naranja, más gruesa |
| isotipo-AP-v3.png | P en naranja; barra de la A como hoja |
| isotipo-AP-v4.png | **Recomendada:** A y P en verde oliva, solo la hoja-flecha en naranja (respeta "naranja solo como acento") |

Pendiente (Claude Code), con la variante confirmada:
1. Redibujar el isotipo en SVG limpio → `web/public/marca/isotipo.svg`.
2. Componer el logo horizontal: isotipo + «Alta Proteína» en DM Sans Bold, verde oliva #5B6B2F.
3. Actualizar `web/src/componentes/Logo.tsx`, favicon (32 px) y og:image.
4. Probar legibilidad a 32 px y dentro de un círculo (perfil de WhatsApp/Instagram).
