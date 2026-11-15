import Link from 'next/link';
import { Encabezado } from '@/componentes/Encabezado';
import { ChipEstado } from '@/componentes/Piezas';
import { leerConfig } from '@/lib/catalogo';
import { detalleLinea, obtenerPedidoPublico } from '@/lib/pedidos';
import { enlaceWhatsapp, mayuscula, soles, soles2 } from '@/lib/formato';
import { mensajeEstado, PASOS_PEDIDO, textoEntrega } from '@/lib/textos';
import { BotonesPedido, ResubirCaptura } from './Cliente';

export const metadata = { title: 'Tu pedido', robots: { index: false } };

const PASO: Record<string, number> = { pendiente: 1, rechazado: 1, pagado: 2, preparado: 3, entregado: 4 };

export default async function PaginaPedido({
  params,
  searchParams,
}: {
  params: Promise<{ codigo: string }>;
  searchParams: Promise<{ t?: string }>;
}) {
  const { codigo } = await params;
  const { t } = await searchParams;
  const [p, config] = await Promise.all([obtenerPedidoPublico(codigo, t), leerConfig()]);

  if (!p) {
    return (
      <>
        <Encabezado />
        <main className="mx-auto flex w-full max-w-[640px] flex-1 flex-col gap-4 px-4 pb-10 pt-7">
          <h1 className="h1">No encontramos ese pedido</h1>
          <p className="m-0 text-tinta-suave">Revisa que el enlace esté completo (incluye todo lo que va después del signo ?). Si lo perdiste, escríbenos con tu código.</p>
          <a href={enlaceWhatsapp(config.whatsapp, `Hola, perdí el enlace de mi pedido ${codigo}.`)} className="btn-oliva self-start">
            Escribir por WhatsApp
          </a>
        </main>
      </>
    );
  }

  const paso = PASO[p.estado] ?? 1;
  const error = p.estado === 'rechazado';
  const entregaDir = [p.zona_nombre, p.direccion, p.referencia].filter(Boolean).join(' · ');
  const wa = enlaceWhatsapp(config.whatsapp, `Hola, soy ${p.nombre.split(' ')[0]}. Mi pedido es el ${p.codigo} y quería consultar sobre `);

  return (
    <>
      <Encabezado />
      <main className="mx-auto box-border flex w-full max-w-[640px] flex-1 flex-col gap-5 px-4 pb-10 pt-7">
        <div className="flex flex-col items-start gap-2.5">
          <ChipEstado estado={p.estado} grande />
          <h1 className="m-0 font-titulo text-[26px] font-bold leading-[1.25] tracking-[-0.02em]">
            ¡Listo! Tu pedido es el{' '}
            <span className="num mt-1 block text-[34px] tracking-[0.01em] text-oliva">{p.codigo}</span>
          </h1>
          <p className="m-0 text-[15px] text-tinta-suave [text-wrap:pretty]">{mensajeEstado(p.estado, p.medio, config, p.semana_entrega, p.motivo_rechazo)}</p>
          {error && <ResubirCaptura codigo={p.codigo} clave={p.clave} />}
        </div>

        <ol className="tarjeta m-0 flex list-none flex-col px-4 py-[18px]">
          {PASOS_PEDIDO.map((texto, i) => {
            const hecho = i < paso;
            const esError = error && i === paso;
            const actual = i === paso && !error;
            const borde = hecho ? '#5B6B2F' : esError ? '#B3261E' : actual ? '#5B6B2F' : '#D6CFBD';
            return (
              <li key={texto} className="flex gap-3.5">
                <div className="flex flex-col items-center">
                  <span
                    className="box-border flex h-[26px] w-[26px] flex-none items-center justify-center rounded-full border-2 border-solid font-titulo text-xs font-semibold text-tinta-suave"
                    style={{ borderColor: borde, background: hecho ? '#5B6B2F' : esError ? '#B3261E' : '#FFFFFF' }}
                  >
                    {hecho ? (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12l5 5 9-10" />
                      </svg>
                    ) : esError ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" aria-hidden="true">
                        <path d="M18 6 6 18M6 6l12 12" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </span>
                  {i < PASOS_PEDIDO.length - 1 && <span className="min-h-[20px] w-0.5 flex-1" style={{ background: i < paso - 1 ? '#5B6B2F' : '#D6CFBD' }} />}
                </div>
                <span
                  className="pb-[18px] pt-0.5 font-titulo text-[15px] leading-[1.4]"
                  style={{ fontWeight: hecho || actual || esError ? 600 : 500, color: hecho || actual ? '#2B2B2B' : esError ? '#B3261E' : '#5F5F5F' }}
                >
                  {texto}
                  {(hecho || actual || esError) && <span className="sr-only">{hecho ? ' (hecho)' : esError ? ' (con problema)' : ' (en curso)'}</span>}
                </span>
              </li>
            );
          })}
        </ol>

        <section className="tarjeta flex flex-col gap-1.5 p-4">
          <h2 className="m-0 mb-1 font-titulo text-[17px] font-semibold leading-[1.3]">Tu entrega</h2>
          <span className="font-medium">{mayuscula(textoEntrega(config, p.semana_entrega))}</span>
          <span className="text-sm text-tinta-suave">{entregaDir}</span>
        </section>

        <section className="tarjeta flex flex-col gap-2.5 p-4 text-sm">
          <h2 className="m-0 font-titulo text-[17px] font-semibold leading-[1.3]">Tu pedido</h2>
          {p.lineas.map((l, i) => (
            <div key={i} className="flex justify-between gap-3">
              <span className="flex flex-col">
                <span className="text-[15px] font-medium">
                  {l.cantidad} × {l.producto_nombre}
                </span>
                <span className="text-tinta-suave">{detalleLinea(l)}</span>
              </span>
              <span className="num">{soles(l.precio_unitario * l.cantidad)}</span>
            </div>
          ))}
          <div className="flex justify-between text-tinta-suave">
            <span>Delivery ({p.zona_nombre})</span>
            <span>{p.delivery === 0 ? 'Gratis' : soles2(p.delivery)}</span>
          </div>
          {p.recargo > 0 && (
            <div className="flex justify-between text-tinta-suave">
              <span>Recargo por tarjeta ({p.recargo_pct} %)</span>
              <span>{soles2(p.recargo)}</span>
            </div>
          )}
          <div className="flex items-baseline justify-between border-t border-solid border-borde pt-2.5">
            <span className="font-titulo text-[15px] font-semibold">Total · {p.medio === 'yape' ? 'Yape' : 'Tarjeta'}</span>
            <span className="num font-titulo text-xl font-bold leading-none">{soles2(p.total)}</span>
          </div>
        </section>

        <div className="flex flex-col gap-2.5">
          <p className="m-0 text-sm text-tinta-suave">Guarda este enlace: aquí verás el estado de tu pedido.</p>
          <BotonesPedido whatsapp={wa} />
          <Link href="/menu" className="flex min-h-[44px] items-center self-center font-titulo text-[15px] font-semibold leading-none underline-offset-4">
            Volver al menú
          </Link>
        </div>
      </main>
    </>
  );
}
