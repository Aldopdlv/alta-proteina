/**
 * Límite de intentos de ingreso (adaptado de ALEPH): 8 fallos en 15 min
 * bloquean esa IP 15 min. En memoria: alcanza para una sola instancia.
 */

interface Registro {
  intentos: number;
  desde: number;
  bloqueadoHasta?: number;
}

const VENTANA_MS = 15 * 60_000;
const MAX_INTENTOS = 8;
const BLOQUEO_MS = 15 * 60_000;
const registros = new Map<string, Registro>();

export function verificarLimite(clave: string): { permitido: boolean; esperaMinutos?: number } {
  const ahora = Date.now();
  if (registros.size > 5_000) registros.clear();
  const r = registros.get(clave);
  if (!r) return { permitido: true };
  if (r.bloqueadoHasta && r.bloqueadoHasta > ahora) {
    return { permitido: false, esperaMinutos: Math.ceil((r.bloqueadoHasta - ahora) / 60_000) };
  }
  if (ahora - r.desde > VENTANA_MS) registros.delete(clave);
  return { permitido: true };
}

export function registrarFallo(clave: string): void {
  const ahora = Date.now();
  const r = registros.get(clave);
  if (!r || ahora - r.desde > VENTANA_MS) {
    registros.set(clave, { intentos: 1, desde: ahora });
    return;
  }
  r.intentos += 1;
  if (r.intentos >= MAX_INTENTOS) r.bloqueadoHasta = ahora + BLOQUEO_MS;
}

export function registrarExito(clave: string): void {
  registros.delete(clave);
}
