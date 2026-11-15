# Prompts de imágenes para Higgsfield (15-nov-2026)

**Para quién:** Claude AI (o quien genere las imágenes en Higgsfield).
**Para qué:** tener las fotos que faltan en la web y material para mostrarle el proyecto a un posible socio.
**Fuente de verdad del producto:** `web/db/seed.sql` (platos, marinados y salsas) y `claude-design/01-marca.md` (marca).

## Cómo usar este documento

1. **Un solo modelo fotorrealista para todo el set.** Elegir el que mejor haga comida (si dudas, `models_explore` con action `recommend`) y no cambiarlo a mitad del set, para que todas las fotos se vean de la misma sesión.
2. **Primero el burrito (imagen 2).** Generar 3 o 4 variantes, elegir una con Aldo y usarla como **imagen de referencia de estilo** en todas las demás (misma luz, mismo fondo, mismo plato). Así el set queda coherente.
3. **Los prompts van en inglés** (los modelos de imagen responden mejor). Cada prompt es autónomo: se copia completo, sin juntarlo con otros.
4. **Nunca pedir texto dentro de la imagen.** Los modelos escriben mal. Las etiquetas de los envases van **en blanco**; los textos ("150 g de pollo", precios) ya los pone la web encima.
5. **Comida honesta.** Porciones realistas (150 g de pollo cocido por plato), que se vea casera y apetitosa, no de comida rápida ni de gimnasio extremo.

## Estilo común (ya está dentro de cada prompt)

