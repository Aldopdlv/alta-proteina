/**
 * Formatos de es-PE tal como los pide el diseño (ESPECIFICACION.md §2 y §3).
 * Puro: se usa en servidor, navegador y pruebas.
 */

export const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
export const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];
const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

/** `S/ 61` si es entero; `S/ 61,50` si no (menú y carrito). */
export function soles(centimos: number): string {
  if (centimos % 100 === 0) return `S/ ${centimos / 100}`;
  return soles2(centimos);
}

/** Siempre con dos decimales y coma: `S/ 61,00` (pago, pedido y panel). */
export function soles2(centimos: number): string {
  const negativo = centimos < 0;
  const abs = Math.abs(Math.round(centimos));
  const enteros = Math.floor(abs / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const dec = (abs % 100).toString().padStart(2, '0');
  return `${negativo ? '−' : ''}S/ ${enteros},${dec}`;
}

/** `19:00` → `7:00 p. m.` (con minutos) o `7 p. m.` (sin minutos si son :00). */
export function hora(hhmm: string, conMinutos = true): string {
  const [h, m] = hhmm.split(':').map(Number);
  const sufijo = h < 12 ? 'a. m.' : 'p. m.';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  if (!conMinutos && m === 0) return `${h12} ${sufijo}`;
  return `${h12}:${String(m).padStart(2, '0')} ${sufijo}`;
}

/** Fecha 'AAAA-MM-DD' → partes (sin zona horaria: es una fecha de calendario). */
function partes(fecha: string): { y: number; m: number; d: number; dow: number } {
  const [y, m, d] = fecha.split('-').map(Number);
  const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return { y, m, d, dow };
}

/** `domingo 22` */
export function diaCorto(fecha: string): string {
  const p = partes(fecha);
  return `${DIAS[p.dow]} ${p.d}`;
}

/** `domingo 22 de noviembre` */
export function diaLargo(fecha: string): string {
  const p = partes(fecha);
  return `${DIAS[p.dow]} ${p.d} de ${MESES[p.m - 1]}`;
}

export function mayuscula(t: string): string {
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/** `9 a. m. y 3 p. m.` */
export function ventana(desde: string, hasta: string): string {
  return `${hora(desde, false)} y ${hora(hasta, false)}`;
}

/** Instante → `12 nov · 9:14 p. m.` en hora de Lima. */
export function momentoCorto(instante: Date): string {
  const l = new Date(instante.getTime() - 5 * 3_600_000);
  const hh = `${String(l.getUTCHours()).padStart(2, '0')}:${String(l.getUTCMinutes()).padStart(2, '0')}`;
  return `${l.getUTCDate()} ${MESES_CORTOS[l.getUTCMonth()]} · ${hora(hh)}`;
}

/** `933980759` → `933 980 759` */
export function celularLegible(nueve: string): string {
  const d = nueve.replace(/\D/g, '').slice(-9);
  return d.length === 9 ? `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}` : nueve;
}

/** Kilos con hasta dos decimales y coma: 5.25 → `5,25`; 9.5 → `9,5`; 7 → `7`. */
export function kilos(kg: number): string {
  return (Math.round(kg * 100) / 100).toFixed(2).replace(/0+$/, '').replace(/\.$/, '').replace('.', ',');
}

/** Lista en español: a, b y c. */
export function enumerar(items: string[]): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`;
}

export function enlaceWhatsapp(numero: string, texto?: string): string {
  const n = numero.replace(/\D/g, '');
  return `https://wa.me/${n}${texto ? `?text=${encodeURIComponent(texto)}` : ''}`;
}
