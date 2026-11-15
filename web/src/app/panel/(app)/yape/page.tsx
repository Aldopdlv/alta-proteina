import { consultar } from '@/lib/db';
import { leerConfig } from '@/lib/catalogo';
import { obtenerPedido, type Pedido } from '@/lib/pedidos';
import { aVista } from '@/lib/panel';
import { Cabecera, Contenido } from '../Cabecera';
import { ColaYape } from './ColaYape';

/**
 * Cola de capturas por revisar, la más antigua primero. Muestra TODAS las
 * semanas: una captura pendiente nunca debe quedar escondida tras el selector.
 */
export default async function Yape() {
  const [config, filas] = await Promise.all([
    leerConfig(),
    consultar<{ codigo: string }>(`select codigo from pedidos where estado = 'pendiente' and medio = 'yape' and captura is not null order by captura_en, creado_en`),
  ]);
  const pedidos = (await Promise.all(filas.map((f) => obtenerPedido(f.codigo)))).filter((p): p is Pedido => !!p);
  return (
    <Contenido>
      <Cabecera titulo="Yape" ruta="/panel/yape" sinSemana />
      <ColaYape pedidos={pedidos.map((p) => aVista(p, config))} titular={config.yapeTitular} />
    </Contenido>
  );
}
