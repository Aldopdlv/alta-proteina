import { datosSemana, aVista } from '@/lib/panel';
import { soles2 } from '@/lib/formato';
import { Cabecera, Contenido } from './Cabecera';
import { ListaPedidos } from './ListaPedidos';

export default async function Pedidos({ searchParams }: { searchParams: Promise<{ semana?: string; pedido?: string }> }) {
  const { semana: param, pedido } = await searchParams;
  const { semana, config, pedidos } = await datosSemana(param);
  const vistas = pedidos.map((p) => aVista(p, config));
  const pagados = pedidos.filter((p) => ['pagado', 'preparado', 'entregado'].includes(p.estado));
  const porConfirmar = pedidos.filter((p) => p.estado === 'pendiente').length;
  const fichas: [string, string | number, boolean][] = [
    ['Pedidos', pedidos.length, false],
    ['Por confirmar', porConfirmar, porConfirmar > 0],
    ['Pagados', pagados.length, false],
    ['Venta de la semana', soles2(pagados.reduce((s, p) => s + p.total, 0)), false],
  ];

  return (
    <Contenido>
      <Cabecera titulo="Pedidos" ruta="/panel" semana={semana} />
      <div className="grid gap-2.5 [grid-template-columns:repeat(auto-fit,minmax(150px,1fr))]">
        {fichas.map(([label, valor, alerta]) => (
          <div key={label} className="flex flex-col gap-1 rounded-2xl border border-solid border-borde px-4 py-3.5">
            <span className="text-[13px] font-medium text-tinta-suave">{label}</span>
            <div className="flex items-center gap-2">
              <span className="num font-titulo text-2xl font-bold leading-[1.1]">{valor}</span>
              {alerta && <span className="h-2.5 w-2.5 rounded-full bg-naranja" aria-label="Hay pagos por confirmar" />}
            </div>
          </div>
        ))}
      </div>
      <ListaPedidos pedidos={vistas} abierto={pedido ?? null} />
    </Contenido>
  );
}
