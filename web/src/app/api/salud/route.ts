import { NextResponse } from 'next/server';
import { consultarUna, hayBase } from '@/lib/db';

export const dynamic = 'force-dynamic';

/** Healthcheck de Docker: la app responde y llega a la base. */
export async function GET() {
  if (!hayBase()) return NextResponse.json({ ok: true, base: 'sin configurar' });
  try {
    await consultarUna('select 1');
    return NextResponse.json({ ok: true, base: 'ok' });
  } catch {
    return NextResponse.json({ ok: false, base: 'caida' }, { status: 503 });
  }
}
