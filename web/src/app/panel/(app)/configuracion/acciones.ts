'use server';

import { revalidatePath } from 'next/cache';
import { consultar, enTransaccion } from '@/lib/db';
import { guardarFoto } from '@/lib/fotos';
import { requerirSesion } from '@/lib/sesion';

export type Resultado = { ok: boolean; mensaje: string } | null;

/** '12', '12,5', '12.50', 'S/ 12' → céntimos. */
function centimos(v: FormDataEntryValue | null): number | null {
  const t = String(v ?? '').replace(/S\/|\s/g, '').replace(',', '.');
  if (!/^\d+(\.\d{1,2})?$/.test(t)) return null;
  return Math.round(Number(t) * 100);
}
const texto = (v: FormDataEntryValue | null, max = 200) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
const marcado = (f: FormData, k: string) => f.get(k) === 'on';
const entero = (v: FormDataEntryValue | null) => (/^\d+$/.test(String(v ?? '').trim()) ? Number(v) : null);
const hhmm = (v: FormDataEntryValue | null) => (/^([01]\d|2[0-3]):[0-5]\d$/.test(String(v)) ? String(v) : null);
const dia = (v: FormDataEntryValue | null) => {
  const n = entero(v);
  return n !== null && n >= 0 && n <= 6 ? n : null;
};
function slug(nombre: string): string {
  return nombre
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40) || `x-${Date.now()}`;
}

function listo(mensaje = 'Cambios guardados.'): Resultado {
  revalidatePath('/', 'layout');
  return { ok: true, mensaje };
}

export async function guardarProductos(_p: Resultado, f: FormData): Promise<Resultado> {
  await requerirSesion();
  const ids = f.getAll('id').map(String);
  const cambios: { id: string; nombre: string; descripcion: string; precio: number; activo: boolean; imagen: string | null }[] = [];
  for (const id of ids) {
    const nombre = texto(f.get(`nombre_${id}`), 80);
    const precio = centimos(f.get(`precio_${id}`));
    if (!nombre) return { ok: false, mensaje: 'Cada producto necesita un nombre.' };
    if (!precio) return { ok: false, mensaje: `Revisa el precio de ${nombre}.` };
    let imagen: string | null = null;
    const foto = f.get(`foto_${id}`);
    if (foto instanceof File && foto.size > 0) {
      const r = await guardarFoto(foto);
      if (!r.ok) return { ok: false, mensaje: `${nombre}: ${r.error}` };
      imagen = r.archivo;
    }
    cambios.push({ id, nombre, descripcion: texto(f.get(`descripcion_${id}`), 240), precio, activo: marcado(f, `activo_${id}`), imagen });
  }
  await enTransaccion(async (c) => {
    for (const x of cambios) {
      await c.query(
        `update productos set nombre = $2, descripcion = $3, precio = $4, activo = $5, imagen = coalesce($6, imagen) where id = $1`,
        [x.id, x.nombre, x.descripcion, x.precio, x.activo, x.imagen],
      );
    }
  });
  return listo();
}

export async function guardarOpciones(_p: Resultado, f: FormData): Promise<Resultado> {
  await requerirSesion();
  const extra = centimos(f.get('precio_salsa_extra'));
  if (extra === null) return { ok: false, mensaje: 'Revisa el precio de la salsa extra.' };
  const marinados = f.getAll('marinado').map(String);
  const salsas = f.getAll('salsa').map(String);
  if (!marinados.some((id) => marcado(f, `m_activo_${id}`)) && !texto(f.get('m_nuevo'))) return { ok: false, mensaje: 'Deja al menos un marinado activo.' };
  if (!salsas.some((id) => marcado(f, `s_activa_${id}`)) && !texto(f.get('s_nueva'))) return { ok: false, mensaje: 'Deja al menos una salsa activa.' };

  await enTransaccion(async (c) => {
    await c.query('update config set precio_salsa_extra = $1, actualizado_en = now() where id = 1', [extra]);
    for (const id of marinados) {
      const nombre = texto(f.get(`m_nombre_${id}`), 60);
      if (!nombre) continue;
      await c.query('update marinados set nombre = $2, descripcion = $3, activo = $4 where id = $1', [id, nombre, texto(f.get(`m_desc_${id}`), 120), marcado(f, `m_activo_${id}`)]);
    }
    for (const id of salsas) {
      const nombre = texto(f.get(`s_nombre_${id}`), 60);
      if (!nombre) continue;
      await c.query('update salsas set nombre = $2, activa = $3 where id = $1', [id, nombre, marcado(f, `s_activa_${id}`)]);
    }
    const mNuevo = texto(f.get('m_nuevo'), 60);
    if (mNuevo) {
      await c.query(
        `insert into marinados (id, nombre, descripcion, orden) values ($1, $2, $3, (select coalesce(max(orden), 0) + 1 from marinados)) on conflict (id) do nothing`,
        [slug(mNuevo), mNuevo, texto(f.get('m_nuevo_desc'), 120)],
      );
    }
    const sNueva = texto(f.get('s_nueva'), 60);
    if (sNueva) {
      await c.query(`insert into salsas (id, nombre, orden) values ($1, $2, (select coalesce(max(orden), 0) + 1 from salsas)) on conflict (id) do nothing`, [slug(sNueva), sNueva]);
    }
  });
  return listo();
}

