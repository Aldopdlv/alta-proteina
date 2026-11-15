/**
 * Textos de la web que dependen de la configuración (08-copy-textos-web.md,
 * con lunes→sábado y martes→domingo según la especificación). Puro.
 */

import { DIAS, diaCorto, diaLargo, enumerar, hora, mayuscula, ventana } from './formato';
import type { Config, Zona } from './tipos';
import type { EstadoSemana } from './semana';

export function textoBarraCorte(c: Config, s: EstadoSemana): string {
  if (s.cerrado) return `El menú de esta semana cerró · Lo que pidas ahora llega el ${diaCorto(s.entrega)}`;
  return `Pide hasta el ${DIAS[c.corteDia]} ${hora(c.corteHora)} · Recibes el ${diaCorto(s.entrega)}`;
}

/** Chip del menú (versión corta cuando está cerrado). */
export function textoChipCorte(c: Config, s: EstadoSemana): string {
  if (s.cerrado) return `Lo que pidas ahora llega el ${diaCorto(s.entrega)}`;
  return textoBarraCorte(c, s);
}

export function textoEntrega(c: Config, entrega: string): string {
  return `${diaLargo(entrega)}, entre ${ventana(c.entregaDesde, c.entregaHasta)}`;
}

export function zonasTexto(zonas: Zona[]): string {
  return enumerar(zonas.filter((z) => z.activa).map((z) => z.nombre));
}

export function envioGratis(zonas: Zona[]): boolean {
  return zonas.filter((z) => z.activa).every((z) => z.costo === 0);
}

export function preguntasFrecuentes(c: Config, zonas: Zona[]): [string, string][] {
  const corte = `${DIAS[c.corteDia]} a las ${hora(c.corteHora, false)}`;
  const recibe = `${DIAS[c.entregaDia]} entre ${ventana(c.entregaDesde, c.entregaHasta)}`;
  const gratis = envioGratis(zonas);
  const recargo = `La tarjeta tiene un recargo del ${c.recargoBajoPct} % en compras menores a S/ ${c.recargoUmbral / 100} y del ${c.recargoAltoPct} % desde S/ ${c.recargoUmbral / 100}, y lo ves antes de confirmar.`;
  return [
    ['¿Qué es exactamente lo que recibo?', 'Platos cocinados y congelados, en envases individuales con etiqueta. Cada uno lleva 150 g de pollo cocido más su acompañamiento. Las salsas van aparte, en envases pequeños.'],
    ['¿Cuándo tengo que pedir y cuándo me llega?', `Pides hasta el ${corte} y recibes el ${recibe} en tu dirección. Si pides después del corte, tu pedido entra en la semana siguiente.`],
    ['¿Cómo lo recaliento?', 'Microondas, tapado, 3 a 4 minutos. Los fideos quedan mejor con un chorrito de agua antes de calentar. También puedes descongelar en la refrigeradora la noche anterior.'],
    ['¿Cuánto dura congelado?', `Hasta ${c.duracionCongeladoDias} días en el congelador. Una vez descongelado, consúmelo el mismo día y no lo vuelvas a congelar.`],
    ['¿Cómo pago?', c.aceptarTarjeta
      ? `Con Yape (sin recargo) subiendo la captura de tu pago, o con tarjeta mediante un link de pago. ${recargo}`
      : 'Con Yape, subiendo la captura de tu pago. Sin recargo.'],
    ['¿Puedo cambiar o cancelar mi pedido?', `Sí, hasta la hora de corte del ${DIAS[c.corteDia]}, escribiéndonos por WhatsApp. Después de esa hora ya compramos y cocinamos para ti, así que no podemos cancelar.`],
    ['¿Llegan a mi zona?', `Por ahora repartimos en ${zonasTexto(zonas)}${gratis ? ', con envío gratis' : ', con un costo fijo por zona que ves al elegir tu dirección'}. Estamos sumando zonas: escríbenos y te avisamos.`],
    ['¿Quién cocina?', 'Un chef aliado, en una cocina autorizada, con recetas que diseñamos para que aguanten bien el congelado y recalentado.'],
  ];
}

