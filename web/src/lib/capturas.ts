import 'server-only';
import { randomBytes } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Capturas de Yape (patrón La Doble T). Son PRIVADAS: muestran nombre, número
 * y monto del cliente. No hay URL pública; el panel las sirve detrás de su
 * login y a Telegram se manda el archivo mismo.
 */

const DIRECTORIO = process.env.CAPTURAS_DIR ?? '/app/uploads/capturas';
export const TAMANO_MAXIMO = 5 * 1024 * 1024;

const TIPOS: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/heic': '.heic',
  'image/heif': '.heic',
};
const POR_EXTENSION: Record<string, string> = { jpg: '.jpg', jpeg: '.jpg', png: '.png', webp: '.webp', heic: '.heic', heif: '.heic' };
const MIME: Record<string, string> = { '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.heic': 'image/heic' };

export type ResultadoGuardado = { ok: true; archivo: string } | { ok: false; error: string };

export async function guardarCaptura(entrada: File | null): Promise<ResultadoGuardado> {
  if (!entrada || entrada.size === 0) return { ok: false, error: 'No recibimos ninguna imagen.' };
  if (entrada.size > TAMANO_MAXIMO) {
    return { ok: false, error: `La imagen pesa ${(entrada.size / 1024 / 1024).toFixed(1).replace('.', ',')} MB y el máximo son 5 MB.` };
  }
  // Algunos celulares mandan HEIC sin tipo: se mira la extensión.
  const extension = TIPOS[entrada.type] ?? POR_EXTENSION[entrada.name.split('.').pop()?.toLowerCase() ?? ''];
  if (!extension) return { ok: false, error: 'Sube una imagen JPG, PNG o HEIC.' };

  try {
    await mkdir(DIRECTORIO, { recursive: true });
    const nombre = `${randomBytes(32).toString('hex')}${extension}`;
    await writeFile(join(DIRECTORIO, nombre), Buffer.from(await entrada.arrayBuffer()), { mode: 0o640 });
    return { ok: true, archivo: nombre };
  } catch (e) {
    console.error('[capturas] no se pudo guardar', e);
    return { ok: false, error: 'No pudimos guardar la captura. Intenta otra vez.' };
  }
}

export async function leerCaptura(nombre: string): Promise<{ contenido: Buffer; tipo: string } | null> {
  // Sin esto, un nombre como `../../.env` saldría del directorio.
  if (!/^[a-f0-9]{64}\.(jpg|png|webp|heic)$/.test(nombre)) return null;
  try {
    const contenido = await readFile(join(DIRECTORIO, nombre));
    return { contenido, tipo: MIME[nombre.slice(nombre.lastIndexOf('.'))] ?? 'application/octet-stream' };
  } catch {
    return null;
  }
}
