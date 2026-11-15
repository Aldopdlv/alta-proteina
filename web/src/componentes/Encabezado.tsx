'use client';

import Link from 'next/link';
import { Logo } from './Logo';
import { IconoBolsa } from './Iconos';
import { useTienda } from '@/lib/carrito';

/**
 * Header de 64 px (README §Layout global). Sin menú hamburguesa: la web es un
 * embudo, los únicos destinos son Menú y Carrito. En el checkout muestra el
 * paso en lugar de la navegación.
 */
export function Encabezado({ paso, sinCarrito = false }: { paso?: string; sinCarrito?: boolean }) {
  const { cantidad, listo } = useTienda();
  return (
    <header className="border-b border-solid border-borde bg-crema">
      <div className="contenedor flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="Alta Proteína, inicio" className="no-underline">
          <Logo />
        </Link>
        {paso ? (
          <span className="text-[13px] font-medium text-tinta-suave">{paso}</span>
        ) : (
          <nav className="flex items-center gap-2">
            <Link
              href="/menu"
              className="flex min-h-[44px] items-center rounded-xl px-3 font-titulo text-base font-semibold text-oliva no-underline hover:bg-oliva-claro"
            >
              Menú
            </Link>
            {!sinCarrito && (
              <Link
                href="/carrito"
                aria-label={`Carrito, ${cantidad} ítems`}
                className="relative flex h-11 w-11 items-center justify-center rounded-xl text-oliva hover:bg-oliva-claro"
              >
                <IconoBolsa />
                {listo && cantidad > 0 && (
                  <span className="num absolute right-0.5 top-1 box-border h-5 min-w-[20px] rounded-full bg-naranja px-[5px] text-center font-titulo text-xs font-semibold leading-5 text-tinta">
                    {cantidad}
                  </span>
                )}
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
