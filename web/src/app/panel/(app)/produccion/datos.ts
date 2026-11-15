import 'server-only';
import { datosSemana } from '@/lib/panel';
import { resumirProduccion } from '@/lib/produccion';

/** Producción de la semana: solo pedidos pagados y preparados (ESPECIFICACION.md §6). */
export async function produccionSemana(param: string | undefined) {
  const { semana, config, pedidos } = await datosSemana(param);
  const cuentan = pedidos.filter((p) => p.estado === 'pagado' || p.estado === 'preparado');
  const resumen = resumirProduccion(cuentan.flatMap((p) => p.lineas), config.rendimientoCoccion);
  return { semana, config, resumen, pedidos: cuentan.length };
}