export async function guardarZonas(_p: Resultado, f: FormData): Promise<Resultado> {
  await requerirSesion();
  const ids = f.getAll('zona').map(String);
  const filas: { id: string; nombre: string; costo: number; activa: boolean }[] = [];
  for (const id of ids) {
    const nombre = texto(f.get(`z_nombre_${id}`), 60);
    const costo = centimos(f.get(`z_costo_${id}`) || '0');
    if (!nombre || costo === null) return { ok: false, mensaje: 'Revisa nombre y costo de cada zona.' };
    filas.push({ id, nombre, costo, activa: marcado(f, `z_activa_${id}`) });
  }
  const nueva = texto(f.get('z_nueva'), 60);
  const costoNueva = centimos(f.get('z_nueva_costo') || '0');
  if (nueva && costoNueva === null) return { ok: false, mensaje: 'Revisa el costo de la zona nueva.' };
  if (!filas.some((z) => z.activa) && !nueva) return { ok: false, mensaje: 'Deja al menos una zona activa.' };
  await enTransaccion(async (c) => {
    for (const z of filas) await c.query('update zonas set nombre = $2, costo = $3, activa = $4 where id = $1', [z.id, z.nombre, z.costo, z.activa]);
    if (nueva) {
      await c.query(`insert into zonas (id, nombre, costo, orden) values ($1, $2, $3, (select coalesce(max(orden), 0) + 1 from zonas)) on conflict (id) do nothing`, [slug(nueva), nueva, costoNueva]);
    }
  });
  return listo();
}

export async function guardarCalendario(_p: Resultado, f: FormData): Promise<Resultado> {
  await requerirSesion();
  const v = {
    corteDia: dia(f.get('corte_dia')),
    corteHora: hhmm(f.get('corte_hora')),
    cocinaDia: dia(f.get('cocina_dia')),
    entregaDia: dia(f.get('entrega_dia')),
    desde: hhmm(f.get('entrega_desde')),
    hasta: hhmm(f.get('entrega_hasta')),
    minimo: centimos(f.get('pedido_minimo')),
  };
  if (Object.values(v).some((x) => x === null)) return { ok: false, mensaje: 'Revisa días, horas y pedido mínimo.' };
  if (v.desde! >= v.hasta!) return { ok: false, mensaje: 'La ventana de entrega debe empezar antes de terminar.' };
  await consultar(
    `update config set corte_dia = $1, corte_hora = $2, cocina_dia = $3, entrega_dia = $4, entrega_desde = $5, entrega_hasta = $6,
       pedido_minimo = $7, actualizado_en = now() where id = 1`,
    [v.corteDia, v.corteHora, v.cocinaDia, v.entregaDia, v.desde, v.hasta, v.minimo],
  );
  return listo('Guardado. La barra de corte y las fechas ya usan los valores nuevos.');
}

export async function guardarPagos(_p: Resultado, f: FormData): Promise<Resultado> {
  await requerirSesion();
  const yape = String(f.get('yape_numero') ?? '').replace(/\D/g, '');
  const whatsapp = String(f.get('whatsapp') ?? '').replace(/\D/g, '');
  const umbral = centimos(f.get('recargo_umbral'));
  const bajo = Number(String(f.get('recargo_bajo_pct')).replace(',', '.'));
  const alto = Number(String(f.get('recargo_alto_pct')).replace(',', '.'));
  const instagram = texto(f.get('instagram_url'), 200);
  if (!/^9\d{8}$/.test(yape)) return { ok: false, mensaje: 'El número de Yape debe tener 9 dígitos y empezar con 9.' };
  if (!/^51?9\d{8}$/.test(whatsapp) && !/^9\d{8}$/.test(whatsapp)) return { ok: false, mensaje: 'Revisa el número de WhatsApp.' };
  if (!umbral || !(bajo >= 0 && bajo <= 30) || !(alto >= 0 && alto <= 30)) return { ok: false, mensaje: 'Revisa los recargos de tarjeta.' };
  if (instagram && !/^https:\/\//.test(instagram)) return { ok: false, mensaje: 'El enlace de Instagram debe empezar con https://' };

  let qr: string | null = null;
  const foto = f.get('yape_qr');
  if (foto instanceof File && foto.size > 0) {
    const r = await guardarFoto(foto);
    if (!r.ok) return { ok: false, mensaje: `QR: ${r.error}` };
    qr = r.archivo;
  }
  await consultar(
    `update config set yape_numero = $1, yape_titular = $2, whatsapp = $3, instagram_url = $4, aceptar_tarjeta = $5,
       proveedor_pago = $6, recargo_umbral = $7, recargo_bajo_pct = $8, recargo_alto_pct = $9,
       yape_qr = coalesce($10, yape_qr), actualizado_en = now() where id = 1`,
    [
      yape, texto(f.get('yape_titular'), 80) || 'Alta Proteína', whatsapp.length === 9 ? `51${whatsapp}` : whatsapp, instagram || null,
      marcado(f, 'aceptar_tarjeta'), texto(f.get('proveedor_pago'), 60) || null, umbral, bajo, alto, qr,
    ],
  );
  return listo();
}

export async function guardarRendimiento(_p: Resultado, f: FormData): Promise<Resultado> {
  await requerirSesion();
  const rend = Number(String(f.get('rendimiento')).replace(',', '.')) / 100;
  const pollo = entero(f.get('pollo_cocido_g'));
  const proteina = entero(f.get('proteina_g'));
  const congelado = entero(f.get('duracion_congelado_dias'));
  if (!(rend > 0.2 && rend <= 1) || !pollo || !proteina || !congelado) return { ok: false, mensaje: 'Revisa los valores (rendimiento entre 20 y 100 %).' };
  await enTransaccion(async (c) => {
    await c.query('update config set rendimiento_coccion = $1, mostrar_proteina = $2, duracion_congelado_dias = $3, actualizado_en = now() where id = 1', [rend, marcado(f, 'mostrar_proteina'), congelado]);
    await c.query(`update productos set pollo_cocido_g = $1, proteina_g = $2 where categoria <> 'packs'`, [pollo, proteina]);
  });
  return listo();
}
