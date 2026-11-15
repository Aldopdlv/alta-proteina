'use client';

import { useState, useTransition } from 'react';
import { soles2 } from '@/lib/formato';
import { MOTIVOS_RECHAZO } from '@/lib/textos';
import type { PedidoVista } from '@/lib/panel';
import { IconoImagen } from '@/componentes/Iconos';
import { aprobarYape, rechazarYape } from '../../acciones';

interface Hecho {
  codigo: string;
  nombre: string;
  accion: 'aprobado' | 'rechazado';
  aviso: string | null;
}

export function ColaYape({ pedidos, titular }: { pedidos: PedidoVista[]; titular: string }) {
  const [rechazando, setRechazando] = useState<string | null>(null);
  const [motivo, setMotivo] = useState(0);
  const [zoom, setZoom] = useState<PedidoVista | null>(null);
  const [hechos, setHechos] = useState<Hecho[]>([]);
  const [ocupado, iniciar] = useTransition();

  const registrar = (p: PedidoVista, accion: Hecho['accion']) =>
    setHechos((h) => [{ codigo: p.codigo, nombre: p.nombre, accion, aviso: null }, ...h].slice(0, 5));

  return (
    <div className="flex flex-col gap-3.5">
      {hechos.length > 0 && (
        <ul className="m-0 flex list-none flex-col gap-1.5 p-0" aria-live="polite">
          {hechos.map((h) => (
            <li key={h.codigo} className={`flex flex-wrap items-center justify-between gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium ${h.accion === 'aprobado' ? 'bg-exito-fondo text-exito' : 'bg-error-fondo text-error'}`}>
              <span>
                {h.codigo} · {h.nombre} · {h.accion === 'aprobado' ? 'Pago aprobado' : 'Pago rechazado'}
              </span>
              <a href={`/panel?pedido=${h.codigo}`} className="font-semibold text-inherit">
                Avisar por WhatsApp
              </a>
            </li>
          ))}
        </ul>
      )}

      {pedidos.length === 0 && <div className="rounded-2xl border border-solid border-borde px-5 py-10 text-center text-tinta-suave">No hay capturas por revisar.</div>}

      {pedidos.map((p) => {
        const esRechazo = rechazando === p.codigo;
        return (
          <div key={p.codigo} className="flex flex-wrap gap-5 rounded-2xl border border-solid border-borde p-4">
            <button type="button" onClick={() => setZoom(p)} aria-label={`Ampliar captura de ${p.codigo}`} className="relative flex h-[320px] flex-[0_0_180px] cursor-zoom-in flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-0 bg-crema-oscura p-0 text-oliva">
              {p.captura && !p.capturaEsHeic ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.captura} alt={`Captura de Yape de ${p.codigo}`} className="h-full w-full object-cover object-top" />
              ) : (
                <>
                  <IconoImagen tamano={28} />
                  <span className="text-xs font-medium">{p.capturaEsHeic ? 'Captura HEIC' : 'Captura de Yape'}</span>
                </>
              )}
              <span className="absolute bottom-2.5 right-2.5 rounded-lg bg-white px-2 py-1 font-titulo text-xs font-semibold text-tinta">Ampliar</span>
            </button>
            <div className="flex flex-[1_1_260px] flex-col gap-3">
              <div className="flex flex-col gap-0.5">
                <span className="font-titulo text-base font-semibold text-oliva-oscuro">{p.codigo}</span>
                <span className="font-medium">{p.nombre}</span>
                <span className="text-[13px] text-tinta-suave">
                  Enviado el {p.creado} · entrega {p.semana}
                </span>
              </div>
              <div className="flex flex-col gap-1 rounded-xl bg-crema p-3.5">
                <span className="text-[13px] text-tinta-suave">Monto esperado</span>
                <span className="num font-titulo text-[30px] font-bold leading-[1.1]">{soles2(p.total)}</span>
                <span className="text-[13px] text-tinta-suave">La captura debe mostrar este monto, a nombre de {titular}.</span>
              </div>
              {!esRechazo ? (
                <div className="mt-auto flex gap-2.5">
                  <button
                    type="button"
                    disabled={ocupado}
                    onClick={() => iniciar(async () => {
                      const r = await aprobarYape(p.codigo);
                      if (r.ok) registrar(p, 'aprobado');
                    })}
                    className="min-h-[48px] flex-1 cursor-pointer rounded-xl border-0 bg-exito font-titulo text-[15px] font-semibold leading-none text-white hover:bg-exito-hover disabled:opacity-60"
                  >
                    Aprobar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRechazando(p.codigo);
                      setMotivo(0);
                    }}
                    className="min-h-[48px] flex-1 cursor-pointer rounded-xl border-[1.5px] border-solid border-error bg-white font-titulo text-[15px] font-semibold leading-none text-error hover:bg-error-fondo"
                  >
                    Rechazar
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5 border-t border-solid border-borde pt-3">
                  <span className="font-titulo text-sm font-semibold">Motivo del rechazo</span>
                  <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Motivo del rechazo">
                    {MOTIVOS_RECHAZO.map((m, i) => (
                      <button
                        key={m}
                        type="button"
                        role="radio"
                        aria-checked={motivo === i}
                        onClick={() => setMotivo(i)}
                        className={`min-h-[40px] cursor-pointer rounded-full border-[1.5px] border-solid px-3 text-[13px] font-medium ${motivo === i ? 'border-error bg-error text-white' : 'border-borde bg-white text-tinta'}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2.5">
                    <button
                      type="button"
                      disabled={ocupado}
                      onClick={() => iniciar(async () => {
                        const r = await rechazarYape(p.codigo, MOTIVOS_RECHAZO[motivo]);
                        if (r.ok) registrar(p, 'rechazado');
                        setRechazando(null);
                      })}
                      className="min-h-[46px] flex-1 cursor-pointer rounded-xl border-0 bg-error font-titulo text-[15px] font-semibold leading-none text-white disabled:opacity-60"
                    >
                      Rechazar pago
                    </button>
                    <button type="button" onClick={() => setRechazando(null)} className="min-h-[46px] cursor-pointer border-0 bg-transparent px-4 text-tinta-suave underline">
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {zoom && (
        <div onClick={() => setZoom(null)} className="fixed inset-0 z-50 flex cursor-zoom-out flex-col items-center justify-center gap-3 bg-[rgba(20,20,20,0.85)] p-4" role="dialog" aria-label={`Captura de ${zoom.codigo}`}>
          {zoom.captura && !zoom.capturaEsHeic ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={zoom.captura} alt={`Captura de Yape de ${zoom.codigo}`} className="max-h-[84vh] max-w-full rounded-2xl object-contain" />
          ) : (
            <a href={zoom.captura ?? '#'} target="_blank" rel="noopener" onClick={(e) => e.stopPropagation()} className="rounded-xl bg-white px-4 py-3 font-semibold">
              Abrir la captura HEIC en otra pestaña
            </a>
          )}
          <span className="text-sm text-white">Toca para cerrar</span>
        </div>
      )}
    </div>
  );
}
