import { NextResponse, type NextRequest } from 'next/server';

/**
 * Fuerza HTTPS y agrega cabeceras de seguridad (patrón La Doble T). Por el
 * checkout viajan nombre, celular, dirección y la captura del Yape.
 */
export function middleware(request: NextRequest) {
  if (request.headers.get('x-forwarded-proto') === 'http') {
    const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
    const esLocal = !host || /^(localhost|127\.0\.0\.1|\[::1\]|0\.0\.0\.0)(:\d+)?$/.test(host);
    if (host && !esLocal) {
      return NextResponse.redirect(new URL(request.nextUrl.pathname + request.nextUrl.search, `https://${host}`), 308);
    }
  }
  const r = NextResponse.next();
  r.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  r.headers.set('X-Content-Type-Options', 'nosniff');
  r.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  // SAMEORIGIN: nadie más puede embeber la web, pero sí la propia (vista previa a 390 px).
  r.headers.set('X-Frame-Options', 'SAMEORIGIN');
  if (request.nextUrl.pathname.startsWith('/panel')) r.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return r;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|marca/|fotos/|favicon.ico|api/salud).*)'],
};
