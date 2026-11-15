import Link from 'next/link';
import { DIAS, diaLargo, kilos } from '@/lib/formato';
import { produccionSemana } from '../datos';
import { BotonImprimir } from './BotonImprimir';

export const metadata = { title: 'Hoja para cocina' };

/** Hoja imprimible SIN datos de clientes (porciones, salsas, pollo crudo). */
export default async function HojaCocina({ searchParams }: { searchParams: Promise<{ semana?: string }> }) {
  const { semana: param } = await searchParams;
  const { semana, config, resumen } = await produccionSemana(param);
  const crudo = Math.round(150 / config.rendimientoCoccion);
  return (
    <div className="flex min-h-screen justify-center bg-[rgba(43,43,43,0.08)] px-3 py-6 print:bg-white print:p-0">
      <div className="flex w-full max-w-[640px] flex-col gap-3">
        <div className="no-imprimir flex justify-end gap-2">
          <BotonImprimir />
          <Link href={`/panel/produccion?semana=${semana}`} className="flex min-h-[44px] items-center rounded-xl bg-white px-4 font-titulo text-[15px] font-semibold text-tinta no-underline">
            Cerrar
          </Link>
        </div>
        <article className="hoja-cocina flex flex-col gap-[22px] rounded-lg bg-white px-8 py-9 text-tinta">
          <header className="flex items-start justify-between gap-3 border-b-2 border-solid border-tinta pb-3.5">
            <div className="flex flex-col gap-0.5">
              <span className="font-titulo text-[22px] font-bold leading-[1.2]">Hoja de producción</span>
              <span className="text-sm">
                Semana del {diaLargo(semana)} · Cocina el {DIAS[config.cocinaDia]}
              </span>
            </div>
            <span className="font-titulo text-base font-bold text-oliva">Alta Proteína</span>
          </header>
          <section className="flex flex-col gap-1.5">
            <h3 className="m-0 mb-1 font-titulo text-sm font-bold uppercase tracking-[0.05em]">Porciones por producto y marinado</h3>
            {resumen.productos.map((g) => (
              <div key={g.producto} className="flex flex-col border-b border-solid border-borde-linea pb-1.5">
                {g.filas.map((r) => (
                  <div key={r.marinado} className="flex justify-between py-[3px] text-[15px]">
                    <span>
                      {g.producto} · {r.marinado}
                    </span>
                    <span className="font-titulo text-base font-bold">{r.n}</span>
                  </div>
                ))}
              </div>
            ))}
            <div className="flex justify-between pt-1 font-titulo text-[17px] font-bold">
              <span>Total porciones</span>
              <span>{resumen.totalPorciones}</span>
            </div>
          </section>
          <section className="flex flex-col gap-1">
            <h3 className="m-0 mb-1 font-titulo text-sm font-bold uppercase tracking-[0.05em]">Salsas (envases)</h3>
            {resumen.salsas.map((x) => (
              <div key={x.nombre} className="flex justify-between border-b border-solid border-crema-oscura py-[3px] text-[15px]">
                <span>{x.nombre}</span>
                <span className="font-titulo text-base font-bold">{x.n}</span>
              </div>
            ))}
          </section>
          <section className="flex flex-col gap-0.5 rounded-lg border-2 border-solid border-tinta px-4 py-3.5">
            <span className="font-titulo text-sm font-bold uppercase tracking-[0.05em]">Pollo crudo</span>
            <span className="font-titulo text-[26px] font-bold leading-[1.2]">{kilos(resumen.polloCrudoG / 1000)} kg</span>
            <span className="text-sm">
              {resumen.totalPorciones} porciones × {crudo} g crudos (150 g cocidos ÷ {String(config.rendimientoCoccion).replace('.', ',')})
            </span>
          </section>
        </article>
      </div>
    </div>
  );
}
