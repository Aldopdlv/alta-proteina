import Link from 'next/link';
import { Encabezado } from '@/componentes/Encabezado';
import { Pie } from '@/componentes/Pie';
import { TarjetaPack, TarjetaProducto } from '@/componentes/Tarjetas';
import { IconoCopo, IconoOjo, IconoTemporizador } from '@/componentes/Iconos';
import { Preguntas } from './Preguntas';
import { catalogoPublico, leerCatalogo } from '@/lib/catalogo';
import { DIAS } from '@/lib/formato';
import { IMAGENES_PASOS } from '@/lib/imagenes';
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
            {/* eslint-disable-next-line @next/next/no-img-element -- imagen fija ya optimizada en public/img */}
            <img
              src="/img/heroe.webp"
              srcSet="/img/heroe-800.webp 800w, /img/heroe.webp 1344w"
              sizes="(max-width: 760px) 100vw, 50vw"
              width={1344}
              height={752}
              fetchPriority="high"
              alt="Burritos, quesadillas, arroz y fideos con pollo de Alta Proteína en sus envases"
              className="block aspect-video h-auto w-full rounded-2xl bg-crema-oscura object-cover"
            />
          </div>
        </section>

        <section id="como" className="contenedor scroll-mt-4 pb-[clamp(56px,8vw,104px)]">
          <h2 className="h2-seccion mb-6">Así de simple</h2>
          <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))]">
            {pasos.map(([titulo, texto], i) => (
              <div key={titulo} className="tarjeta flex flex-col overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element -- imagen fija ya optimizada en public/img */}
                <img src={IMAGENES_PASOS[i].src} alt={IMAGENES_PASOS[i].alt} width={800} height={800} loading="lazy" className="block aspect-[4/3] h-auto w-full bg-crema-oscura object-cover" />
                <div className="flex flex-col gap-2 p-5">
                  <span className="font-titulo text-[40px] font-bold leading-none tracking-[-0.02em] text-oliva">{i + 1}</span>
                  <h3 className="m-0 mt-2 font-titulo text-lg font-semibold leading-[1.3]">{titulo}</h3>
                  <p className="m-0 text-[15px] text-tinta-suave">{texto}</p>
                </div>
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
          <div className="flex flex-wrap items-center gap-x-[clamp(28px,5vw,64px)] gap-y-8">
            <div className="flex min-w-0 flex-[1_1_340px] flex-col gap-7">
              {razones.map(([icono, titulo, texto]) => (
                <div key={titulo} className="flex items-start gap-4">
                  <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-oliva-claro text-oliva">{icono}</span>
                  <div className="flex flex-col gap-1">
                    <h3 className="m-0 font-titulo text-lg font-semibold leading-[1.3]">{titulo}</h3>
                    <p className="m-0 text-[15px] text-tinta-suave">{texto}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="min-w-0 flex-[1_1_300px] sm:max-w-[380px]">
              {/* eslint-disable-next-line @next/next/no-img-element -- imagen fija ya optimizada en public/img */}
              <img
                src="/img/microondas-4-min.webp"
                alt="Una porción de arroz con pollo saliendo del microondas, lista en 4 minutos"
                width={720}
                height={900}
                loading="lazy"
                className="block aspect-square h-auto w-full rounded-2xl bg-crema-oscura object-cover object-[center_65%]"
              />
            </div>
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
