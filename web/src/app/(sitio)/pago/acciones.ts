'use server';

import { guardarCaptura } from '@/lib/capturas';
import { avisarPedido } from '@/lib/avisos';
import { crearPedido, obtenerPedido, obtenerPedidoPublico, reemplazarCaptura, type EntradaPedido, type ResultadoCrear } from '@/lib/pedidos';

/**
 * Crea el pedido (Yape con captura, o tarjeta). El navegador manda carrito +
 * entrega + medio; el servidor recalcula todo (ESPECIFICACION.md §7).
 */
export async function enviarPedido(form: FormData): Promise<ResultadoCrear> {
  let entrada: EntradaPedido;
  try {
    entrada = JSON.parse(String(form.get('datos') ?? ''));
  } catch {
    return { ok: false, error: 'No pudimos leer tu pedido. Recarga la página e intenta otra vez.' };
  }

  let captura: string | null = null;
  if (entrada.medio === 'yape') {
    const archivo = form.get('captura');
    const r = await guardarCaptura(archivo instanceof File ? archivo : null);
    if (!r.ok) return { ok: false, error: r.error };
    captura = r.archivo;
  }

  try {
    const r = await crearPedido(entrada, captura);
    if (r.ok) {
      const p = await obtenerPedido(r.codigo);
      if (p) void avisarPedido(p, 'nuevo');
    }
    return r;
  } catch (e) {
    console.error('[pago] no se pudo crear el pedido', e);
    return { ok: false, error: 'No pudimos registrar tu pedido. Intenta otra vez en un momento.' };
  }
}

/** Tras un rechazo, el cliente vuelve a subir la captura desde su enlace. */
export async function resubirCaptura(form: FormData): Promise<{ ok: boolean; error?: string }> {
  const codigo = String(form.get('codigo') ?? '');
  const clave = String(form.get('clave') ?? '');
  const p = await obtenerPedidoPublico(codigo, clave);
  if (!p || p.estado !== 'rechazado' || p.medio !== 'yape') return { ok: false, error: 'Este pedido ya no espera una captura nueva.' };
  const archivo = form.get('captura');
  const r = await guardarCaptura(archivo instanceof File ? archivo : null);
  if (!r.ok) return { ok: false, error: r.error };
  const ok = await reemplazarCaptura(codigo, r.archivo);
  if (ok) {
    const actualizado = await obtenerPedido(codigo);
    if (actualizado) void avisarPedido(actualizado, 'nueva-captura');
  }
  return ok ? { ok: true } : { ok: false, error: 'No pudimos actualizar tu pedido. Escríbenos por WhatsApp.' };
}
