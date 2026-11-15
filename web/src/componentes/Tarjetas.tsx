'use client';

import Link from 'next/link';
import { useTienda } from '@/lib/carrito';
import { ahorroPack } from '@/lib/calculos';
import { soles } from '@/lib/formato';
import { ChipsProteina, FotoProducto, Stepper } from './Piezas';
import { IlustracionPack } from './Iconos';
import type { Producto } from '@/lib/tipos';

/** Tarjeta de producto única (Inicio y Menú). */
export function TarjetaProducto({ p, fondoFoto, onElegir }: { p: Producto; fondoFoto?: string; onElegir?: () => void }) {
  const t = useTienda();
  const q = t.cantidadDe(p.id);
  const agotado = !p.activo;
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-tarjeta" style={{ opacity: agotado ? 0.6 : 1 }}>
      <FotoProducto nombre={p.nombre} imagen={p.imagen} fondo={fondoFoto}>
        <ChipsProteina gramosPollo={p.polloCocidoG} proteina={p.proteinaG} mostrar={t.catalogo.config.mostrarProteina} />
      </FotoProducto>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="m-0 font-titulo text-lg font-semibold leading-[1.3]">{p.nombre}</h3>
        <p className="m-0 flex-1 text-sm text-tinta-suave [text-wrap:pretty]">{p.descripcion}</p>
        <div className="mt-2.5 flex min-h-[44px] items-center justify-between gap-3">
          <span className="num font-titulo text-xl font-bold leading-none">{soles(p.precio)}</span>
          {agotado ? (
            <span className="rounded-full bg-neutro-fondo px-3 py-1 text-xs font-medium leading-[1.4] text-neutro">Esta semana no</span>
          ) : q > 0 && t.listo ? (
            <Stepper valor={q} menos={() => t.quitarUno(p.id)} mas={() => t.agregarRapido(p.id)} />
          ) : (
            <button type="button" className="btn-sec" onClick={() => t.agregarRapido(p.id)}>
              Agregar
            </button>
          )}
        </div>
        <span className="text-xs text-tinta-suave">Congelado · Microondas 3-4 min</span>
        {!agotado &&
          (onElegir ? (
            <button type="button" onClick={onElegir} className="flex min-h-[32px] cursor-pointer items-center self-start border-0 bg-transparent p-0 text-sm font-medium text-oliva underline underline-offset-[3px]">
              Elegir marinado y salsa
            </button>
          ) : (
            <Link href={`/menu?hoja=${p.id}`} className="flex min-h-[32px] items-center text-sm font-medium text-oliva underline-offset-[3px]">
              Elegir marinado y salsa
            </Link>
          ))}
      </div>
    </article>
  );
}

/** Tarjeta ancha del pack. En Inicio agrega directo; en el Menú abre la hoja. */
export function TarjetaPack({ p, onElegir }: { p: Producto; onElegir?: () => void }) {
  const t = useTienda();
  const q = t.cantidadDe(p.id);
  const { sinPack, ahorro } = ahorroPack(p, t.catalogo.productos);
  const base = t.catalogo.productos.find((x) => x.id === p.packProductoId);
  return (
    <article className="col-span-full flex flex-wrap overflow-hidden rounded-2xl border border-solid border-oliva-borde bg-oliva-claro">
      <div role="img" aria-label={p.nombre} className="relative flex max-h-[260px] flex-[1_1_280px] flex-col items-center justify-center gap-2 bg-oliva-foto aspect-[4/3]">
        {p.imagen ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`/fotos/${p.imagen}`} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <>
            <IlustracionPack />
            <span className="text-xs font-medium text-oliva">{p.nombre}</span>
          </>
        )}
      </div>
      <div className="flex flex-[2_1_300px] flex-col justify-center gap-2 p-5">
        <div className="flex flex-wrap gap-1.5">
          {ahorro > 0 && (
            <span className="rounded-full bg-naranja px-3 py-1 font-titulo text-xs font-semibold leading-[1.4] text-tinta">Ahorra {soles(ahorro)}</span>
          )}
          <span className="rounded-full bg-oliva px-3 py-1 font-titulo text-xs font-semibold leading-[1.4] text-crema">
            {p.packUnidades} × {base?.polloCocidoG ?? 150} g de pollo
          </span>
        </div>
        <h3 className="m-0 mt-1 font-titulo text-[clamp(20px,2.2vw,26px)] font-bold leading-[1.2] tracking-[-0.01em]">{p.nombre}</h3>
        <p className="m-0 text-[15px] text-tinta-suave">{p.descripcion}</p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <span className="flex items-baseline gap-2">
            <span className="num font-titulo text-2xl font-bold leading-none">{soles(p.precio)}</span>
            {ahorro > 0 && <s className="text-sm text-tinta-suave">{soles(sinPack)}</s>}
          </span>
          {onElegir ? (
            <button type="button" onClick={onElegir} className="btn-sec bg-white hover:bg-crema">
              Elegir marinado
            </button>
          ) : q > 0 && t.listo ? (
            <Stepper valor={q} menos={() => t.quitarUno(p.id)} mas={() => t.agregarRapido(p.id)} fondo="#FFFFFF" />
          ) : (
            <button type="button" onClick={() => t.agregarRapido(p.id)} className="btn-sec bg-white hover:bg-crema">
              Agregar
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
