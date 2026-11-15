'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { claveCorrecta, cerrarSesion, iniciarSesion, requerirSesion } from '@/lib/sesion';
import { registrarExito, registrarFallo, verificarLimite } from '@/lib/limite-intentos';
import { cambiarEstado, guardarNotasInternas } from '@/lib/pedidos';
import { MOTIVOS_RECHAZO } from '@/lib/textos';
import type { Estado } from '@/lib/tipos';

const ESTADOS: Estado[] = ['pendiente', 'pagado', 'preparado', 'entregado', 'rechazado'];

async function ip(): Promise<string> {
  const h = await headers();
  return h.get('cf-connecting-ip') ?? h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';
}

export async function ingresar(_previo: string | null, form: FormData): Promise<string | null> {
  const origen = await ip();
  const limite = verificarLimite(origen);
  if (!limite.permitido) return `Demasiados intentos. Espera ${limite.esperaMinutos} min.`;
  const clave = String(form.get('clave') ?? '');
  if (!clave || !claveCorrecta(clave)) {
    registrarFallo(origen);
    return 'Contraseña incorrecta.';
  }
  registrarExito(origen);
  await iniciarSesion();
  redirect('/panel');
}

export async function salir(): Promise<void> {
  await cerrarSesion();
  redirect('/panel/ingresar');
}

function refrescar() {
  revalidatePath('/panel', 'layout');
}

export async function fijarEstado(codigo: string, estado: string): Promise<{ ok: boolean }> {
  await requerirSesion();
  if (!ESTADOS.includes(estado as Estado)) return { ok: false };
  const ok = await cambiarEstado(codigo, estado as Estado, estado === 'rechazado' ? 'Otro' : null);
  refrescar();
  return { ok };
}

export async function aprobarYape(codigo: string): Promise<{ ok: boolean }> {
  await requerirSesion();
  const ok = await cambiarEstado(codigo, 'pagado');
  refrescar();
  return { ok };
}

export async function rechazarYape(codigo: string, motivo: string): Promise<{ ok: boolean }> {
  await requerirSesion();
  const m = MOTIVOS_RECHAZO.includes(motivo) ? motivo : 'Otro';
  const ok = await cambiarEstado(codigo, 'rechazado', m);
  refrescar();
  return { ok };
}

export async function marcarEntregado(codigo: string, entregado: boolean): Promise<{ ok: boolean }> {
  await requerirSesion();
  const ok = await cambiarEstado(codigo, entregado ? 'entregado' : 'preparado');
  refrescar();
  return { ok };
}

export async function guardarNotas(codigo: string, notas: string): Promise<{ ok: boolean }> {
  await requerirSesion();
  await guardarNotasInternas(codigo, notas);
  refrescar();
  return { ok: true };
}
