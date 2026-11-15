/**
 * Precios y totales (ESPECIFICACION.md §3). Puro: lo usan el navegador (para
 * mostrar) y el servidor (que recalcula todo y no confía en el cliente).
 *
 *   lineaUnitario = precioProducto + nSalsasExtra × precioSalsaExtra
 *   lineaTotal    = lineaUnitario × cantidad
 *   subtotal      = Σ lineaTotal
 *   base          = subtotal + delivery
 *   recargo       = tarjeta ? round(base × (base < umbral ? bajo : alto)) : 0
 *   total         = base + recargo
 */

import type { Catalogo, Config, LineaCarrito, Medio, Opcion, Producto } from './tipos';

export const MAX_POR_LINEA = 30;

export interface LineaResuelta {
  linea: LineaCarrito;
  producto: Producto;
  /** Plato que se cocina (en packs, el producto base). */
  base: Producto;
  marinado: Opcion | null;
  salsa: Opcion | null;
  extras: Opcion[];
  mezcla: { marinado: Opcion; n: number }[] | null;
  unitario: number;
  total: number;
  detalle: string;
}

export type ResultadoLinea = { ok: true; valor: LineaResuelta } | { ok: false; error: string };

function activa<T extends { activo: boolean }>(lista: T[], id: string | undefined): T | undefined {
  return id ? lista.find((x) => (x as unknown as { id: string }).id === id && x.activo) : undefined;
}

/** Texto de detalle de la línea, como en el diseño del carrito. */
export function textoDetalle(r: Omit<LineaResuelta, 'detalle' | 'total' | 'unitario' | 'linea' | 'base'> & { linea: LineaCarrito }): string {
  const ext = r.extras.length ? ` · Extra: ${r.extras.map((e) => e.nombre).join(', ')}` : '';
  if (r.producto.categoria === 'packs') {
    const mezcla =
      r.linea.packModo === 'mix-casa'
        ? 'Mix de la casa'
        : (r.mezcla ?? []).filter((m) => m.n > 0).map((m) => `${m.n} ${m.marinado.nombre}`).join(', ');
    return `${mezcla}${ext}`;
  }
  return `${r.marinado?.nombre ?? ''} · Salsa: ${r.salsa?.nombre ?? ''}${ext}`;
}

/** Valida una línea contra el catálogo vigente y le pone precio. */
export function resolverLinea(l: LineaCarrito, cat: Catalogo): ResultadoLinea {
  const producto = cat.productos.find((p) => p.id === l.productoId && p.activo);
  if (!producto) return { ok: false, error: 'Uno de los platos ya no está en el menú de esta semana.' };
  if (!Number.isInteger(l.cantidad) || l.cantidad < 1 || l.cantidad > MAX_POR_LINEA) {
    return { ok: false, error: 'Revisa las cantidades de tu pedido.' };
  }

  const salsasActivas = cat.salsas.filter((s) => s.activo);
  const extrasIds = Array.from(new Set(Array.isArray(l.extras) ? l.extras : []));
  const extras: Opcion[] = [];
  for (const id of extrasIds) {
    const s = activa(salsasActivas, id);
    if (!s) return { ok: false, error: 'Una de las salsas elegidas ya no está disponible.' };
    extras.push(s);
  }
  extras.sort((a, b) => a.orden - b.orden);

  let base = producto;
  let marinado: Opcion | null = null;
  let salsa: Opcion | null = null;
  let mezcla: LineaResuelta['mezcla'] = null;

  if (producto.categoria === 'packs') {
    const contenido = cat.productos.find((p) => p.id === producto.packProductoId);
    if (!contenido || !producto.packUnidades) return { ok: false, error: 'El pack no está bien configurado.' };
    base = contenido;
    if (l.packModo === 'mix-casa') {
      mezcla = null;
    } else if (l.packModo === 'mezcla') {
      const filas: { marinado: Opcion; n: number }[] = [];
      let suma = 0;
      for (const [id, n] of Object.entries(l.mezcla ?? {})) {
        if (!Number.isInteger(n) || n < 0) return { ok: false, error: 'Revisa la mezcla de tu pack.' };
        if (n === 0) continue;
        const m = activa(cat.marinados, id);
        if (!m) return { ok: false, error: 'Uno de los marinados de tu pack ya no está disponible.' };
        filas.push({ marinado: m, n });
        suma += n;
      }
      if (suma !== producto.packUnidades) {
        return { ok: false, error: `La mezcla del pack debe sumar ${producto.packUnidades}.` };
      }
      mezcla = filas.sort((a, b) => a.marinado.orden - b.marinado.orden);
    } else {
      return { ok: false, error: 'Elige la mezcla de tu pack.' };
    }
  } else {
    const m = activa(cat.marinados, l.marinadoId);
    const s = activa(salsasActivas, l.salsaId);
    if (!m) return { ok: false, error: 'Uno de los marinados elegidos ya no está disponible.' };
    if (!s) return { ok: false, error: 'Una de las salsas elegidas ya no está disponible.' };
    marinado = m;
    salsa = s;
  }

  const unitario = producto.precio + extras.length * cat.config.precioSalsaExtra;
  const parcial = { linea: l, producto, marinado, salsa, extras, mezcla };
  return {
    ok: true,
    valor: { ...parcial, base, unitario, total: unitario * l.cantidad, detalle: textoDetalle(parcial) },
  };
}

export function recargoPct(base: number, medio: Medio, c: Config): number {
  if (medio !== 'tarjeta') return 0;
  return base < c.recargoUmbral ? c.recargoBajoPct : c.recargoAltoPct;
}

export interface Totales {
  subtotal: number;
  delivery: number;
  base: number;
  recargoPct: number;
  recargo: number;
  total: number;
}

export function totales(subtotal: number, delivery: number, medio: Medio, c: Config): Totales {
  const base = subtotal + delivery;
  const pct = recargoPct(base, medio, c);
  const recargo = Math.round((base * pct) / 100);
  return { subtotal, delivery, base, recargoPct: pct, recargo, total: base + recargo };
}

/** Lo que el pack ahorra frente a comprar sus platos sueltos (se calcula, no se escribe). */
export function ahorroPack(pack: Producto, productos: Producto[]): { sinPack: number; ahorro: number } {
  const base = productos.find((p) => p.id === pack.packProductoId);
  const sinPack = base && pack.packUnidades ? base.precio * pack.packUnidades : pack.precio;
  return { sinPack, ahorro: Math.max(0, sinPack - pack.precio) };
}

/** Porciones (platos) que representa una línea: el pack cuenta sus unidades. */
export function porcionesLinea(producto: Producto, cantidad: number): number {
  return producto.categoria === 'packs' ? (producto.packUnidades ?? 0) * cantidad : cantidad;
}

/** Primer marinado y primera salsa activos: la elección del botón "Agregar" rápido. */
export function opcionesPorDefecto(cat: Catalogo): { marinadoId?: string; salsaId?: string } {
  const m = cat.marinados.filter((x) => x.activo).sort((a, b) => a.orden - b.orden)[0];
  const s = cat.salsas.filter((x) => x.activo).sort((a, b) => a.orden - b.orden)[0];
  return { marinadoId: m?.id, salsaId: s?.id };
}
