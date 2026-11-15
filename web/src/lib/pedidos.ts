import 'server-only';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { consultar, consultarUna, enTransaccion } from './db';
import { leerCatalogo } from './catalogo';
import { resolverLinea, totales, type LineaResuelta } from './calculos';
import { estadoSemana, fechaLima } from './semana';
import type { DatosEntrega, Estado, LineaCarrito, Medio } from './tipos';

/**
 * Pedidos (ESPECIFICACION.md §4, §5 y §7). El servidor recalcula TODO a partir
 * del catálogo vigente; del navegador solo se toman ids y cantidades.
 */

export const MAX_LINEAS = 40;

export interface EntradaPedido {
  lineas: LineaCarrito[];
  entrega: DatosEntrega;
  medio: Medio;
}

export type ErroresEntrega = Partial<Record<'nombre' | 'celular' | 'zona' | 'direccion', string>>;

export type ResultadoCrear =
  | { ok: true; codigo: string; clave: string }
  | { ok: false; error: string; campos?: ErroresEntrega };

const limpiar = (t: unknown, max = 200) => String(t ?? '').replace(/\s+/g, ' ').trim().slice(0, max);

export function validarEntrega(e: Partial<DatosEntrega>, zonasActivas: string[]): ErroresEntrega {
  const errores: ErroresEntrega = {};
  if (!limpiar(e.nombre)) errores.nombre = 'Escribe tu nombre';
  if (!/^\d{9}$/.test(String(e.celular ?? ''))) errores.celular = 'El celular debe tener 9 dígitos';
  if (!zonasActivas.includes(String(e.zonaId ?? ''))) errores.zona = 'Elige tu zona';
  if (!limpiar(e.direccion)) errores.direccion = 'Escribe tu dirección';
  return errores;
}

/** Código AP-AAMM-NNNN con correlativo mensual (en la misma transacción del pedido). */
async function siguienteCodigo(c: import('pg').PoolClient, ahora: Date): Promise<string> {
  const f = fechaLima(ahora);
  const periodo = `${f.slice(2, 4)}${f.slice(5, 7)}`;
  const r = await c.query<{ ultimo: number }>(
    `insert into contador_codigos (periodo, ultimo) values ($1, 1)
     on conflict (periodo) do update set ultimo = contador_codigos.ultimo + 1
     returning ultimo`,
    [periodo],
  );
  return `AP-${periodo}-${String(r.rows[0].ultimo).padStart(4, '0')}`;
}

