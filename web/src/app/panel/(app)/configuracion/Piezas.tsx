'use client';

import { useActionState, useState } from 'react';
import type { Resultado } from './acciones';

/** Sección del acordeón con su propio formulario y "Guardar cambios". */
export function Seccion({
  titulo,
  primera = false,
  abiertaInicial = false,
  accion,
  children,
}: {
  titulo: string;
  primera?: boolean;
  abiertaInicial?: boolean;
  accion: (p: Resultado, f: FormData) => Promise<Resultado>;
  children: React.ReactNode;
}) {
  const [abierta, setAbierta] = useState(abiertaInicial);
  const [r, enviar, enviando] = useActionState(accion, null);
  return (
    <div className={primera ? '' : 'border-t border-solid border-borde'}>
      <button
        type="button"
        onClick={() => setAbierta(!abierta)}
        aria-expanded={abierta}
        className="flex min-h-[56px] w-full cursor-pointer items-center justify-between gap-3 border-0 bg-transparent px-4 text-left font-titulo text-base font-semibold text-tinta"
      >
        <span>{titulo}</span>
        <span aria-hidden="true" className="flex h-7 w-7 items-center justify-center rounded-full bg-oliva-claro text-lg text-oliva">
          {abierta ? '−' : '+'}
        </span>
      </button>
      <form action={enviar} className={abierta ? 'flex flex-col gap-2 px-4 pb-4' : 'hidden'}>
        {children}
        <div className="mt-1.5 flex flex-wrap items-center gap-3">
          <button type="submit" disabled={enviando} className="btn-oliva min-h-[44px] px-[18px] text-sm disabled:opacity-60">
            {enviando ? 'Guardando…' : 'Guardar cambios'}
          </button>
          {r && (
            <span role="status" className={`text-sm font-medium ${r.ok ? 'text-exito' : 'text-error'}`}>
              {r.mensaje}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

export function Fila({ etiqueta, children, nota }: { etiqueta: React.ReactNode; children: React.ReactNode; nota?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2.5 border-b border-solid border-borde-tenue py-2">
      <span className="flex flex-[1_1_160px] flex-col text-sm font-medium">
        {etiqueta}
        {nota && <span className="text-xs font-normal text-tinta-suave">{nota}</span>}
      </span>
      <div className="flex flex-wrap items-center gap-2.5">{children}</div>
    </div>
  );
}

export function Interruptor({ nombre, inicial, etiquetas = ['Activo', 'Inactivo'] }: { nombre: string; inicial: boolean; etiquetas?: [string, string] }) {
  const [on, setOn] = useState(inicial);
  return (
    <label className="flex min-h-[44px] cursor-pointer items-center gap-2 text-[13px] text-tinta-suave">
      <input type="checkbox" name={nombre} checked={on} onChange={(e) => setOn(e.target.checked)} className="peer sr-only" />
      <span className="relative h-6 w-11 rounded-full transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-oliva" style={{ background: on ? '#5B6B2F' : '#D6CFBD' }}>
        <span className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-[left]" style={{ left: on ? 22 : 2 }} />
      </span>
      {on ? etiquetas[0] : etiquetas[1]}
    </label>
  );
}

export const campoPanel = 'h-10 rounded-[10px] border-[1.5px] border-solid border-borde bg-white px-3 text-sm outline-none focus:border-oliva';