| Elemento | Decisión | Por qué |
|---|---|---|
| Fondo | Crema cálido (#F5EFE0) o madera clara de roble | Es el fondo de la web; la foto se funde con la página |
| Luz | Natural, suave, de ventana lateral, de día | Fresco y real, no estudio frío |
| Vajilla | Platos y bowls de gres mate blanco hueso | Limpio, deja que el color lo ponga la comida |
| Acento oliva | Servilleta de lino verde oliva (#5B6B2F) | Color principal de la marca |
| Acento naranja | Potecito de salsa de cerámica naranja (#E8772E) | Color de acción de la marca; además la salsa va aparte |
| Ángulo | Cenital (desde arriba) o 45° | Lo pide el brief de diseño |
| Prohibido | Texto, logos, manos (salvo las de estilo de vida), mancuernas, shakers, fondos oscuros | Marca "salud práctica", no gimnasio |

## Lista de imágenes

| # | Archivo | Dónde va | Formato | Prioridad |
|---|---|---|---|---|
| 1 | `heroe-tu-semana-resuelta` | Inicio, al lado del título | 16:9, 1920×1080 | Imprescindible |
| 2 | `burrito-pollo` | Tarjeta del menú | 4:3, 1600×1200 | Imprescindible |
| 3 | `quesadilla-pollo` | Tarjeta del menú | 4:3, 1600×1200 | Imprescindible |
| 4 | `arroz-pollo` | Tarjeta del menú | 4:3, 1600×1200 | Imprescindible |
| 5 | `fideos-pollo` | Tarjeta del menú | 4:3, 1600×1200 | Imprescindible |
| 6 | `pack-7` | Tarjeta del pack semanal | 4:3, 1600×1200 | Imprescindible |
| 7 | `og-compartir` | Vista previa al compartir el link por WhatsApp | 1,91:1, 1200×630 | Recomendada |
| 8 | `empaque-porcion` | Demo al socio: cómo llega el producto | 4:5, 1080×1350 | Opcional |
| 9 | `congelador-semana` | Demo al socio: la semana en el congelador | 4:5, 1080×1350 | Opcional |
| 10 | `microondas-4-min` | Demo al socio y redes: lista en 4 minutos | 4:5, 1080×1350 | Opcional |
| 11 | `cuatro-marinados` | Demo al socio y menú: los 4 sabores | 1:1, 1200×1200 | Opcional |

**Regla de composición de las tarjetas (2 a 6):** la web pone dos etiquetas en la **esquina superior izquierda** ("150 g de pollo" y "≈ 45 g de proteína"). Esa esquina debe quedar con fondo liso, y el plato centrado o un poco a la derecha. Además, la tarjeta recorta los bordes, así que dejar aire alrededor del plato.

**Variedad de marinados:** cada plato muestra un marinado distinto, para que el set enseñe los cuatro sabores: burrito con ají panca, quesadilla con achiote, arroz con teriyaki y fideos con limón, ajo y orégano.

---

## 1. Héroe: "Tu semana resuelta" (16:9)

Va a la derecha del título "Comida de verdad, sin complicarte." en escritorio, y debajo en el celular. Tiene que transmitir "mi semana de comida, lista y ordenada".

```
Wide overhead food photography of a week of healthy meal-prep portions neatly arranged on a light oak table with a warm cream linen tablecloth (#F5EFE0). Seven portions in matte off-white stoneware bowls and kraft paper containers with blank kraft labels: a burrito cut in half showing chicken, rice and beans; a golden chicken quesadilla cut in triangles; white rice with diced vegetables topped with glazed teriyaki chicken and sesame; short penne pasta with lemon-garlic-oregano chicken and herbs. Two small orange ceramic sauce cups (#E8772E) with a pale yellow ají amarillo cream and green chimichurri. An olive green linen napkin (#5B6B2F) folded at one side. Soft natural window daylight from the left, gentle shadows, fresh and honest home-cooked look, realistic portion sizes, generous visible chicken. Calm, organized, airy composition with breathing space, horizontal 16:9. Photorealistic, high detail, true-to-life colors. No text, no letters, no logos, no hands, no gym props, no dark background.
```

## 2. Burrito de pollo (4:3)

Producto real: pollo marinado (ají panca), arroz, frejoles y vegetales envueltos en tortilla de trigo.

```
Food photography of a chicken burrito cut diagonally in half on a matte off-white stoneware plate, the cut side facing the camera showing a generous filling of shredded chicken marinated in Peruvian ají panca (smoky reddish-brown), white rice, red beans and sautéed bell peppers and onion, wrapped in a lightly toasted flour tortilla with subtle golden grill marks. A small orange ceramic sauce cup (#E8772E) with pale yellow creamy ají amarillo sauce beside the plate. Olive green linen napkin (#5B6B2F) partly under the plate. Warm cream background (#F5EFE0) and light oak surface. 45-degree angle, soft natural window light from the left, shallow depth of field. Plate centered slightly to the right, the top-left area of the frame left as clean empty background. Realistic single-portion size, appetizing, honest home-cooked look, not greasy. Horizontal 4:3. Photorealistic, high detail. No text, no logos, no hands, no cutlery clutter.
```

## 3. Quesadilla de pollo (4:3)

Producto real: pollo marinado (achiote) y queso fundido en tortilla dorada.

```
Food photography of a golden crispy chicken quesadilla cut into three triangles on a matte off-white stoneware plate, one triangle slightly pulled away showing melted stretchy white cheese and diced chicken marinated in achiote (deep orange-red color). A small orange ceramic sauce cup (#E8772E) with fresh Peruvian salsa criolla (thin red onion slices, lime, cilantro) beside the plate. Olive green linen napkin (#5B6B2F) folded at the edge. Warm cream background (#F5EFE0) and light oak surface. 45-degree angle, soft natural window light from the left, shallow depth of field. Plate centered slightly to the right, the top-left area of the frame left as clean empty background. Realistic single-portion size, appetizing, honest home-cooked look, not greasy. Horizontal 4:3. Photorealistic, high detail. No text, no logos, no hands.
```

## 4. Arroz con pollo (4:3)

Producto real: pollo marinado sobre arroz con verduras, salsa aparte. **Ojo:** no es el arroz con pollo peruano tradicional (arroz verde con culantro). Es un bowl de arroz blanco con verduras. Si Aldo prefiere el arroz verde tradicional, cambiar la frase "white rice with diced carrots, peas and sweet corn" por "Peruvian green cilantro rice with peas, carrots and red bell pepper".

```
Overhead food photography of a meal-prep bowl: fluffy white rice with diced carrots, peas and sweet corn, topped with sliced grilled chicken breast glazed in teriyaki (glossy amber-brown), sprinkled with toasted sesame seeds and thin green onion. Matte off-white stoneware bowl. A small orange ceramic sauce cup (#E8772E) with extra teriyaki sauce beside the bowl. Olive green linen napkin (#5B6B2F) at one side. Warm cream background (#F5EFE0) and light oak surface. Top-down view, soft natural window light from the left, gentle shadows. Bowl centered slightly to the right, the top-left area of the frame left as clean empty background. Realistic single-portion size with generous visible chicken, appetizing, honest home-cooked look. Horizontal 4:3. Photorealistic, high detail. No text, no logos, no hands.
```

## 5. Fideos con pollo (4:3)

Producto real: pasta corta al dente con pollo marinado, salsa aparte.

```
Food photography of short penne pasta al dente tossed with olive oil and pieces of grilled chicken marinated in lemon, garlic and oregano (golden with visible herb flecks), with a few cherry tomato halves and fresh parsley, in a matte off-white stoneware bowl. A small orange ceramic sauce cup (#E8772E) with creamy yellow Peruvian huancaína sauce beside the bowl. Olive green linen napkin (#5B6B2F) partly under the bowl. Warm cream background (#F5EFE0) and light oak surface. 45-degree angle, soft natural window light from the left, shallow depth of field. Bowl centered slightly to the right, the top-left area of the frame left as clean empty background. Realistic single-portion size with generous visible chicken, appetizing, honest home-cooked look. Horizontal 4:3. Photorealistic, high detail. No text, no logos, no hands.
```

## 6. Pack semanal x7 (4:3)

Producto real: 7 burritos para toda la semana, con mezcla de marinados.

```
Overhead food photography of seven chicken burritos for the week arranged in a neat orderly grid on a light oak board over a warm cream linen tablecloth (#F5EFE0). Six burritos wrapped in kraft paper with blank kraft labels and twine, one burrito unwrapped and cut in half showing chicken, rice, beans and peppers. The cut halves show two different marinades: smoky reddish ají panca chicken and deep orange achiote chicken. Two small orange ceramic sauce cups (#E8772E) and an olive green linen napkin (#5B6B2F) at the edge. Top-down view, soft natural daylight, gentle shadows. Composition centered slightly to the right, the top-left area of the frame left as clean empty background. Feels organized, abundant and practical: a whole week solved. Horizontal 4:3. Photorealistic, high detail. No text on the labels, no logos, no hands.
```

## 7. Imagen para compartir el link (1200×630)

Es la vista previa que sale en WhatsApp al mandar el link de la web (por ejemplo, al posible socio). La web todavía no tiene esta imagen conectada: cuando exista, Claude Code la agrega en los metadatos. Se puede usar como base la imagen 1 recortada; este prompt es por si se quiere una dedicada, con espacio a la izquierda para poner el logo después.

```
Horizontal food photography banner, 1.91:1 aspect ratio. On the right two thirds: a burrito cut in half showing chicken filling, a golden quesadilla triangle and a bowl of rice with teriyaki chicken, on matte off-white stoneware over a light oak surface, with a small orange ceramic sauce cup (#E8772E) and an olive green linen napkin (#5B6B2F). On the left third: clean, empty, smooth warm cream background (#F5EFE0) with nothing on it, reserved for a logo. Soft natural window light, fresh and honest home-cooked look, airy composition. Photorealistic, high detail. No text, no letters, no logos, no hands.
```

---

## Opcionales para la demo al socio

Sirven para explicar el modelo de negocio (congelado, bajo pedido, se recalienta en 4 minutos). No van en la web por ahora. Si se quieren para Instagram, sacar también una versión 9:16 con el mismo prompt.

### 8. La porción como llega (4:5)

```
Product photography of a single frozen meal portion in a clear vacuum-sealed bag inside a kraft paper sleeve with a blank kraft label, showing a chicken burrito with light frost crystals, standing on a light oak surface with a warm cream background (#F5EFE0). Beside it, a small sealed sauce cup with an orange lid (#E8772E). An olive green linen napkin (#5B6B2F) folded in the corner. Soft natural daylight, clean, minimal, premium but approachable packaging. Vertical 4:5. Photorealistic, high detail. No text on the label, no logos, no hands.
```

### 9. La semana en el congelador (4:5)

```
Photography of an open home freezer drawer, neatly organized with seven frozen meal portions in kraft paper sleeves with blank kraft labels, standing upright in a row like files, light frost, soft cool light from the freezer mixed with warm kitchen daylight. A clean modern kitchen with cream walls (#F5EFE0) in the soft-focus background and an olive green kitchen towel (#5B6B2F) hanging nearby. Feels calm, organized and practical: the whole week solved. Vertical 4:5. Photorealistic, high detail. No text on the labels, no logos, no people.
```

### 10. Lista en 4 minutos (4:5)

```
Lifestyle photography in a bright modern home kitchen: a person's hands taking a steaming hot bowl of rice with teriyaki chicken out of a white microwave, wearing a casual knit sweater. Warm cream walls (#F5EFE0), light oak countertop, an olive green kitchen towel (#5B6B2F) and a small orange ceramic sauce cup (#E8772E) on the counter. Morning natural light, relaxed, real and practical feeling, busy weekday vibe, not a gym setting. Only hands and forearms visible, no face. Vertical 4:5. Photorealistic, high detail. No text, no logos.
```

### 11. Los cuatro marinados (1:1)

```
Overhead food photography of four small matte off-white stoneware bowls in a 2x2 grid on a light oak surface over a warm cream linen cloth (#F5EFE0), each with grilled chicken pieces in a different Peruvian-inspired marinade: smoky reddish-brown ají panca with garlic and cumin; deep orange-red achiote; golden lemon, garlic and oregano with herb flecks; glossy amber teriyaki with sesame seeds. Small raw ingredients scattered around each bowl as cues: dried ají panca pepper, achiote seeds, a lemon half and garlic cloves, a few sesame seeds. Olive green linen napkin (#5B6B2F) at one corner and one small orange ceramic cup (#E8772E). Top-down, soft natural daylight, clean and appetizing. Square 1:1. Photorealistic, high detail. No text, no labels, no logos, no hands.
```

---

## Revisión antes de aprobar cada imagen

- El plato coincide con la descripción del menú, sin ingredientes que no lleva el producto.
- Se ve una porción individual realista, no gigante.
- No hay texto, letras raras ni logos inventados. Si los hay, regenerar o borrarlos.
- La esquina superior izquierda está despejada (imágenes 2 a 6).
- Luz, fondo y vajilla iguales a los de la foto de referencia elegida.
- Nada de tenedores deformes, dedos extra ni comida "plástica".

## Entrega

Guardar los archivos con el nombre de la tabla (PNG o JPG a máxima calidad) en `D:\Downloads\ALTA PROTEINA fotos\` y avisar a Claude Code, que:

1. Las convierte a WebP en los tamaños de la tabla.
2. Sube las fotos de producto (2 a 6) desde Panel → Configuración.
3. Conecta el héroe (1) y la imagen para compartir (7), que hoy no se pueden cambiar desde el panel.

> **Importante:** son imágenes **referenciales generadas con IA**. Para la demo al socio están bien. Antes del lanzamiento conviene reemplazarlas por fotos reales del producto del chef, o al menos confirmar que el plato real se ve igual (misma porción e ingredientes), para no prometer algo distinto a lo que llega.

El logo tiene su propio prompt en [PROMPT-logo-higgsfield.md](PROMPT-logo-higgsfield.md).
