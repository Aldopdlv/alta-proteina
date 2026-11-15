'use client';

import Link from 'next/link';
import { useCallback, useState } from 'react';
import { useTienda } from '@/lib/carrito';
import { enlaceWhatsapp, soles } from '@/lib/formato';
import { textoChipCorte } from '@/lib/textos';
import { TarjetaPack, TarjetaProducto } from '@/componentes/Tarjetas';
import { HojaPersonalizacion } from '@/componentes/HojaPersonalizacion';
import { IconoCalendario, IconoReloj } from '@/componentes/Iconos';

const FILTROS = [
  ['todos', 'Todos'],
  ['burritos-quesadillas', 'Burritos y quesadillas'],
  ['arroz-fideos', 'Arroz y fideos'],
  ['packs', 'Packs'],
] as const;

export function MenuCliente({ hojaInicial }: { hojaInicial: string | null }) {
  const t = useTienda();
  const { productos, config } = t.catalogo;
  const [filtro, setFiltro] = useState<string>('todos');
  const [hoja, setHoja] = useState<string | null>(
    hojaInicial && productos.some((p) => p.id === hojaInicial && p.activo) ? hojaInicial : null,
  );
  const cerrar = useCallback(() => {
    setHoja(null);
    if (location.search.includes('hoja=')) history.replaceState(null, '', '/menu');
  }, []);

  const platos = productos.filter((p) => p.categoria !== 'packs' && (filtro === 'todos' || filtro === p.categoria));
  const packs = productos.filter((p) => p.categoria === 'packs' && p.activo && (filtro === 'todos' || filtro === 'packs'));
  const hayMenu = productos.some((p) => p.activo);
  const producto = productos.find((p) => p.id === hoja);

  return (
    <>
      <main className="contenedor flex flex-1 flex-col gap-5 pb-10 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5">
          <h1 className="h1">Menú de la semana</h1>
          <span className="flex items-center gap-1.5 rounded-full bg-oliva-claro px-3 py-1.5 text-[13px] font-medium text-oliva-oscuro">
            <IconoReloj tamano={14} trazo={2} />
            <span>{textoChipCorte(config, { ...t.semana, corte: new Date() })}</span>
          </span>
        </div>

        {!hayMenu ? (
          <div className="tarjeta flex flex-col items-center gap-3.5 px-6 py-12 text-center">
            <IconoCalendario tamano={56} trazo={1.5} className="text-oliva" />
            <p className="m-0 max-w-[40ch]">Estamos armando el menú de la próxima semana. Escríbenos por WhatsApp y te avisamos cuando esté listo.</p>
            <a href={enlaceWhatsapp(config.whatsapp)} className="btn-oliva">
              Escribir por WhatsApp
            </a>
          </div>
        ) : (
          <>
            <div role="group" aria-label="Filtrar menú" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-0.5">
              {FILTROS.map(([id, label]) => {
                const on = filtro === id;
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setFiltro(id)}
                    className={`min-h-[40px] flex-none cursor-pointer whitespace-nowrap rounded-full border-[1.5px] border-solid border-oliva px-4 font-titulo text-sm font-semibold leading-none ${on ? 'bg-oliva text-white' : 'bg-transparent text-oliva'}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            {!t.listo ? (
              <div aria-busy="true" aria-label="Cargando menú" className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(min(100%,240px),1fr))]">
                {[1, 2, 3, 4].map((k) => (
                  <div key={k} className="flex flex-col overflow-hidden rounded-2xl bg-white">
                    <div className="aspect-[4/3] bg-crema-oscura" />
                    <div className="flex flex-col gap-2.5 p-4">
                      <div className="h-[18px] w-3/5 rounded-md bg-crema-oscura" />
                      <div className="h-3 w-[90%] rounded-md bg-crema-suave" />
                      <div className="h-3 w-[70%] rounded-md bg-crema-suave" />
                      <div className="mt-2 flex justify-between">
                        <div className="h-[22px] w-14 rounded-md bg-crema-oscura" />
                        <div className="h-11 w-24 rounded-xl bg-crema-suave" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(min(100%,240px),1fr))]">
                {platos.map((p) => (
                  <TarjetaProducto key={p.id} p={p} onElegir={() => setHoja(p.id)} />
                ))}
                {packs.map((p) => (
                  <TarjetaPack key={p.id} p={p} onElegir={() => setHoja(p.id)} />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {t.listo && t.cantidad > 0 && (
        <div className="sticky bottom-0 z-10 border-t border-solid border-borde bg-white shadow-hoja">
          <div className="contenedor flex items-center justify-between gap-4 py-3">
            <span className="num font-titulo text-base font-semibold leading-[1.3]">
              {t.cantidad} {t.cantidad === 1 ? 'ítem' : 'ítems'} · {soles(t.subtotal)}
            </span>
            <Link href="/carrito" className="btn-cta min-h-[48px]">
              Ver carrito
            </Link>
          </div>
        </div>
      )}

      {producto && <HojaPersonalizacion producto={producto} alCerrar={cerrar} />}
    </>
  );
}