export function terminos(c: Config): string[] {
  return [
    `Pedidos hasta el ${DIAS[c.corteDia]} ${hora(c.corteHora)}; después entran a la semana siguiente.`,
    `Entrega el ${DIAS[c.entregaDia]} en la ventana indicada; si no hay nadie, coordinamos por WhatsApp una segunda visita o recojo.`,
    'Cambios y cancelaciones hasta la hora de corte. Después del corte no hay reembolso porque ya compramos y cocinamos.',
    'Los pagos con Yape se confirman manualmente; el pedido se cocina solo si el pago está confirmado antes del corte.',
    'Mantén los productos congelados hasta su consumo; una vez descongelados, no volver a congelar.',
  ];
}

export const PASOS_PEDIDO = ['Pedido recibido', 'Pago confirmado', 'Cocinado y congelado', 'Entregado'];

/** Mensaje del estado en la página del pedido (copy §Confirmación). */
export function mensajeEstado(
  estado: string,
  medio: string,
  c: Config,
  entrega: string,
  motivo: string | null,
): string {
  switch (estado) {
    case 'pagado':
      return `Pago confirmado. Cocinamos tu pedido el ${DIAS[c.cocinaDia]} y lo recibes el ${diaCorto(entrega)}.`;
    case 'preparado':
      return `Tu pedido ya está cocinado y congelado. Sale el ${DIAS[c.entregaDia]}.`;
    case 'entregado':
      return `Entregado el ${diaCorto(entrega)}. ¡Buen provecho!`;
    case 'rechazado':
      return `No pudimos validar tu pago: ${motivo ? motivo.charAt(0).toLowerCase() + motivo.slice(1) : 'revisa tu captura'}. Vuelve a subir la captura o escríbenos.`;
    default:
      return medio === 'tarjeta'
        ? 'Te enviaremos el link de pago con tarjeta por WhatsApp. Tu pedido se confirma cuando completes el pago.'
        : 'Estamos revisando tu captura de Yape. Te confirmamos por WhatsApp en menos de 24 horas.';
  }
}

export const ETIQUETA_ESTADO: Record<string, { cliente: string; panel: string; fondo: string; color: string }> = {
  pendiente: { cliente: 'Pendiente de confirmación', panel: 'Pendiente de pago', fondo: '#FBF3DC', color: '#6E5108' },
  pagado: { cliente: 'Pagado', panel: 'Pagado', fondo: '#E6F0E8', color: '#3E7C4A' },
  preparado: { cliente: 'Preparado', panel: 'Preparado', fondo: '#EEF0E3', color: '#5B6B2F' },
  entregado: { cliente: 'Entregado', panel: 'Entregado', fondo: '#ECECEC', color: '#5F5F5F' },
  rechazado: { cliente: 'Rechazado', panel: 'Rechazado', fondo: '#F9E3E1', color: '#B3261E' },
};

export const MOTIVOS_RECHAZO = ['Monto distinto', 'Captura ilegible', 'No encontramos el pago', 'Otro'];

/** Plantillas de WhatsApp para que el panel avise al cliente (copy §Notificaciones). */
export function plantillasWhatsapp(p: { nombre: string; codigo: string; entrega: string; enlace: string; motivo?: string | null }, c: Config) {
  const nombre = p.nombre.split(' ')[0];
  return {
    pagado: `¡Hola ${nombre}! Confirmamos tu pago del pedido ${p.codigo}. Lo cocinamos el ${DIAS[c.cocinaDia]} y te llega el ${diaCorto(p.entrega)} entre ${ventana(c.entregaDesde, c.entregaHasta)}. Estado: ${p.enlace}`,
    rechazado: `Hola ${nombre}, no pudimos validar tu Yape del pedido ${p.codigo} (${p.motivo ?? 'revisa la captura'}). Puedes volver a subir la captura aquí: ${p.enlace}`,
    enCamino: `Hola ${nombre}, tu pedido ${p.codigo} sale hoy. Te avisamos al llegar.`,
    linkTarjeta: `Hola ${nombre}, aquí tienes el link de pago con tarjeta de tu pedido ${p.codigo}: `,
  };
}

export { mayuscula };
