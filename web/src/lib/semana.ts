/**
 * Semana de pedido y corte (ESPECIFICACION.md §2). Puro y probado.
 *
 * Lima es UTC−5 todo el año (sin horario de verano), así que el cálculo se
 * hace con un desfase fijo y no depende de la zona horaria del servidor.
 *
 * Regla: un pedido entra en la entrega que sigue al PRÓXIMO corte. Con corte
 * jueves 19:00 y entrega domingo, el sábado 14-nov entra al domingo 22; el
 * jueves 19-nov a las 19:01 entra al domingo 29. Después del corte nada se
 * bloquea: solo cambia la semana.
 */

const DESFASE_MS = 5 * 3_600_000; // UTC−5
const DIA_MS = 86_400_000;

export interface ReglaSemana {
  corteDia: number; // 0 = domingo
  corteHora: string; // 'HH:MM'
  entregaDia: number;
}

export interface EstadoSemana {
  /** Instante del próximo corte. */
  corte: Date;
  /** Fecha de entrega de los pedidos que se hacen ahora ('AAAA-MM-DD'). */
  entrega: string;
  /** true entre el corte y el fin del día de entrega de esa semana. */
  cerrado: boolean;
}

/** Fecha de calendario de Lima ('AAAA-MM-DD') de un instante. */
export function fechaLima(instante: Date): string {
  return new Date(instante.getTime() - DESFASE_MS).toISOString().slice(0, 10);
}

export function sumarDias(fecha: string, dias: number): string {
  const [y, m, d] = fecha.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d) + dias * DIA_MS).toISOString().slice(0, 10);
}

export function diaSemana(fecha: string): number {
  const [y, m, d] = fecha.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

/** Instante de las HH:MM de Lima en esa fecha. */
function instanteLima(fecha: string, hhmm: string): Date {
  const [y, m, d] = fecha.split('-').map(Number);
  const [hh, mm] = hhmm.split(':').map(Number);
  return new Date(Date.UTC(y, m - 1, d, hh, mm) + DESFASE_MS);
}

/** Días desde el corte hasta la entrega (1 a 7). */
function diasCorteAEntrega(r: ReglaSemana): number {
  return (r.entregaDia - r.corteDia + 7) % 7 || 7;
}

export function estadoSemana(ahora: Date, r: ReglaSemana): EstadoSemana {
  const hoy = fechaLima(ahora);
  const delta = (r.corteDia - diaSemana(hoy) + 7) % 7;
  let fechaCorte = sumarDias(hoy, delta);
  let corte = instanteLima(fechaCorte, r.corteHora);
  if (corte.getTime() <= ahora.getTime()) {
    fechaCorte = sumarDias(fechaCorte, 7);
    corte = instanteLima(fechaCorte, r.corteHora);
  }
  const salto = diasCorteAEntrega(r);
  const entrega = sumarDias(fechaCorte, salto);

  // ¿Estamos entre el corte anterior y el fin de su día de entrega?
  const corteAnterior = instanteLima(sumarDias(fechaCorte, -7), r.corteHora);
  const entregaAnterior = sumarDias(fechaCorte, salto - 7);
  const cerrado = ahora.getTime() >= corteAnterior.getTime() && hoy <= entregaAnterior;

  return { corte, entrega, cerrado };
}

/**
 * Semana que el panel muestra por defecto: la próxima entrega que todavía no
 * pasó (el mismo domingo de reparto sigue siendo "esta semana").
 */
export function semanaPanel(ahora: Date, entregaDia: number): string {
  const hoy = fechaLima(ahora);
  return sumarDias(hoy, (entregaDia - diaSemana(hoy) + 7) % 7);
}

/** Valida 'AAAA-MM-DD' y que caiga en el día de entrega. */
export function esSemanaValida(fecha: string | undefined, entregaDia: number): fecha is string {
  if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return false;
  const [y, m, d] = fecha.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d));
  return t.toISOString().slice(0, 10) === fecha && t.getUTCDay() === entregaDia;
}
