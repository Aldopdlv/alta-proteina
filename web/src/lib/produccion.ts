/**
 * Resumen de producción (ESPECIFICACION.md §6). Puro y probado.
 *
 * - Solo pedidos pagados y preparados.
 * - Porciones: platos = cantidad; pack = unidades × cantidad, repartidas según
 *   la mezcla, o en la fila "Mix de la casa (pack)".
 * - Salsas: 1 incluida por porción + extras. Los packs no eligen salsa
 *   incluida en el diseño: cuentan como "Salsa a elección de la cocina".
 * - Pollo crudo = Σ porciones × pollo cocido ÷ rendimiento.
 */

export interface LineaProduccion {
  base_nombre: string;
  es_pack: boolean;
  pack_unidades: number | null;
  pollo_cocido_g: number;
  cantidad: number;
  marinado_nombre: string | null;
  salsa_nombre: string | null;
  salsas_extra: { id: string; nombre: string }[];
  pack_modo: 'mezcla' | 'mix-casa' | null;
  pack_mezcla: { id: string; nombre: string; n: number }[] | null;
}

export const MIX_CASA = 'Mix de la casa (pack)';
export const SALSA_COCINA = 'Salsa a elección de la cocina (packs)';

export interface ResumenProduccion {
  productos: { producto: string; total: number; filas: { marinado: string; n: number }[] }[];
  salsas: { nombre: string; n: number }[];
  totalPorciones: number;
  polloCrudoG: number;
}

export function resumirProduccion(lineas: LineaProduccion[], rendimiento: number): ResumenProduccion {
  const porc = new Map<string, Map<string, number>>();
  const salsas = new Map<string, number>();
  let total = 0;
  let polloCocido = 0;

  const sumar = (producto: string, marinado: string, n: number) => {
    if (!porc.has(producto)) porc.set(producto, new Map());
    const m = porc.get(producto)!;
    m.set(marinado, (m.get(marinado) ?? 0) + n);
  };
  const salsa = (nombre: string, n: number) => salsas.set(nombre, (salsas.get(nombre) ?? 0) + n);

  for (const l of lineas) {
    const porciones = l.es_pack ? (l.pack_unidades ?? 0) * l.cantidad : l.cantidad;
    total += porciones;
    polloCocido += porciones * l.pollo_cocido_g;

    if (l.es_pack) {
      if (l.pack_modo === 'mezcla' && l.pack_mezcla) {
        for (const m of l.pack_mezcla) if (m.n > 0) sumar(l.base_nombre, m.nombre, m.n * l.cantidad);
      } else {
        sumar(l.base_nombre, MIX_CASA, porciones);
      }
      salsa(SALSA_COCINA, porciones);
    } else {
      sumar(l.base_nombre, l.marinado_nombre ?? 'Sin marinado', porciones);
      if (l.salsa_nombre) salsa(l.salsa_nombre, porciones);
    }
    for (const e of l.salsas_extra ?? []) salsa(e.nombre, l.cantidad);
  }

  return {
    productos: [...porc.entries()].map(([producto, filas]) => ({
      producto,
      total: [...filas.values()].reduce((a, b) => a + b, 0),
      filas: [...filas.entries()].map(([marinado, n]) => ({ marinado, n })),
    })),
    salsas: [...salsas.entries()].sort((a, b) => b[1] - a[1]).map(([nombre, n]) => ({ nombre, n })),
    totalPorciones: total,
    polloCrudoG: rendimiento > 0 ? polloCocido / rendimiento : 0,
  };
}
