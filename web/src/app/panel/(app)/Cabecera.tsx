import Link from 'next/link';
import { diaLargo } from '@/lib/formato';
import { sumarDias } from '@/lib/semana';

/** Título (escritorio) + selector de semana (‹ Semana del domingo 22 de noviembre ›). */
export function Cabecera({ titulo, ruta, semana, sinSemana = false, children }: { titulo: string; ruta: string; semana?: string; sinSemana?: boolean; children?: React.ReactNode }) {
  const flecha = 'flex h-10 w-10 items-center justify-center rounded-[10px] font-titulo text-lg font-semibold leading-none text-oliva no-underline hover:bg-white';
  return (
    <div className="no-imprimir flex flex-wrap items-center justify-between gap-3">
      <h1 className="h1 hidden panel:block">{titulo}</h1>
      {!sinSemana && semana && (
        <div className="flex items-center gap-1 rounded-xl bg-crema p-0.5">
          <Link href={`${ruta}?semana=${sumarDias(semana, -7)}`} aria-label="Semana anterior" className={flecha}>
            ‹
          </Link>
          <span className="px-1.5 text-center font-titulo text-sm font-semibold leading-[1.2]">Semana del {diaLargo(semana)}</span>
          <Link href={`${ruta}?semana=${sumarDias(semana, 7)}`} aria-label="Semana siguiente" className={flecha}>
            ›
          </Link>
        </div>
      )}
      {children}
    </div>
  );
}

export function Contenido({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto box-border flex max-w-[1080px] flex-col gap-5 px-4 pb-8 pt-4 panel:px-8 panel:pb-12 panel:pt-7">{children}</div>;
}
