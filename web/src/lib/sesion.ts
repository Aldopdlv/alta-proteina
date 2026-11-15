import 'server-only';
import { createHash, createHmac, scryptSync, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Panel con contraseña ÚNICA (ESPECIFICACION.md §9): sin usuarios.
 *
 * - PANEL_CLAVE_HASH = `scrypt.<sal>.<hash>` (lo genera scripts/clave-panel.mjs).
 * - La cookie httpOnly lleva vencimiento + huella del hash, firmada con HMAC:
 *   si se cambia la contraseña, todas las sesiones abiertas mueren.
 */

export const COOKIE = 'ap_panel';
const DURACION_DIAS = 30;

function secreto(): string {
  const s = process.env.SESION_SECRETO;
  if (!s || s.length < 32) throw new Error('Falta SESION_SECRETO (mínimo 32 caracteres) en el .env');
  return s;
}

function hashConfigurado(): string {
  const h = process.env.PANEL_CLAVE_HASH;
  if (!h || !h.startsWith('scrypt.')) throw new Error('Falta PANEL_CLAVE_HASH en el .env (node scripts/clave-panel.mjs).');
  return h;
}

const huella = () => createHash('sha256').update(hashConfigurado()).digest('base64url').slice(0, 12);
const firmar = (datos: string) => createHmac('sha256', secreto()).update(datos).digest('base64url');

export function claveCorrecta(clave: string): boolean {
  const [, sal, esperado] = hashConfigurado().split('.');
  const calculado = scryptSync(clave, sal, 32);
  const e = Buffer.from(esperado, 'base64url');
  return e.length === calculado.length && timingSafeEqual(e, calculado);
}

export function crearToken(ahora = Date.now()): { token: string; expira: Date } {
  const expira = new Date(ahora + DURACION_DIAS * 86_400_000);
  const datos = Buffer.from(JSON.stringify({ e: expira.getTime(), h: huella() })).toString('base64url');
  return { token: `${datos}.${firmar(datos)}`, expira };
}

export function tokenValido(token: string | undefined, ahora = Date.now()): boolean {
  if (!token) return false;
  const [datos, firma] = token.split('.');
  if (!datos || !firma) return false;
  const a = Buffer.from(firmar(datos));
  const b = Buffer.from(firma);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  try {
    const { e, h } = JSON.parse(Buffer.from(datos, 'base64url').toString());
    return e > ahora && h === huella();
  } catch {
    return false;
  }
}

export async function iniciarSesion(): Promise<void> {
  const { token, expira } = crearToken();
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expira,
  });
}

export async function cerrarSesion(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

export async function haySesion(): Promise<boolean> {
  return tokenValido((await cookies()).get(COOKIE)?.value);
}

/** Para páginas y acciones del panel. */
export async function requerirSesion(): Promise<void> {
  if (!(await haySesion())) redirect('/panel/ingresar');
}