export async function crearPedido(
  entrada: EntradaPedido,
  captura: string | null,
  ahora = new Date(),
): Promise<ResultadoCrear> {
  const cat = await leerCatalogo();
  const c = cat.config;

  if (entrada.medio !== 'yape' && entrada.medio !== 'tarjeta') return { ok: false, error: 'Elige cómo quieres pagar.' };
  if (entrada.medio === 'tarjeta' && !c.aceptarTarjeta) return { ok: false, error: 'Por ahora solo aceptamos Yape.' };
  if (entrada.medio === 'yape' && !captura) return { ok: false, error: 'Sube la captura de tu Yape.' };

  const zonasActivas = cat.zonas.filter((z) => z.activa);
  const campos = validarEntrega(entrada.entrega ?? {}, zonasActivas.map((z) => z.id));
  if (Object.keys(campos).length) return { ok: false, error: 'Revisa tus datos de entrega.', campos };

  if (!Array.isArray(entrada.lineas) || entrada.lineas.length === 0) return { ok: false, error: 'Tu carrito está vacío.' };
  if (entrada.lineas.length > MAX_LINEAS) return { ok: false, error: 'Tu pedido tiene demasiadas líneas.' };

  const resueltas: LineaResuelta[] = [];
  for (const l of entrada.lineas) {
    const r = resolverLinea(l, cat);
    if (!r.ok) return { ok: false, error: r.error };
    resueltas.push(r.valor);
  }
  const subtotal = resueltas.reduce((s, r) => s + r.total, 0);
  if (subtotal < c.pedidoMinimo) {
    return { ok: false, error: `El pedido mínimo es S/ ${c.pedidoMinimo / 100}.` };
  }

  const zona = zonasActivas.find((z) => z.id === entrada.entrega.zonaId)!;
  const t = totales(subtotal, zona.costo, entrada.medio, c);
  const semana = estadoSemana(ahora, c).entrega;
  const clave = randomBytes(6).toString('base64url');
  const e = entrada.entrega;

  return enTransaccion(async (cx) => {
    const codigo = await siguienteCodigo(cx, ahora);
    const p = await cx.query<{ id: string }>(
      `insert into pedidos (codigo, clave, creado_en, semana_entrega, nombre, celular, zona_id, zona_nombre, direccion,
         referencia, notas, subtotal, delivery, recargo, recargo_pct, total, medio, estado, captura, captura_en)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,'pendiente',$18,$19) returning id`,
      [
        codigo, clave, ahora, semana, limpiar(e.nombre, 120), `+51${e.celular}`, zona.id, zona.nombre,
        limpiar(e.direccion, 200), limpiar(e.referencia, 200) || null, limpiar(e.notas, 500) || null,
        t.subtotal, t.delivery, t.recargo, t.recargoPct, t.total, entrada.medio, captura, captura ? ahora : null,
      ],
    );
    const id = p.rows[0].id;
    for (const r of resueltas) {
      const esPack = r.producto.categoria === 'packs';
      await cx.query(
        `insert into lineas_pedido (pedido_id, producto_id, producto_nombre, es_pack, pack_unidades, base_nombre,
           pollo_cocido_g, cantidad, precio_producto, precio_unitario, marinado_id, marinado_nombre, salsa_id,
           salsa_nombre, salsas_extra, pack_modo, pack_mezcla)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
        [
          id, r.producto.id, r.producto.nombre, esPack, esPack ? r.producto.packUnidades : null, r.base.nombre,
          r.base.polloCocidoG, r.linea.cantidad, r.producto.precio, r.unitario,
          r.marinado?.id ?? null, r.marinado?.nombre ?? null, r.salsa?.id ?? null, r.salsa?.nombre ?? null,
          JSON.stringify(r.extras.map((x) => ({ id: x.id, nombre: x.nombre }))),
          esPack ? (r.linea.packModo ?? null) : null,
          r.mezcla ? JSON.stringify(r.mezcla.map((m) => ({ id: m.marinado.id, nombre: m.marinado.nombre, n: m.n }))) : null,
        ],
      );
    }
    return { ok: true as const, codigo, clave };
  });
}

/* ---------- Lectura ---------- */

export interface LineaPedido {
  producto_nombre: string;
  es_pack: boolean;
  pack_unidades: number | null;
  base_nombre: string;
  pollo_cocido_g: number;
  cantidad: number;
  precio_unitario: number;
  marinado_nombre: string | null;
  salsa_nombre: string | null;
  salsas_extra: { id: string; nombre: string }[];
  pack_modo: 'mezcla' | 'mix-casa' | null;
  pack_mezcla: { id: string; nombre: string; n: number }[] | null;
}

export interface Pedido {
  id: string;
  codigo: string;
  clave: string;
  creado_en: Date;
  semana_entrega: string;
  nombre: string;
  celular: string;
  zona_id: string;
  zona_nombre: string;
  direccion: string;
  referencia: string | null;
  notas: string | null;
  subtotal: number;
  delivery: number;
  recargo: number;
  recargo_pct: number;
  total: number;
  medio: Medio;
  estado: Estado;
  motivo_rechazo: string | null;
  captura: string | null;
  captura_en: Date | null;
  notas_internas: string | null;
  lineas: LineaPedido[];
}

const COLUMNAS = `p.id::text, p.codigo, p.clave, p.creado_en, to_char(p.semana_entrega, 'YYYY-MM-DD') as semana_entrega,
  p.nombre, p.celular, p.zona_id, p.zona_nombre, p.direccion, p.referencia, p.notas, p.subtotal, p.delivery, p.recargo,
  p.recargo_pct::float as recargo_pct, p.total, p.medio, p.estado, p.motivo_rechazo, p.captura, p.captura_en, p.notas_internas,
  coalesce((select json_agg(json_build_object(
      'producto_nombre', l.producto_nombre, 'es_pack', l.es_pack, 'pack_unidades', l.pack_unidades,
      'base_nombre', l.base_nombre, 'pollo_cocido_g', l.pollo_cocido_g, 'cantidad', l.cantidad,
      'precio_unitario', l.precio_unitario, 'marinado_nombre', l.marinado_nombre, 'salsa_nombre', l.salsa_nombre,
      'salsas_extra', l.salsas_extra, 'pack_modo', l.pack_modo, 'pack_mezcla', l.pack_mezcla) order by l.id)
    from lineas_pedido l where l.pedido_id = p.id), '[]') as lineas`;

/** Página pública: exige el código Y la clave del enlace (comparación de tiempo constante). */
export async function obtenerPedidoPublico(codigo: string, clave: string | undefined): Promise<Pedido | null> {
  if (!/^AP-\d{4}-\d{4,}$/.test(codigo) || !clave) return null;
  const p = await consultarUna<Pedido & Record<string, unknown>>(`select ${COLUMNAS} from pedidos p where p.codigo = $1`, [codigo]);
  if (!p) return null;
  const a = Buffer.from(p.clave);
  const b = Buffer.from(clave);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return p;
}

export async function obtenerPedido(codigo: string): Promise<Pedido | null> {
  return consultarUna<Pedido & Record<string, unknown>>(`select ${COLUMNAS} from pedidos p where p.codigo = $1`, [codigo]);
}

export async function listarSemana(semana: string): Promise<Pedido[]> {
  return consultar<Pedido & Record<string, unknown>>(
    `select ${COLUMNAS} from pedidos p where p.semana_entrega = $1 order by p.creado_en`,
    [semana],
  );
}

export async function contarPendientesYape(semana: string): Promise<number> {
  const r = await consultarUna<{ n: number }>(
    `select count(*)::int as n from pedidos where semana_entrega = $1 and estado = 'pendiente' and medio = 'yape' and captura is not null`,
    [semana],
  );
  return r?.n ?? 0;
}

/* ---------- Cambios ---------- */

export async function cambiarEstado(codigo: string, estado: Estado, motivo?: string | null): Promise<boolean> {
  const r = await consultar(
    `update pedidos set estado = $2,
       motivo_rechazo = case when $2 = 'rechazado' then $3 else null end,
       pagado_en = case when $2 = 'pagado' and pagado_en is null then now() else pagado_en end,
       entregado_en = case when $2 = 'entregado' then now() else null end,
       actualizado_en = now()
     where codigo = $1 returning id`,
    [codigo, estado, motivo ?? null],
  );
  return r.length > 0;
}

export async function guardarNotasInternas(codigo: string, notas: string): Promise<void> {
  await consultar('update pedidos set notas_internas = $2, actualizado_en = now() where codigo = $1', [codigo, notas.slice(0, 2000) || null]);
}

/** El cliente vuelve a subir la captura tras un rechazo: el pedido vuelve a la cola. */
export async function reemplazarCaptura(codigo: string, archivo: string): Promise<boolean> {
  const r = await consultar(
    `update pedidos set captura = $2, captura_en = now(), estado = 'pendiente', motivo_rechazo = null, actualizado_en = now()
     where codigo = $1 and medio = 'yape' and estado = 'rechazado' returning id`,
    [codigo, archivo],
  );
  return r.length > 0;
}

/** Resumen corto de ítems para tablas: `3 × Burrito, 2 × Fideos`. */
export function resumenItems(p: Pedido): string {
  return p.lineas
    .map((l) => `${l.cantidad} × ${l.producto_nombre.replace(' de pollo', '').replace(' con pollo', '')}`)
    .join(', ');
}

/** Detalle de una línea guardada, igual que en el carrito. */
export function detalleLinea(l: LineaPedido): string {
  const ext = l.salsas_extra?.length ? ` · Extra: ${l.salsas_extra.map((e) => e.nombre).join(', ')}` : '';
  if (l.es_pack) {
    const m = l.pack_modo === 'mezcla' && l.pack_mezcla
      ? l.pack_mezcla.filter((x) => x.n > 0).map((x) => `${x.n} ${x.nombre}`).join(', ')
      : 'Mix de la casa';
    return `${m}${ext}`;
  }
  return `${l.marinado_nombre ?? ''} · Salsa: ${l.salsa_nombre ?? ''}${ext}`;
}
