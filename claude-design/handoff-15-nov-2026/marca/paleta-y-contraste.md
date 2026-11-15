# Paleta y contraste — Alta Proteína

Paleta definida en 01-marca.md, verificada contra WCAG 2.1 el 14-nov-2026 (cálculo de luminancia relativa).

## Resultados

| Combinación | Contraste | Veredicto |
|---|---|---|
| Texto `#2B2B2B` sobre crema `#F5EFE0` | 12,3:1 | AA y AAA |
| Oliva `#5B6B2F` sobre crema `#F5EFE0` | 5,1:1 | AA texto normal |
| Blanco sobre oliva `#5B6B2F` | 5,9:1 | AA texto normal |
| Crema sobre oliva | 5,1:1 | AA texto normal |
| Oliva sobre blanco | 5,9:1 | AA texto normal |
| **Texto `#2B2B2B` sobre naranja `#E8772E`** | **4,8:1** | **AA: combinación correcta para botones** |
| Blanco sobre naranja `#E8772E` | 2,9:1 | **Falla** (ni texto grande) |
| Naranja `#E8772E` sobre crema | 2,6:1 | **Falla** como texto |
| Naranja `#E8772E` sobre blanco | 2,9:1 | **Falla** como texto |
| Naranja oscuro `#A84E17` sobre crema | 4,9:1 | AA texto normal |
| Naranja oscuro `#A84E17` sobre blanco | 5,6:1 | AA texto normal |
| Oliva oscuro `#4A5826` sobre crema | 6,7:1 | AA y casi AAA |

## Reglas que salen de aquí

1. **Botón principal:** fondo naranja `#E8772E` + texto oscuro `#2B2B2B`, peso 600. Nunca texto blanco sobre naranja.
2. **El naranja `#E8772E` no es color de texto.** Se usa en fondos de botón, chips de oferta, barras de progreso, íconos decorativos grandes y el punto del wordmark.
3. **Si un texto o enlace debe ser naranja**, usar `#A84E17` (naranja oscuro). Es la única variante de naranja aprobada para texto.
4. **Oliva `#5B6B2F`** sirve para texto sobre crema y blanco; para hover usar `#4A5826`.
5. **Texto sobre oliva** (barra de corte, etiquetas de proteína, botones secundarios rellenos): crema `#F5EFE0` o blanco, ambos pasan.
6. Los **chips de estado** usan texto saturado sobre fondo pálido del mismo tono (ver tokens.css); todos superan 4,5:1.

## Colores de estado añadidos (no estaban en 01-marca.md)

| Estado | Texto | Fondo |
|---|---|---|
| Éxito (pagado, entregado) | `#3E7C4A` | `#E6F0E8` |
| Aviso (pendiente de confirmación) | `#B8860B` | `#FBF3DC` |
| Error (rechazado, validación) | `#B3261E` | `#F9E3E1` |
| Neutro (entregado, inactivo) | `#6B6B6B` | `#ECECEC` |

Se eligieron para convivir con la crema sin competir con el oliva ni el naranja.
