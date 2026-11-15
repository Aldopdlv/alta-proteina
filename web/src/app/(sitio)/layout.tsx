import { TiendaProvider } from '@/lib/carrito';
import { catalogoPublico, leerCatalogo } from '@/lib/catalogo';
import { estadoSemana } from '@/lib/semana';
import { textoBarraCorte } from '@/lib/textos';

export const dynamic = 'force-dynamic';

/** Barra de corte arriba de todo + el catálogo vigente para las piezas del navegador. */
export default async function LayoutSitio({ children }: { children: React.ReactNode }) {
  const catalogo = catalogoPublico(await leerCatalogo());
  const semana = estadoSemana(new Date(), catalogo.config);
  return (
    <TiendaProvider catalogo={catalogo} semana={{ entrega: semana.entrega, cerrado: semana.cerrado }}>
      <div className="flex min-h-screen flex-col">
        <div className="bg-oliva px-4 py-2 text-center text-sm font-medium leading-[1.4] text-crema [text-wrap:balance]">
          {textoBarraCorte(catalogo.config, semana)}
        </div>
        {children}
      </div>
    </TiendaProvider>
  );
}
