import Link from 'next/link';
import { kilos } from '@/lib/formato';
import { Cabecera, Contenido } from '../Cabecera';
import { produccionSemana } from './datos';

export default async function Produccion({ searchParams }: { searchParams: Promise<{ semana?: string }> }) {
  const { semana: param } = await searchParams;
  const { semana, config, resumen } = await produccionSemana(param);
  const crudoPorPorcion = Math.round(150 / config.rendimientoCoccion);
  const rend = String(config.rendimientoCoccion).replace('.', ',');

  return (
    <Contenido>
      <Cabecera titulo="Producción" ruta="/panel/produccion" semana={semana} />
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-oliva px-5 py-[18px] text-white">
          <div className="flex flex-col gap-0.5">
            <span className="text-[13px] opacity-90">Pollo crudo a comprar</span>
            <span className="num font-titulo text-[34px] font-bold leading-[1.1]">{kilos(resumen.polloCrudoG / 1000)} kg</span>
            <span className="text-[13px]">
              {resumen.totalPorciones} porciones × {crudoPorPorcion} g · solo pedidos pagados
            </span>
          </div>
          <Link href={`/panel/produccion/cocina?semana=${semana}`} className="flex min-h-[46px] items-center rounded-xl bg-crema px-[18px] font-titulo text-[15px] font-semibold leading-none text-tinta no-underline hover:text-tinta">
            Imprimir hoja para cocina
          </Link>
        </div>

        {resumen.totalPorciones === 0 ? (
          <div className="rounded-2xl border border-solid border-borde px-5 py-8 text-center text-tinta-suave">Todavía no hay pedidos pagados para esta semana.</div>
        ) : (
          <div className="flex flex-wrap items-start gap-4">
            <section className="flex-[3_1_340px] overflow-hidden rounded-2xl border border-solid border-borde">
              <h2 className="m-0 bg-crema px-4 py-3.5 font-titulo text-base font-semibold">Porciones por producto y marinado</h2>
              {resumen.productos.map((g) => (
                <div key={g.producto} className="border-t border-solid border-borde">
                  {g.filas.map((f) => (
                    <div key={f.marinado} className="flex justify-between gap-3 px-4 py-2.5 text-sm">
                      <span>
                        <span className="font-medium">{g.producto}</span> <span className="text-tinta-suave">· {f.marinado}</span>
                      </span>
                      <span className="num font-titulo text-[15px] font-semibold">{f.n}</span>
                    </div>
                  ))}
                  <div className="flex justify-between px-4 pb-3 pt-2 font-titulo text-[13px] font-semibold text-oliva-oscuro">
                    <span>Total {g.producto}</span>
                    <span>{g.total}</span>
                  </div>
                </div>
              ))}
              <div className="flex justify-between border-t-2 border-solid border-tinta px-4 py-3 font-titulo text-base font-bold">
                <span>Total porciones</span>
                <span>{resumen.totalPorciones}</span>
              </div>
            </section>
            <section className="flex-[2_1_260px] overflow-hidden rounded-2xl border border-solid border-borde">
              <h2 className="m-0 bg-crema px-4 py-3.5 font-titulo text-base font-semibold">Salsas</h2>
              {resumen.salsas.map((x) => (
                <div key={x.nombre} className="flex justify-between border-t border-solid border-borde px-4 py-2.5 text-sm">
                  <span>{x.nombre}</span>
                  <span className="font-titulo text-[15px] font-semibold">{x.n}</span>
                </div>
              ))}
            </section>
          </div>
        )}
        <p className="m-0 text-[13px] text-tinta-suave">
          Pollo crudo a comprar: {kilos(resumen.polloCrudoG / 1000)} kg ({resumen.totalPorciones} porciones × {crudoPorPorcion} g). Cálculo: porciones × 150 g cocidos ÷ {rend} de rendimiento.
        </p>
      </div>
    </Contenido>
  );
}
