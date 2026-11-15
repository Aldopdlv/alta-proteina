'use client';

/**
 * Carrito del cliente en localStorage (ESPECIFICACION.md §8): sobrevive a
 * recargas y cortes de red. Sin cuentas. El servidor recalcula todo al crear
 * el pedido; aquí los precios son solo para mostrar.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { opcionesPorDefecto, resolverLinea, type LineaResuelta } from './calculos';
import type { Catalogo, DatosEntrega, LineaCarrito } from './tipos';
import type { EstadoSemana } from './semana';

const CLAVE = 'ap-carrito-v1';
export const CLAVE_ENTREGA = 'ap-entrega-v1';

interface ValorTienda {
  catalogo: Catalogo;
  semana: { entrega: string; cerrado: boolean };
  lineas: LineaResuelta[];
  cantidad: number;
  subtotal: number;
  listo: boolean;
  cantidadDe: (productoId: string) => number;
  agregarRapido: (productoId: string) => void;
  quitarUno: (productoId: string) => void;
  agregarLinea: (l: Omit<LineaCarrito, 'key'>) => void;
  cambiar: (key: string, delta: number) => void;
  quitar: (key: string) => void;
  vaciar: () => void;
}

const Contexto = createContext<ValorTienda | null>(null);
const nuevaClave = () => Math.random().toString(36).slice(2, 10);

function leer(cat: Catalogo): LineaCarrito[] {
  try {
    const v = JSON.parse(localStorage.getItem(CLAVE) ?? '[]');
    if (!Array.isArray(v)) return [];
    // Lo que ya no existe en el menú (o cambió) se descarta en silencio.
    return v.filter((l) => l && typeof l.productoId === 'string' && resolverLinea(l, cat).ok);
  } catch {
    return [];
  }
}

export function TiendaProvider({
  children,
  catalogo,
  semana,
}: {
  children: React.ReactNode;
  catalogo: Catalogo;
  semana: Pick<EstadoSemana, 'entrega' | 'cerrado'>;
}) {
  const [items, setItems] = useState<LineaCarrito[]>([]);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    setItems(leer(catalogo));
    setListo(true);
    const alCambiar = (e: StorageEvent) => {
      if (e.key === CLAVE) setItems(leer(catalogo));
    };
    window.addEventListener('storage', alCambiar);
    return () => window.removeEventListener('storage', alCambiar);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- se lee una vez al montar
  }, []);

  const actualizar = useCallback((f: (actual: LineaCarrito[]) => LineaCarrito[]) => {
    setItems((actual) => {
      const siguiente = f(actual).filter((l) => l.cantidad > 0);
      try {
        localStorage.setItem(CLAVE, JSON.stringify(siguiente));
      } catch {
        /* modo incógnito sin almacenamiento: vive solo en memoria */
      }
      return siguiente;
    });
  }, []);

  const valor = useMemo<ValorTienda>(() => {
    const lineas = items
      .map((l) => resolverLinea(l, catalogo))
      .filter((r): r is { ok: true; valor: LineaResuelta } => r.ok)
      .map((r) => r.valor);
    const def = opcionesPorDefecto(catalogo);
    const primerMarinado = def.marinadoId;

    const esRapida = (l: LineaCarrito, productoId: string) => {
      if (l.productoId !== productoId || l.extras.length) return false;
      const p = catalogo.productos.find((x) => x.id === productoId);
      if (p?.categoria === 'packs') {
        return l.packModo === 'mezcla' && !!primerMarinado && l.mezcla?.[primerMarinado] === p.packUnidades;
      }
      return l.marinadoId === def.marinadoId && l.salsaId === def.salsaId;
    };

    return {
      catalogo,
      semana,
      lineas,
      cantidad: lineas.reduce((s, l) => s + l.linea.cantidad, 0),
      subtotal: lineas.reduce((s, l) => s + l.total, 0),
      listo,
      cantidadDe: (id) => lineas.filter((l) => l.linea.productoId === id).reduce((s, l) => s + l.linea.cantidad, 0),
      agregarRapido: (productoId) =>
        actualizar((actual) => {
          const i = actual.findIndex((l) => esRapida(l, productoId));
          if (i >= 0) return actual.map((l, j) => (j === i ? { ...l, cantidad: l.cantidad + 1 } : l));
          const p = catalogo.productos.find((x) => x.id === productoId);
          const nueva: LineaCarrito =
            p?.categoria === 'packs'
              ? { key: nuevaClave(), productoId, cantidad: 1, extras: [], packModo: 'mezcla', mezcla: primerMarinado ? { [primerMarinado]: p.packUnidades ?? 7 } : {} }
              : { key: nuevaClave(), productoId, cantidad: 1, extras: [], ...def };
          return [...actual, nueva];
        }),
      quitarUno: (productoId) =>
        actualizar((actual) => {
          const i = actual.map((l) => l.productoId).lastIndexOf(productoId);
          return i < 0 ? actual : actual.map((l, j) => (j === i ? { ...l, cantidad: l.cantidad - 1 } : l));
        }),
      agregarLinea: (l) => actualizar((actual) => [...actual, { ...l, key: nuevaClave() }]),
      cambiar: (key, delta) =>
        actualizar((actual) => actual.map((l) => (l.key === key ? { ...l, cantidad: Math.min(30, l.cantidad + delta) } : l))),
      quitar: (key) => actualizar((actual) => actual.filter((l) => l.key !== key)),
      vaciar: () => actualizar(() => []),
    };
  }, [items, listo, catalogo, semana, actualizar]);

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useTienda(): ValorTienda {
  const v = useContext(Contexto);
  if (!v) throw new Error('useTienda debe usarse dentro de <TiendaProvider>');
  return v;
}

export function leerEntrega(): Partial<DatosEntrega> | null {
  try {
    return JSON.parse(sessionStorage.getItem(CLAVE_ENTREGA) ?? 'null');
  } catch {
    return null;
  }
}

export function guardarEntrega(d: DatosEntrega): void {
  try {
    sessionStorage.setItem(CLAVE_ENTREGA, JSON.stringify(d));
  } catch {
    /* sin almacenamiento */
  }
}
