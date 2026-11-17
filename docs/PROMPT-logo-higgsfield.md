# Logo de Alta Proteína — prompts para Higgsfield (v2, 17-nov-2026)

## Estrategia

1. **Higgsfield hace solo el ÍCONO (isotipo), sin texto.** Los modelos de imagen suelen escribir mal «Proteína» (pierden la tilde o cambian letras) y el texto sale en una fuente que no es la de la web.
2. **El texto «Alta Proteína» lo armamos nosotros** en DM Sans Bold, la tipografía de títulos de la web, en verde oliva. Así el logo y la web quedan iguales.
3. Del ícono elegido, Claude lo **redibuja en SVG** (vector limpio) y lo pone en `web/src/componentes/Logo.tsx` + `web/public/marca/isotipo.svg`, favicon y og:image.

Modelo sugerido: el de imagen por defecto de Higgsfield (GPT Image), formato **1:1**, 4 variantes por dirección.

**Reglas de la marca** (van dentro del prompt): verde oliva #5B6B2F, naranja #E8772E solo como acento, fondo crema #F5EFE0. Saludable y práctico, **no** gimnasio extremo (nada de bíceps, pesas ni llamas). Tiene que leerse a 32 px (favicon) y en un círculo (foto de perfil de Instagram/WhatsApp).

---

## Dirección A — Hoja que sube (evolución del provisional)

```
Minimal flat vector logo icon, no text, no letters. A single stylized leaf whose shape also reads as an upward arrow, suggesting "high" and "growth". Leaf in olive green #5B6B2F, one small accent dot or detail in orange #E8772E. Bold simple geometry, thick shapes, works at 32 px as a favicon and inside a circle. Healthy and practical food brand, warm and approachable, not a gym look: no muscles, no dumbbells, no flames. Centered on a plain cream background #F5EFE0, generous margin. Flat colors only, no gradients, no shadows, no 3D, no mockup.
```

## Dirección B — Tenedor + hoja

```
Minimal flat vector logo icon, no text, no letters. A fork whose tines merge into a leaf, in a single continuous clean shape. Olive green #5B6B2F with a small orange #E8772E accent. Bold geometric lines, readable at 32 px, fits inside a circle. Brand of ready-to-eat high-protein frozen meals for busy people: honest, practical, friendly, not a hardcore gym look. Centered on a plain cream background #F5EFE0. Flat colors, no gradients, no shadows, no 3D, no mockup.
```

## Dirección C — Bowl / plato con vapor que sube

```
Minimal flat vector logo icon, no text, no letters. A simple rounded bowl seen from the side, with two or three curved steam lines rising upward that end in a small leaf, meaning "real food, ready in minutes". Bowl in olive green #5B6B2F, one steam line or the leaf tip in orange #E8772E. Thick friendly strokes, readable at 32 px, fits inside a circle. Healthy, practical, approachable, not a gym look. Centered on a plain cream background #F5EFE0. Flat colors, no gradients, no shadows, no 3D, no mockup.
```

## Dirección D — Monograma «AP»

```
Minimal flat vector monogram logo using only the two capital letters "A" and "P", interlocked in a friendly geometric sans-serif style with rounded terminals. The crossbar of the A shaped like a small leaf or an upward arrow. Olive green #5B6B2F with a single orange #E8772E accent. Bold, readable at 32 px, fits inside a circle. Healthy food brand, warm and approachable. Centered on a plain cream background #F5EFE0. Flat colors, no gradients, no shadows, no 3D, no mockup, no other text.
```

## Opcional — logo completo con texto (solo como referencia visual)

Sirve para ver cómo convive ícono + texto; **el texto final lo componemos en DM Sans**, no se usa el de la imagen.

```
Horizontal logo lockup for a healthy food brand: [describe the chosen icon here] on the left, and the wordmark "Alta Proteína" (exact spelling, with the accent on the i) on the right in a bold friendly geometric sans-serif similar to DM Sans, olive green #5B6B2F. Small orange #E8772E accent only in the icon. Plain cream background #F5EFE0, flat vector style, no gradients, no shadows, no mockup, no tagline.
```

---

## Qué entregar

- La(s) variante(s) elegida(s) en PNG, en `docs/logo/` del repo o en `D:\Downloads\ALTA PROTEINA fotos\logo\`.
- Si dudan entre dos, suban ambas: las montamos en la web y en un círculo de perfil para compararlas.
