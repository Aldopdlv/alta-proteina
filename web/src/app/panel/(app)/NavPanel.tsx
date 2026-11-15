'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Isotipo } from '@/componentes/Logo';
import { IconoAjustes, IconoCamion, IconoCelularCheck, IconoLista, IconoOlla } from '@/componentes/Iconos';
import { salir } from '../acciones';

const NAV = [
  { href: '/panel', label: 'Pedidos', corto: 'Pedidos', Icono: IconoLista },
  { href: '/panel/yape', label: 'Yape', corto: 'Yape', Icono: IconoCelularCheck },
  { href: '/panel/produccion', label: 'Producción', corto: 'Producción', Icono: IconoOlla },
  { href: '/panel/entregas', label: 'Entregas', corto: 'Entregas', Icono: IconoCamion },
  { href: '/panel/configuracion', label: 'Configuración', corto: 'Ajustes', Icono: IconoAjustes },
];

export function tituloPanel(ruta: string): string {
  return NAV.find((n) => n.href === ruta)?.label ?? 'Panel';
}

export function NavPanel({ cola }: { cola: number }) {
  const ruta = usePathname();
  const semana = useSearchParams().get('semana');
  const sufijo = semana ? `?semana=${semana}` : '';
  const activo = (href: string) => (href === '/panel' ? ruta === '/panel' : ruta.startsWith(href));

  return (
    <>
      <aside className="no-imprimir sticky top-0 hidden h-screen w-[232px] flex-none flex-col gap-5 border-r border-solid border-borde bg-crema px-3 py-5 panel:flex">
        <div className="flex items-center gap-2.5 px-2">
          <Isotipo tamano={32} />
          <span className="flex flex-col leading-[1.1]">
            <span className="font-titulo text-[17px] font-bold tracking-[-0.3px] text-oliva">Alta Proteína</span>
            <span className="text-xs text-tinta-suave">Panel interno</span>
          </span>
        </div>
        <nav className="flex flex-col gap-0.5">
          {NAV.map(({ href, label, Icono }) => {
            const on = activo(href);
            return (
              <Link
                key={href}
                href={`${href}${sufijo}`}
                aria-current={on ? 'page' : undefined}
                className={`flex min-h-[44px] items-center gap-3 rounded-xl px-3 font-titulo text-[15px] font-semibold leading-none no-underline ${on ? 'bg-white text-oliva-oscuro' : 'text-tinta hover:bg-[rgba(255,255,255,0.5)] hover:text-tinta'}`}
              >
                <Icono tamano={22} />
                <span className="flex-1">{label}</span>
                {href === '/panel/yape' && cola > 0 && (
                  <span className="box-border h-[22px] min-w-[22px] rounded-full bg-naranja px-1.5 text-center font-titulo text-xs font-bold leading-[22px] text-tinta">{cola}</span>
                )}
              </Link>
            );
          })}
        </nav>
        <form action={salir} className="mt-auto">
          <button type="submit" className="min-h-[44px] cursor-pointer border-0 bg-transparent px-3 text-left text-sm font-medium text-tinta-suave">
            Salir
          </button>
        </form>
      </aside>

      <header className="no-imprimir flex h-14 items-center gap-2.5 border-b border-solid border-borde bg-crema px-4 panel:hidden">
        <Isotipo tamano={28} />
        <span className="flex-1 font-titulo text-[17px] font-bold">{tituloPanel(NAV.find((n) => activo(n.href))?.href ?? '')}</span>
        <form action={salir}>
          <button type="submit" className="min-h-[44px] cursor-pointer border-0 bg-transparent px-1 text-sm font-medium text-tinta-suave">
            Salir
          </button>
        </form>
      </header>

      <nav className="no-imprimir fixed inset-x-0 bottom-0 z-30 flex border-t border-solid border-borde bg-white px-1 pb-2 pt-1 panel:hidden">
        {NAV.map(({ href, corto, Icono }) => {
          const on = activo(href);
          return (
            <Link
              key={href}
              href={`${href}${sufijo}`}
              aria-current={on ? 'page' : undefined}
              className={`relative flex min-h-[52px] min-w-0 flex-1 flex-col items-center justify-center gap-[3px] no-underline ${on ? 'text-oliva-oscuro' : 'text-tinta-suave hover:text-tinta-suave'}`}
            >
              <Icono tamano={22} />
              <span className="font-titulo text-xs font-semibold leading-none">{corto}</span>
              {href === '/panel/yape' && cola > 0 && (
                <span className="absolute left-[calc(50%+6px)] top-1 box-border h-[18px] min-w-[18px] rounded-full bg-naranja px-1 text-center font-titulo text-[11px] font-bold leading-[18px] text-tinta">{cola}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
