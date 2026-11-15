import Link from 'next/link';
import { Encabezado } from '@/componentes/Encabezado';
import { Pie } from '@/componentes/Pie';
import { TarjetaPack, TarjetaProducto } from '@/componentes/Tarjetas';
import { IconoCopo, IconoOjo, IconoTemporizador } from '@/componentes/Iconos';
import { Preguntas } from './Preguntas';
import { catalogoPublico, leerCatalogo } from '@/lib/catalogo';
import { DIAS } from '@/lib/formato';
import { preguntasFrecuentes } from '@/lib/textos';

export default async function Inicio() {
  const { config, productos, zonas } = catalogoPublico(await leerCatalogo());
  const platos = productos.filter((p) => p.categoria !== 'packs');
  const pack = productos.find((p) => p.categoria === 'packs' && p.activo);

  const pasos = [
    [`Pide hasta el ${DIAS[config.corteDia]}.`, 'Elige tus platos, marinados y salsas.'],
    ['Cocinamos en lote.', 'Un chef prepara todo el mismo día y lo congelamos al instante.'],
    ['Recibes tu semana.', `Te llega el ${DIAS[config.entregaDia]} a tu zona. Guardas en el congelador y listo.`],
  ];
  const razones = [
    [<IconoOjo key="o" />, 'Proteína visible.', 'Cada plato dice cuántos gramos de pollo lleva. Sin letra chica.'],
    [<IconoCopo key="c" />, 'Congelado el mismo día.', 'Cocinamos y congelamos de inmediato para que llegue como recién hecho.'],
    [<IconoTemporizador key="t" />, 'Listo en 4 minutos.', 'Microondas tapado y a comer. Los fideos, con un chorrito de agua.'],
  ] as const;

  return (
    <>
      <Encabezado />
      <main className="flex-1">
        <section className="contenedor flex flex-wrap items-center gap-[clamp(28px,5vw,64px)] pb-[clamp(48px,7vw,96px)] pt-[clamp(32px,6vw,80px)]">
          <div className="flex min-w-0 flex-[1_1_340px] flex-col gap-4">
            <h1 className="m-0 font-titulo text-[clamp(32px,4.6vw,58px)] font-bold leading-[1.1] tracking-[-0.03em] [text-wrap:balance]">
              Comida de verdad, sin complicarte.
            </h1>
            <p className="m-0 max-w-[46ch] text-[clamp(16px,1.5vw,18px)] text-tinta-suave [text-wrap:pretty]">
              Platos con 150 g de pollo, listos en 4 minutos. Pides una vez a la semana y recibes todo congelado en tu puerta.
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2">
              <Link href="/menu" className="btn-cta max-w-[280px] flex-[1_1_200px] text-[17px]">
                Arma tu semana
              </Link>
              <a href="#como" className="flex min-h-[44px] items-center font-titulo text-base font-semibold leading-none text-oliva underline-offset-4">
                Ver cómo funciona
              </a>
            </div>
          </div>
          <div className="min-w-0 flex-[1_1_340px]">
            <div role="img" aria-label="Foto: varias porciones etiquetadas" className="flex aspect-video flex-col items-center justify-center gap-3 rounded-2xl bg-crema-oscura text-oliva">
              <svg width="120" height="64" viewBox="0 0 120 64" fill="none" stroke="#5B6B2F" strokeWidth="1.75" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="14" width="34" height="46" rx="5" />
                <rect x="43" y="6" width="34" height="54" rx="5" />
                <rect x="84" y="14" width="34" height="46" rx="5" />
                <path d="M8 26h22M49 18h22M90 26h22" />
                <path d="M8 32h14M49 24h14M90 32h14" />
              </svg>
              <span className="text-[13px] font-medium">Foto · Tu semana resuelta</span>
            </div>
          </div>
        </section>

        <section id="como" className="contenedor scroll-mt-4 pb-[clamp(56px,8vw,104px)]">
          <h2 className="h2-seccion mb-6">Así de simple</h2>
          <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))]">
            {pasos.map(([titulo, texto], i) => (
              <div key={titulo} className="tarjeta flex flex-col gap-2 p-5">
                <span className="font-titulo text-[40px] font-bold leading-none tracking-[-0.02em] text-oliva">{i + 1}</span>
                <h3 className="m-0 mt-2 font-titulo text-lg font-semibold leading-[1.3]">{titulo}</h3>
                <p className="m-0 text-[15px] text-tinta-suave">{texto}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="menu" className="bg-crema-oscura">
          <div className="contenedor py-[clamp(48px,7vw,88px)]">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <h2 className="h2-seccion">El menú de esta semana</h2>
              <span className="text-sm text-tinta-suave">Congelado · Microondas 3-4 min</span>
            </div>
            <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(min(100%,240px),1fr))]">
              {platos.map((p) => (
                <TarjetaProducto key={p.id} p={p} fondoFoto="#F5EFE0" />
              ))}
              {pack && <TarjetaPack p={pack} />}
            </div>
            <div className="mt-7 flex justify-center">
              <Link href="/menu" className="btn-sec min-h-[48px] px-7 text-base hover:bg-oliva hover:text-white">
                Ver todo el menú
              </Link>
            </div>
          </div>
        </section>

        <section className="contenedor py-[clamp(56px,8vw,104px)]">
          <h2 className="h2-seccion mb-7">Lo que ves es lo que comes</h2>
          <div className="grid gap-x-8 gap-y-7 [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))]">
            {razones.map(([icono, titulo, texto]) => (
              <div key={titulo} className="flex flex-col gap-2">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-oliva-claro text-oliva">{icono}</span>
                <h3 className="m-0 mt-2 font-titulo text-lg font-semibold leading-[1.3]">{titulo}</h3>
                <p className="m-0 text-[15px] text-tinta-suave">{texto}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="contenedor flex flex-wrap gap-x-16 gap-y-4 pb-[clamp(56px,8vw,104px)]">
          <h2 className="h2-seccion flex-[1_1_240px]">Preguntas frecuentes</h2>
          <Preguntas preguntas={preguntasFrecuentes(config, zonas)} />
        </section>
      </main>
      <Pie config={config} zonas={zonas} />
    </>
  );
}
