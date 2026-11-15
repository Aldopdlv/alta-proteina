import 'server-only';
import { consultarUna } from './db';
import { leerConfig } from './catalogo';
import { detalleLinea, listarSemana, resumenItems, type Pedido } from './pedidos';
import { esSemanaValida, semanaPanel } from './semana';
import { celularLegible, diaCorto, enlaceWhatsapp, momentoCorto } from './formato';
import { plantillasWhatsapp } from './textos';
import type { Config } from './tipos';

/** Datos del panel ya listos para los componentes del navegador. */

export interface PedidoVista {
  codigo: string;
  creado: string;
  semana: string;
  nombre: string;
  celular: string;
  wa: string;
  zona: string;
  direccion: string;
  referencia: string | null;
  notas: string | null;
  notasInternas: string;
  resumen: string;
  items: { titulo: string; sub: string }[];
  total: number;
  medio: 'Yape' | 'Tarjeta';
  estado: string;
  motivo: string | null;
  captura: string | null;
  capturaEsHeic: boolean;
  avisos: { etiqueta: string; url: string }[];
}

export function enlacePedido(p: Pick<Pedido, 'codigo' | 'clave'>): string {
  return `${process.env.SITIO_URL ?? ''}/pedido/${p.codigo}?t=${p.clave}`;
}

export function aVista(p: Pedido, c: Config): PedidoVista {
  const nueve = p.celular.replace(/^\+51/, '');
  const pl = plantillasWhatsapp({ nombre: p.nombre, codigo: p.codigo, entrega: p.semana_entrega, enlace: enlacePedido(p), motivo: p.motivo_rechazo }, c);
  const wa = (t?: string) => enlaceWhatsapp(`51${nueve}`, t);
  const avisos: PedidoVista['avisos'] = [];
  if (p.estado === 'pendiente' && p.medio === 'tarjeta') avisos.push({ etiqueta: 'Enviar link de pago', url: wa(pl.linkTarjeta) });
  if (p.estado === 'pagado') avisos.push({ etiqueta: 'Avisar pago confirmado', url: wa(pl.pagado) });
  if (p.estado === 'rechazado') avisos.push({ etiqueta: 'Avisar rechazo', url: wa(pl.rechazado) });
  if (p.estado === 'pagado' || p.estado === 'preparado') avisos.push({ etiqueta: 'Avisar que sale hoy', url: wa(pl.enCamino) });
  return {
    codigo: p.codigo,
    creado: momentoCorto(new Date(p.creado_en)),
    semana: diaCorto(p.semana_entrega),
    nombre: p.nombre,
    celular: `+51 ${celularLegible(nueve)}`,
    wa: wa(),
    zona: p.zona_nombre,
    direccion: p.direccion,
    referencia: p.referencia,
    notas: p.notas,
    notasInternas: p.notas_internas ?? '',
    resumen: resumenItems(p),
    items: p.lineas.map((l) => ({ titulo: `${l.cantidad} × ${l.producto_nombre}`, sub: detalleLinea(l) })),
    total: p.total,
    medio: p.medio === 'yape' ? 'Yape' : 'Tarjeta',
    estado: p.estado,
    motivo: p.motivo_rechazo,
    captura: p.captura ? `/panel/capturas/${p.captura}` : null,
    capturaEsHeic: !!p.captura?.endsWith('.heic'),
    avisos,
  };
}

export async function semanaElegida(param: string | undefined): Promise<{ semana: string; config: Config }> {
  const config = await leerConfig();
  const semana = esSemanaValida(param, config.entregaDia) ? param : semanaPanel(new Date(), config.entregaDia);
  return { semana, config };
}

export async function datosSemana(param: string | undefined) {
  const { semana, config } = await semanaElegida(param);
  const pedidos = await listarSemana(semana);
  return { semana, config, pedidos };
}

export async function contarCola(): Promise<number> {
  const r = await consultarUna<{ n: number }>(
    `select count(*)::int as n from pedidos where estado = 'pendiente' and medio = 'yape' and captura is not null`,
  );
  return r?.n ?? 0;
}
