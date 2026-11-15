'use client';

import { useEffect, useState, useTransition } from 'react';
import { soles2 } from '@/lib/formato';
import { ETIQUETA_ESTADO } from '@/lib/textos';
import type { PedidoVista } from '@/lib/panel';
import { ChipEstado } from '@/componentes/Piezas';
import { IconoCerrar } from '@/componentes/Iconos';
import { fijarEstado, guardarNotas } from '../acciones';

const ESTADOS = Object.entries(ETIQUETA_ESTADO);

function SelectEstado({ p, alto = 34 }: { p: PedidoVista; alto?: number }) {
  const [pendiente, iniciar] = useTransition();
  const [valor, setValor] = useState(p.estado);
  useEffect(() => setValor(p.estado), [p.estado]);
  const e = ETIQUETA_ESTADO[valor];
  return (
    <select
      value={valor}
      aria-label={`Estado de ${p.codigo}`}
      disabled={pendiente}
      onChange={(ev) => {
        const nuevo = ev.target.value;
        setValor(nuevo);
        iniciar(async () => {
          await fijarEstado(p.codigo, nuevo);
        });
      }}
      className="cursor-pointer rounded-full border-0 px-2.5 text-[13px] font-semibold disabled:opacity-60"
      style={{ height: alto, background: e.fondo, color: e.color }}
    >
      {ESTADOS.map(([v, x]) => (
        <option key={v} value={v}>
          {x.panel}
        </option>
      ))}
    </select>
  );
}

function Detalle({ p, alCerrar }: { p: PedidoVista; alCerrar: () => void }) {
  const [notas, setNotas] = useState(p.notasInternas);
  const [guardado, setGuardado] = useState<'no' | 'guardando' | 'si'>('no');
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => e.key === 'Escape' && alCerrar();
    document.addEventListener('keydown', tecla);
    return () => document.removeEventListener('keydown', tecla);
  }, [alCerrar]);
  const titulo = 'm-0 mb-1 font-titulo text-[13px] font-semibold uppercase tracking-[0.04em] text-tinta-suave';
  return (
    <div className="fixed inset-0 z-40 flex justify-stretch bg-[rgba(43,43,43,0.4)] panel:justify-end" onClick={alCerrar}>
      <div role="dialog" aria-label={`Detalle ${p.codigo}`} onClick={(e) => e.stopPropagation()} className="flex h-full w-full flex-col bg-white shadow-lateral panel:w-[440px]">
        <div className="flex items-center justify-between gap-3 border-b border-solid border-borde py-3.5 pl-5 pr-4">
          <div className="flex flex-col items-start gap-1">
            <span className="font-titulo text-xl font-bold">{p.codigo}</span>
            <ChipEstado estado={p.estado} vista="panel" />
          </div>
          <button type="button" onClick={alCerrar} aria-label="Cerrar" className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border-0 bg-transparent text-tinta hover:bg-crema">
            <IconoCerrar tamano={22} />
          </button>
        </div>
        <div className="flex flex-1 flex-col gap-[18px] overflow-auto px-5 py-[18px] text-sm">
          {p.estado === 'rechazado' && p.motivo && <div className="rounded-xl bg-error-fondo px-3 py-2.5 font-medium text-error">Motivo: {p.motivo}</div>}
          <section className="flex flex-col gap-[3px]">
            <h3 className={titulo}>Cliente</h3>
            <span className="text-[15px] font-semibold">{p.nombre}</span>
            <a href={p.wa}>WhatsApp {p.celular}</a>
            <span>
              {p.zona} · {p.direccion}
            </span>
            {p.referencia && <span className="text-tinta-suave">{p.referencia}</span>}
            {p.notas && <span className="text-tinta-suave">Notas: {p.notas}</span>}
            <span className="text-tinta-suave">
              Pedido el {p.creado} · entrega {p.semana}
            </span>
          </section>
          <section className="flex flex-col gap-2">
            <h3 className={titulo}>Ítems</h3>
            {p.items.map((i, k) => (
              <div key={k} className="flex flex-col">
                <span className="font-medium">{i.titulo}</span>
                <span className="text-tinta-suave">{i.sub}</span>
              </div>
            ))}
            <div className="flex justify-between border-t border-solid border-borde pt-2 font-titulo text-base font-bold">
              <span>Total · {p.medio}</span>
              <span className="num">{soles2(p.total)}</span>
            </div>
          </section>
          {p.avisos.length > 0 && (
            <section className="flex flex-col gap-2">
              <h3 className={titulo}>Avisar al cliente</h3>
              <div className="flex flex-wrap gap-2">
                {p.avisos.map((a) => (
                  <a key={a.etiqueta} href={a.url} target="_blank" rel="noopener" className="btn-sec min-h-[40px] px-3.5 text-[13px]">
                    {a.etiqueta}
                  </a>
                ))}
              </div>
            </section>
          )}
          {p.captura && (
            <section className="flex flex-col gap-2">
              <h3 className={titulo}>Captura Yape</h3>
              <a href={p.captura} target="_blank" rel="noopener" className="block h-[240px] w-[140px] overflow-hidden rounded-xl bg-crema-oscura">
                {p.capturaEsHeic ? (
                  <span className="flex h-full items-center justify-center p-2 text-center text-xs text-oliva">Abrir captura (HEIC)</span>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.captura} alt={`Captura de Yape de ${p.codigo}`} className="h-full w-full object-cover" />
                )}
              </a>
            </section>
          )}
          <label className="flex flex-col gap-1.5">
            <span className={titulo}>Notas internas</span>
            <textarea
              rows={3}
              value={notas}
              onChange={(e) => {
                setNotas(e.target.value);
                setGuardado('no');
              }}
              className="campo h-auto resize-y py-2.5"
            />
            <button
              type="button"
              disabled={guardado === 'guardando' || notas === p.notasInternas}
              onClick={async () => {
                setGuardado('guardando');
                await guardarNotas(p.codigo, notas);
                setGuardado('si');
              }}
              className="btn-oliva min-h-[40px] self-start px-4 text-sm disabled:opacity-50"
            >
              {guardado === 'si' ? 'Notas guardadas' : guardado === 'guardando' ? 'Guardando…' : 'Guardar notas'}
            </button>
          </label>
        </div>
      </div>
    </div>
  );
}

