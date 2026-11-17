/**
 * Imágenes FIJAS de la web (public/img), referenciales hechas con IA
 * (17-nov-2026): reemplazar por fotos reales antes del lanzamiento.
 * Las fotos de cada producto, en cambio, se suben desde el panel.
 */

/** "Así te llega": foto del empaque por producto (solo los que la tienen). */
const EMPAQUE: Record<string, string> = {
  'burrito-pollo': '/img/entrega-burrito-pollo.webp',
  'quesadilla-pollo': '/img/entrega-quesadilla-pollo.webp',
  'arroz-pollo': '/img/entrega-arroz-pollo.webp',
  'fideos-pollo': '/img/entrega-fideos-pollo.webp',
  'pack-7': '/img/entrega-pack-7.webp',
};

export function imagenEmpaque(productoId: string): string | null {
  return EMPAQUE[productoId] ?? null;
}

/** Fotos de los tres pasos de "Así de simple", en orden. */
export const IMAGENES_PASOS = [
  { src: '/img/paso-1-marinados.webp', alt: 'Los cuatro marinados de pollo en bowls' },
  { src: '/img/paso-2-empaque.webp', alt: 'Una porción sellada y etiquetada, con su salsa aparte' },
  { src: '/img/paso-3-congelador.webp', alt: 'La semana de porciones ordenada en el congelador' },
] as const;
