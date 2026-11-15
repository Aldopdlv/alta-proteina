'use client';

import { useState } from 'react';
import { useTienda } from '@/lib/carrito';
import { soles } from '@/lib/formato';

/**
 * Resumen de Entrega: plegable arriba en móvil, lateral sticky en escritorio
 * (desde 720 px). El total aún no incluye recargo: eso se ve en Pago.
 */
export function ResumenEntrega({ zonaId, variante }: { zonaId: string; variante: 'movil' | 'lateral' }) {
  const t = useTienda();
  const [abierto, setAbierto] = useState(false);
  const zona = t.catalogo.zonas.find((z) => z.id === zonaId);
  const delivery = zona?.costo ?? 0;
  const deliveryTxt = zona ? (zona.costo === 0 ? 'Gratis' : soles(zona.costo)) : 'Elige tu zona';
  const filas = (
    <>
      {t.lineas.map((l) => (
        <div key={l.linea.key} className="flex justify-between gap-3">
          <span>
            {l.linea.cantidad} × {l.producto.nombre}
          </span>
          <span className="num">{soles(l.total)}</span>
        </div>
      ))}
      <div className="flex justify-between border-t border-solid border-borde pt-2">
        <span>Subtotal</span>
        <span className="num">{soles(t.subtotal)}</span>
      </div>
      <div className="flex justify-between text-tinta-suave">
        <span>{zona ? `Delivery (${zona.nombre})` : 'Delivery'}</span>
        <span>{deliveryTxt}</span>
      </div>
    </>
  );

  if (variante === 'movil') {
    return (
      <div className="tarjeta hoja:hidden">
        <button
          type="button"
          onClick={() => setAbierto(!abierto)}
          aria-expanded={abierto}
          className="flex min-h-[52px] w-full cursor-pointer items-center justify-between gap-3 border-0 bg-transparent px-4 text-tinta"
        >
          <span className="font-titulo text-[15px] font-semibold leading-none">{abierto ? 'Ocultar resumen' : `Ver resumen · ${t.cantidad} ítems`}</span>
          <span className="num font-titulo text-[17px] font-bold leading-none">{soles(t.subtotal + delivery)}</span>
        </button>
        {abierto && <div className="flex flex-col gap-2 px-4 pb-3.5 text-sm">{filas}</div>}
      </div>
    );
  }
  return (
    <aside className="tarjeta sticky top-5 hidden flex-[2_1_300px] flex-col gap-2.5 p-5 text-[15px] hoja:flex">
      <h2 className="m-0 mb-1 font-titulo text-lg font-semibold leading-[1.3]">Resumen</h2>
      {filas}
      <div className="flex items-baseline justify-between border-t border-solid border-borde pt-2.5">
        <span className="font-titulo text-base font-semibold">Total</span>
        <span className="num font-titulo text-[22px] font-bold leading-none">{soles(t.subtotal + delivery)}</span>
      </div>
    </aside>
  );
}
