import { leerCaptura } from '@/lib/capturas';
import { haySesion } from '@/lib/sesion';

export const dynamic = 'force-dynamic';

/** Capturas de Yape: solo con sesión del panel (ESPECIFICACION.md §9). */
export async function GET(_r: Request, { params }: { params: Promise<{ archivo: string }> }) {
  if (!(await haySesion())) return new Response('No autorizado', { status: 401 });
  const c = await leerCaptura((await params).archivo);
  if (!c) return new Response('No encontrado', { status: 404 });
  return new Response(new Uint8Array(c.contenido), {
    headers: { 'Content-Type': c.tipo, 'Cache-Control': 'private, max-age=3600', 'X-Robots-Tag': 'noindex' },
  });
}
