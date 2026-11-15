import 'server-only';
import { randomBytes } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Fotos PÚBLICAS subidas desde el panel: productos y QR del Yape.
 * Viven en un volumen (no en /public, que se
 * reemplaza en cada despliegue) y se sirven en /fotos/<archivo>.
 */

const DIRECTORIO = process.env.FOTOS_DIR ?? '/app/uploads/fotos';
const TAMANO_MAXIMO = 8 * 1024 * 1024;
const TIPOS: Record<string, string> = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' };

export type ResultadoFoto = { ok: true; archivo: string } | { ok: false; error: string };

export async function guardarFoto(entrada: File): Promise<ResultadoFoto> {
  if (!entrada || entrada.size === 0) return { ok: false, error: 'No recibimos ninguna imagen.' };
  if (entrada.size > TAMANO_MAXIMO) return { ok: false, error: 'La imagen pesa más de 8 MB.' };
  const extension = TIPOS[entrada.type];
  if (!extension) return { ok: false, error: 'Sube una foto JPG, PNG o WebP.' };
  await mkdir(DIRECTORIO, { recursive: true });
  const nombre = `${randomBytes(16).toString('hex')}${extension}`;
  await writeFile(join(DIRECTORIO, nombre), Buffer.from(await entrada.arrayBuffer()), { mode: 0o644 });
  return { ok: true, archivo: nombre };
}

export async function leerFoto(nombre: string): Promise<{ contenido: Buffer; tipo: string } | null> {
  if (!/^[a-f0-9]{32}\.(jpg|png|webp)$/.test(nombre)) return null;
  try {
    const contenido = await readFile(join(DIRECTORIO, nombre));
    const tipo = Object.entries(TIPOS).find(([, ext]) => nombre.endsWith(ext))![0];
    return { contenido, tipo };
  } catch {
    return null;
  }
}
