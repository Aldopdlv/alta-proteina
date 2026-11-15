'use client';

import Link from 'next/link';
import { useTienda } from '@/lib/carrito';
import { diaCorto, soles } from '@/lib/formato';
import { envioGratis } from '@/lib/textos';
import { Encabezado } from '@/componentes/Encabezado';
import { Stepper } from '@/componentes/Piezas';
import { IconoCalendario, IlustracionPlato } from '@/componentes/Iconos';

export default function Carrito() {
  const t = useTienda();
  const { config, zonas } = t.catalogo;
  const falta = Math.max(0, config.pedidoMinimo - t.subtotal);
  const gratis = envioGratis(zonas);

  return (
    <>
      <Encabezado />
      <main className="contenedor flex flex-1 flex-col gap-5 pb-10 pt-6">
        <h1 className="h1">Tu semana</h1>

        {!t.listo ? null : t.lineas.length === 0 ? (
          <div className="tarjeta flex flex-col items-center gap-3 px-6 py-12 text-center">
            <svg width="72" height="56" viewBox="0 0 72 56" fill="none" stroke="#5B6B2F" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14 14 8 22v28a4 4 0 0 0 4 4h48a4 4 0 0 0 4-4V22l-6-8Z" />
              <path d="M8 22h56" />
              <path d="M46 30a10 10 0 0 1-20 0" />
              <path d="M30 4v4M36 2v6M42 4v4" strokeDasharray="2 3" />
            </svg>
            <h2 className="m-0 mt-2 font-titulo text-[22px] font-bold leading-[1.25]">Todavía no armaste tu semana</h2>
            <p className="m-0 max-w-[34ch] text-tinta-suave">Elige tus platos del menú y arma tu pedido.</p>
            <Link href="/menu" className="btn-cta mt-2 min-h-[48px] px-7">
              Ver el menú
            </Link>
          </div>
        ) : (
          <div className="flex flex-wrap items-start gap-x-8 gap-y-5">
            <div className="flex min-w-0 flex-[3_1_420px] flex-col gap-3">
              <div className="flex items-center gap-2 rounded-xl bg-oliva-claro px-3.5 py-2.5 text-sm font-medium text-oliva-oscuro">
                <IconoCalendario tamano={16} trazo={2} />
                <span>Tu pedido entra en la semana del {diaCorto(t.semana.entrega)}</span>
              </div>
              <ul className="tarjeta m-0 list-none p-0">
                {t.lineas.map((l, i) => (
                  <li key={l.linea.key} className={`flex gap-3.5 p-4 ${i < t.lineas.length - 1 ? 'border-b border-solid border-borde' : ''}`}>
                    <div role="img" aria-label={l.producto.nombre} className="flex h-[72px] w-[72px] flex-none items-center justify-center overflow-hidden rounded-xl bg-crema-oscura">
                      {l.producto.imagen ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={`/fotos/${l.producto.imagen}`} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <IlustracionPlato ancho={34} alto={24} trazo={2} />
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex justify-between gap-3">
                        <h3 className="m-0 font-titulo text-base font-semibold leading-[1.3]">{l.producto.nombre}</h3>
                        <span className="num whitespace-nowrap font-titulo text-base font-bold leading-[1.3]">{soles(l.total)}</span>
                      </div>
                      <p className="m-0 text-[13px] text-tinta-suave [text-wrap:pretty]">{l.detalle}</p>
                      <div className="mt-1.5 flex items-center justify-between gap-3">
                        <Stepper valor={l.linea.cantidad} menos={() => t.cambiar(l.linea.key, -1)} mas={() => t.cambiar(l.linea.key, 1)} alto={40} />
                        <button type="button" onClick={() => t.quitar(l.linea.key)} className="min-h-[44px] cursor-pointer border-0 bg-transparent px-1 text-sm font-medium leading-none text-tinta-suave underline underline-offset-[3px]">
                          Quitar
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <Link href="/menu" className="flex min-h-[44px] items-center self-start font-titulo text-[15px] font-semibold leading-none text-oliva underline underline-offset-4">
                Seguir pidiendo
              </Link>
            </div>

            <aside className="tarjeta flex min-w-0 flex-[2_1_300px] flex-col gap-3 p-5">
              <h2 className="m-0 mb-1 font-titulo text-lg font-semibold leading-[1.3]">Resumen</h2>
              <div className="flex justify-between gap-3 text-[15px]">
                <span>Subtotal</span>
                <span className="num">{soles(t.subtotal)}</span>
              </div>
              <div className="text-sm text-tinta-suave">{gratis ? 'Delivery: gratis' : 'Delivery: se calcula en el siguiente paso'}</div>
              <div className="flex items-baseline justify-between gap-3 border-t border-solid border-borde pt-3">
                <span className="font-titulo text-base font-semibold leading-[1.3]">Total parcial</span>
                <span className="num font-titulo text-[22px] font-bold leading-none">{soles(t.subtotal)}</span>
              </div>
              {falta > 0 ? (
                <>
                  <p role="status" className="m-0 mt-1 rounded-xl bg-aviso-fondo px-3 py-2.5 text-sm font-medium text-aviso">
                    El pedido mínimo es {soles(config.pedidoMinimo)}. Te faltan {soles(falta)}.
                  </p>
                  <button type="button" disabled className="btn-cta">
                    Continuar a entrega
                  </button>
                </>
              ) : (
                <Link href="/entrega" className="btn-cta mt-1">
                  Continuar a entrega
                </Link>
              )}
            </aside>
          </div>
        )}
      </main>
    </>
  );
}