export function ListaPedidos({ pedidos, abierto }: { pedidos: PedidoVista[]; abierto: string | null }) {
  const [filtro, setFiltro] = useState('todos');
  const [q, setQ] = useState('');
  const [detalle, setDetalle] = useState<string | null>(abierto);
  const lista = pedidos.filter(
    (p) => (filtro === 'todos' || p.estado === filtro) && (!q || `${p.nombre} ${p.codigo}`.toLowerCase().includes(q.toLowerCase())),
  );
  const det = pedidos.find((p) => p.codigo === detalle);
  const enlaceCodigo = 'cursor-pointer whitespace-nowrap border-0 bg-transparent p-0 font-titulo font-semibold text-oliva-oscuro underline underline-offset-[3px]';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2.5">
        <input type="search" placeholder="Buscar por nombre o código" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar por nombre o código" className="campo h-11 flex-[1_1_240px]" />
        <div className="flex max-w-full gap-1.5 overflow-x-auto">
          {[['todos', 'Todos'] as const, ...ESTADOS.map(([v, e]) => [v, e.panel] as const)].map(([id, label]) => {
            const on = filtro === id;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={on}
                onClick={() => setFiltro(id)}
                className={`min-h-[40px] flex-none cursor-pointer whitespace-nowrap rounded-full border-[1.5px] border-solid px-3.5 font-titulo text-[13px] font-semibold leading-none ${on ? 'border-oliva bg-oliva text-white' : 'border-borde bg-white text-tinta'}`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {lista.length === 0 ? (
        <div className="rounded-2xl border border-solid border-borde px-5 py-8 text-center text-tinta-suave">
          {pedidos.length === 0 ? 'Todavía no hay pedidos para esta semana.' : 'Sin pedidos que coincidan.'}
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-solid border-borde panel:block">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-crema text-left font-titulo text-xs font-semibold uppercase leading-[1.3] tracking-[0.04em] text-tinta-suave">
                  <th className="px-3.5 py-2.5">Código</th>
                  <th className="px-3.5 py-2.5">Cliente</th>
                  <th className="px-3.5 py-2.5">Zona</th>
                  <th className="px-3.5 py-2.5">Ítems</th>
                  <th className="px-3.5 py-2.5 text-right">Total</th>
                  <th className="px-3.5 py-2.5">Pago</th>
                  <th className="px-3.5 py-2.5">Estado</th>
                </tr>
              </thead>
              <tbody>
                {lista.map((p) => (
                  <tr key={p.codigo} className="border-t border-solid border-borde hover:bg-crema-fila">
                    <td className="px-3.5 py-3">
                      <button type="button" onClick={() => setDetalle(p.codigo)} className={`${enlaceCodigo} text-sm`}>
                        {p.codigo}
                      </button>
                    </td>
                    <td className="px-3.5 py-3">
                      <div className="flex flex-col">
                        <span className="font-medium">{p.nombre}</span>
                        <a href={p.wa} className="text-[13px]">
                          {p.celular}
                        </a>
                      </div>
                    </td>
                    <td className="px-3.5 py-3">{p.zona}</td>
                    <td className="max-w-[220px] px-3.5 py-3 text-tinta-suave">{p.resumen}</td>
                    <td className="num whitespace-nowrap px-3.5 py-3 text-right font-titulo font-semibold">{soles2(p.total)}</td>
                    <td className="px-3.5 py-3">{p.medio}</td>
                    <td className="px-3.5 py-3">
                      <SelectEstado p={p} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-2.5 panel:hidden">
            {lista.map((p) => (
              <div key={p.codigo} className="flex flex-col gap-2 rounded-2xl border border-solid border-borde p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <button type="button" onClick={() => setDetalle(p.codigo)} className={`${enlaceCodigo} min-h-[32px] text-[15px]`}>
                    {p.codigo}
                  </button>
                  <span className="num font-titulo text-base font-bold">{soles2(p.total)}</span>
                </div>
                <div className="flex justify-between gap-2 text-sm">
                  <span className="font-medium">{p.nombre}</span>
                  <a href={p.wa}>{p.celular}</a>
                </div>
                <span className="text-[13px] text-tinta-suave">
                  {p.zona} · {p.resumen} · {p.medio}
                </span>
                <div className="self-start">
                  <SelectEstado p={p} alto={40} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {det && <Detalle key={det.codigo} p={det} alCerrar={() => setDetalle(null)} />}
    </div>
  );
}
