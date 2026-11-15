'use client';

import { useOptimistic, useState, useTransition } from 'react';
import type { PedidoVista } from '@/lib/panel';
import { Casilla } from '@/componentes/Piezas';
import { marcarEntregado } from '../../acciones';

type Fila = PedidoVista & { totalTxt: string };

export function ListaEntregas({ encabezado, textoMotorizado, zonas }: { encabezado: string; textoMotorizado: string; zonas: { zona: string; pedidos: Fila[] }[] }) {
  const [copiado, setCopiado] = useState(false);
  const [, iniciar] = useTransition();
  const todos = zonas.flatMap((z) => z.pedidos);
  const [hechos, marcar] = useOptimistic(
    Object.fromEntries(todos.map((p) => [p.codigo, p.estado === 'entregado'])) as Record<string, boolean>,
    (estado, cambio: { codigo: string; valor: boolean }) => ({ ...estado, [cambio.codigo]: cambio.valor }),
  );

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(textoMotorizado);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1600);
    } catch {
      /* sin portapapeles */
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <span className="text-sm text-tinta-suave">{encabezado}</span>
        <button type="button" onClick={copiar} disabled={todos.length === 0} className="btn-sec min-h-[44px] bg-white px-4 text-sm disabled:opacity-50">
          {copiado ? 'Lista copiada' : 'Copiar lista para el motorizado'}
        </button>
      </div>
      {todos.length === 0 && <div className="rounded-2xl border border-solid border-borde px-5 py-8 text-center text-tinta-suave">Todavía no hay entregas pagadas para esta semana.</div>}
      {zonas.map((z) => (
        <section key={z.zona} className="flex flex-col gap-2">
          <h2 className="m-0 font-titulo text-lg font-bold">
            {z.zona} <span className="font-texto text-sm font-medium text-tinta-suave">· {z.pedidos.length} {z.pedidos.length === 1 ? 'entrega' : 'entregas'}</span>
          </h2>
          {z.pedidos.map((p) => {
            const hecho = hechos[p.codigo];
            return (
              <div key={p.codigo} className="flex items-start gap-3.5 rounded-2xl border border-solid border-borde p-3.5" style={{ opacity: hecho ? 0.55 : 1 }}>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={hecho}
                  aria-label={`Entregado ${p.codigo}`}
                  onClick={() =>
                    iniciar(async () => {
                      marcar({ codigo: p.codigo, valor: !hecho });
                      await marcarEntregado(p.codigo, !hecho);
                    })
                  }
                  className="-ml-1.5 -mt-1.5 flex h-11 w-11 flex-none cursor-pointer items-center justify-center border-0 bg-transparent"
                >
                  <Casilla marcada={hecho} tamano={24} />
                </button>
                <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
                  <div className="flex justify-between gap-2">
                    <span className="font-titulo text-[15px] font-semibold">{p.nombre}</span>
                    <span className="num font-titulo text-[15px] font-semibold">{p.totalTxt}</span>
                  </div>
                  <span className="text-sm">{p.direccion}</span>
                  <span className="text-[13px] text-tinta-suave">{p.referencia || 'Sin referencia'}</span>
                  {p.notas && <span className="text-[13px] text-tinta-suave">Nota: {p.notas}</span>}
                  <span className="text-[13px] text-tinta-suave">
                    {p.resumen} · {p.codigo}
                  </span>
                  <a href={p.wa} className="flex min-h-[36px] items-center self-start text-sm font-medium">
                    WhatsApp {p.celular}
                  </a>
                </div>
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}
