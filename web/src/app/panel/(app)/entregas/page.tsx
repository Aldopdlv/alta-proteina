import { datosSemana, aVista } from '@/lib/panel';
import { diaLargo, hora, mayuscula, soles2 } from '@/lib/formato';
import { Cabecera, Contenido } from '../Cabecera';
import { ListaEntregas } from './ListaEntregas';

export default async function Entregas({ searchParams }: { searchParams: Promise<{ semana?: string }> }) {
  const { semana: param } = await searchParams;
  const { semana, config, pedidos } = await datosSemana(param);
  const visibles = pedidos.filter((p) => ['pagado', 'preparado', 'entregado'].includes(p.estado));

  // Agrupadas por zona y ordenadas por dirección.
  const zonas = new Map<string, ReturnType<typeof aVista>[]>();
  for (const p of [...visibles].sort((a, b) => a.direccion.localeCompare(b.direccion, 'es'))) {
    const v = aVista(p, config);
    zonas.set(v.zona, [...(zonas.get(v.zona) ?? []), v]);
  }

  const encabezado = `${mayuscula(diaLargo(semana))} · ${hora(config.entregaDesde, false)} a ${hora(config.entregaHasta, false)}`;
  const textoMotorizado = [
    `Entregas ${encabezado}`,
    ...[...zonas.entries()].flatMap(([zona, ps]) => [
      '',
      `${zona.toUpperCase()} (${ps.length})`,
      ...ps.map((p, i) =>
        [`${i + 1}. ${p.nombre} · ${p.celular}`, `   ${p.direccion}${p.referencia ? ` · ${p.referencia}` : ''}`, `   ${p.resumen} · ${p.codigo}${p.notas ? ` · Nota: ${p.notas}` : ''}`].join('\n'),
      ),
    ]),
  ].join('\n');

  return (
    <Contenido>
      <Cabecera titulo="Entregas" ruta="/panel/entregas" semana={semana} />
      <ListaEntregas
        encabezado={`${encabezado} · Agrupado por zona`}
        textoMotorizado={textoMotorizado}
        zonas={[...zonas.entries()].map(([zona, pedidos]) => ({ zona, pedidos: pedidos.map((p) => ({ ...p, totalTxt: soles2(p.total) })) }))}
      />
    </Contenido>
  );
}
