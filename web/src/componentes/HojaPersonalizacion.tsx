'use client';

import { useEffect, useRef, useState } from 'react';
import { useTienda } from '@/lib/carrito';
import { soles } from '@/lib/formato';
import { IconoCerrar } from './Iconos';
import { Casilla, Radio, Stepper } from './Piezas';
import type { PackModo, Producto } from '@/lib/tipos';

/**
 * Hoja de personalización (README §3): hoja inferior en móvil, modal centrado
 * desde 720 px. Platos: marinado + salsa incluida + extras. Pack: mezcla que
 * suma exactamente las unidades del pack, o "Mix de la casa".
 */
export function HojaPersonalizacion({ producto, alCerrar }: { producto: Producto; alCerrar: () => void }) {
  const t = useTienda();
  const { marinados, salsas, config } = t.catalogo;
  const esPack = producto.categoria === 'packs';
  const unidades = producto.packUnidades ?? 7;

  const [marinado, setMarinado] = useState(marinados[0]?.id);
  const [salsa, setSalsa] = useState(salsas[0]?.id);
  const [extras, setExtras] = useState<string[]>([]);
  const [cantidad, setCantidad] = useState(1);
  const [modo, setModo] = useState<PackModo>('mezcla');
  const [mezcla, setMezcla] = useState<Record<string, number>>(() => (marinados[0] ? { [marinados[0].id]: unidades } : {}));
  const dialogo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previo = document.activeElement as HTMLElement | null;
    dialogo.current?.focus();
    const alTeclado = (e: KeyboardEvent) => e.key === 'Escape' && alCerrar();
    document.addEventListener('keydown', alTeclado);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', alTeclado);
      document.body.style.overflow = overflow;
      previo?.focus?.();
    };
  }, [alCerrar]);

  const sumaMezcla = Object.values(mezcla).reduce((a, b) => a + b, 0);
  const faltan = unidades - sumaMezcla;
  const incompleto = esPack && modo === 'mezcla' && faltan !== 0;
  const total = (producto.precio + extras.length * config.precioSalsaExtra) * cantidad;

  const confirmar = () => {
    if (incompleto) return;
    t.agregarLinea(
      esPack
        ? { productoId: producto.id, cantidad, extras, packModo: modo, mezcla: modo === 'mezcla' ? mezcla : undefined }
        : { productoId: producto.id, cantidad, extras, marinadoId: marinado, salsaId: salsa },
    );
    alCerrar();
  };

  const opcion = (on: boolean) =>
    `flex cursor-pointer gap-3 rounded-xl border-[1.5px] border-solid px-3.5 py-3 text-left text-tinta ${on ? 'border-oliva bg-oliva-claro' : 'border-borde bg-white'}`;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-end bg-[rgba(43,43,43,0.45)] hoja:justify-center" onClick={alCerrar}>
      <div
        ref={dialogo}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={producto.nombre}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92%] w-full max-w-[520px] flex-col overflow-hidden rounded-t-3xl bg-white shadow-hoja outline-none hoja:max-h-[88%] hoja:rounded-3xl"
      >
        <div className="flex flex-col gap-2 border-b border-solid border-borde px-5 pb-3.5 pt-2.5">
          <span aria-hidden="true" className="h-1 w-10 self-center rounded-full bg-borde" />
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-0.5">
              <h2 className="m-0 font-titulo text-[22px] font-bold leading-[1.25] tracking-[-0.01em]">{producto.nombre}</h2>
              <span className="font-titulo text-base font-semibold text-tinta-suave">{soles(producto.precio)}</span>
            </div>
            <button type="button" onClick={alCerrar} aria-label="Cerrar" className="-mr-2.5 -mt-1 flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border-0 bg-transparent text-tinta hover:bg-crema">
              <IconoCerrar tamano={22} />
            </button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-auto p-5">
          {esPack ? (
            <>
              <fieldset className="m-0 flex flex-col gap-2 border-0 p-0" role="radiogroup">
                <legend className="mb-2.5 p-0 font-titulo text-base font-semibold">Marinado para tu pack</legend>
                {(
                  [
                    ['mezcla', 'Elige tu mezcla'],
                    ['mix-casa', 'Mix de la casa (nosotros combinamos)'],
                  ] as const
                ).map(([id, label]) => (
                  <button key={id} type="button" role="radio" aria-checked={modo === id} onClick={() => setModo(id)} className={`${opcion(modo === id)} min-h-[52px] items-center text-[15px] font-medium`}>
                    <Radio marcado={modo === id} />
                    <span>{label}</span>
                  </button>
                ))}
              </fieldset>
              {modo === 'mezcla' && (
                <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
                  <legend className="mb-2.5 flex w-full items-baseline justify-between gap-2 p-0">
                    <span className="font-titulo text-base font-semibold">Tu mezcla</span>
                    <span className="text-sm font-semibold" style={{ color: faltan === 0 ? '#3E7C4A' : '#6E5108' }} aria-live="polite">
                      {sumaMezcla} de {unidades} elegidos
                    </span>
                  </legend>
                  {marinados.map((m) => {
                    const n = mezcla[m.id] ?? 0;
                    const cambiar = (v: number) => setMezcla((x) => ({ ...x, [m.id]: v }));
                    return (
                      <div key={m.id} className="flex min-h-[56px] items-center justify-between gap-3 rounded-xl border-[1.5px] border-solid border-borde py-1.5 pl-3.5 pr-1.5">
                        <span className="font-titulo text-[15px] font-semibold">{m.nombre}</span>
                        <div className="flex items-center">
                          <button type="button" aria-label={`Quitar uno de ${m.nombre}`} disabled={n === 0} onClick={() => cambiar(n - 1)} className="h-11 w-11 cursor-pointer border-0 bg-transparent font-titulo text-xl font-semibold text-oliva disabled:cursor-not-allowed disabled:text-borde-apagado">
                            −
                          </button>
                          <span className="num min-w-[20px] text-center font-titulo text-base font-semibold">{n}</span>
                          <button type="button" aria-label={`Agregar uno de ${m.nombre}`} disabled={faltan <= 0} onClick={() => cambiar(n + 1)} className="h-11 w-11 cursor-pointer border-0 bg-transparent font-titulo text-xl font-semibold text-oliva disabled:cursor-not-allowed disabled:text-borde-apagado">
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </fieldset>
              )}
            </>
          ) : (
            <>
              <fieldset className="m-0 flex flex-col gap-2 border-0 p-0" role="radiogroup">
                <legend className="mb-2.5 p-0 font-titulo text-base font-semibold">
                  Marinado <span className="font-texto text-sm font-normal text-tinta-suave">(elige uno)</span>
                </legend>
                {marinados.map((m) => (
                  <button key={m.id} type="button" role="radio" aria-checked={marinado === m.id} onClick={() => setMarinado(m.id)} className={`${opcion(marinado === m.id)} min-h-[56px] items-start`}>
                    <span className="mt-px">
                      <Radio marcado={marinado === m.id} />
                    </span>
                    <span className="flex flex-col gap-0.5">
                      <span className="font-titulo text-[15px] font-semibold leading-[1.3]">{m.nombre}</span>
                      {m.descripcion && <span className="text-[13px] leading-[1.4] text-tinta-suave">{m.descripcion}</span>}
                    </span>
                  </button>
                ))}
              </fieldset>
              <fieldset className="m-0 border-0 p-0" role="radiogroup">
                <legend className="mb-2.5 p-0 font-titulo text-base font-semibold">
                  Salsa incluida <span className="font-texto text-sm font-normal text-tinta-suave">(elige una)</span>
                </legend>
                <div className="flex flex-wrap gap-2">
                  {salsas.map((s) => {
                    const on = salsa === s.id;
                    return (
                      <button key={s.id} type="button" role="radio" aria-checked={on} onClick={() => setSalsa(s.id)} className={`min-h-[44px] cursor-pointer rounded-full border-[1.5px] border-solid px-3.5 text-sm font-medium leading-none ${on ? 'border-oliva bg-oliva text-white' : 'border-borde bg-white text-tinta'}`}>
                        {s.nombre}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            </>
          )}

          <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
            <legend className="mb-1 p-0 font-titulo text-base font-semibold">
              Salsas extra <span className="font-texto text-sm font-normal text-tinta-suave">(opcional)</span>
            </legend>
            <p className="m-0 mb-1.5 text-[13px] text-tinta-suave">
              {esPack ? `Cada salsa extra: ${soles(config.precioSalsaExtra)} por pack.` : `1 salsa incluida. Cada salsa extra: ${soles(config.precioSalsaExtra)}.`}
            </p>
            {salsas.map((s) => {
              const on = extras.includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  role="checkbox"
                  aria-checked={on}
                  onClick={() => setExtras((x) => (on ? x.filter((y) => y !== s.id) : [...x, s.id]))}
                  className={`${opcion(on)} min-h-[48px] items-center py-0`}
                >
                  <Casilla marcada={on} tamano={20} />
                  <span className="flex-1 text-[15px] font-medium leading-[1.3]">{s.nombre}</span>
                  <span className="font-titulo text-sm font-medium text-tinta-suave">+ {soles(config.precioSalsaExtra)}</span>
                </button>
              );
            })}
          </fieldset>
        </div>

        <div className="flex items-center gap-3 border-t border-solid border-borde px-5 pb-[18px] pt-3.5">
          <Stepper valor={cantidad} menos={() => setCantidad((c) => Math.max(1, c - 1))} mas={() => setCantidad((c) => Math.min(30, c + 1))} alto={46} etiqueta="Cantidad" deshabilitarMenos={cantidad <= 1} />
          <button type="button" onClick={confirmar} disabled={incompleto} className="btn-cta num min-h-[50px] flex-1 px-4">
            {incompleto ? `Elige ${faltan > 0 ? faltan : 0} más` : `Agregar · ${soles(total)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
