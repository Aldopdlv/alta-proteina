import { leerFoto } from '@/lib/fotos';

export const dynamic = 'force-dynamic';

/** Fotos públicas (productos, QR del Yape). El nombre es único: se cachea un año. */
export async function GET(_r: Request, { params }: { params: Promise<{ archivo: string }> }) {
  const foto = await leerFoto((await params).archivo);
  if (!foto) return new Response('No encontrado', { status: 404 });
  return new Response(new Uint8Array(foto.contenido), {
    headers: { 'Content-Type': foto.tipo, 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
}
