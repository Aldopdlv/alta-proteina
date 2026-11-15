import { Encabezado } from '@/componentes/Encabezado';
import { MenuCliente } from './MenuCliente';

export const metadata = { title: 'Menú de la semana' };

export default async function Menu({ searchParams }: { searchParams: Promise<{ hoja?: string }> }) {
  const { hoja } = await searchParams;
  return (
    <>
      <Encabezado />
      <MenuCliente hojaInicial={hoja ?? null} />
    </>
  );
}
