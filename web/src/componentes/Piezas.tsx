'use client';

/**
 * Piezas unificadas del diseño: stepper, foto de producto (con placeholder de
 * proporción fija), chips de proteína y chip de estado.
 */

import { IlustracionPlato } from './Iconos';
import { ETIQUETA_ESTADO } from '@/lib/textos';

export function Stepper({
  valor,
  menos,
  mas,
  alto = 42,
  fondo = 'transparent',
  etiqueta,
  deshabilitarMenos = false,
  deshabilitarMas = false,
}: {
  valor: number;
  menos: () => void;
  mas: () => void;
  alto?: number;
  fondo?: string;
  etiqueta?: string;
  deshabilitarMenos?: boolean;
  deshabilitarMas?: boolean;
}) {
  const boton = 'w-11 cursor-pointer border-0 bg-transparent font-titulo text-xl font-semibold leading-none text-oliva disabled:cursor-not-allowed disabled:text-borde-apagado';
  return (
    <div className="flex items-center rounded-xl border-[1.5px] border-solid border-oliva" style={{ background: fondo }} aria-label={etiqueta}>
      <button type="button" aria-label="Quitar uno" onClick={menos} className={boton} style={{ height: alto }} disabled={deshabilitarMenos}>
        −
      </button>
      <span className="num min-w-[20px] text-center font-titulo text-base font-semibold leading-none" aria-live="polite">
        {valor}
      </span>
      <button type="button" aria-label="Agregar uno" onClick={mas} className={boton} style={{ height: alto }} disabled={deshabilitarMas}>
        +
      </button>
    </div>
  );
}

/** Foto 4:3 o placeholder con el ícono y el nombre (se reemplaza sin tocar el layout). */
export function FotoProducto({
  nombre,
  imagen,
  fondo = '#EDE5D2',
  children,
}: {
  nombre: string;
  imagen: string | null;
  fondo?: string;
  children?: React.ReactNode;
}) {
  return (
    <div role="img" aria-label={nombre} className="relative flex aspect-[4/3] flex-col items-center justify-center gap-2 overflow-hidden" style={{ background: fondo }}>
      {imagen ? (
        // eslint-disable-next-line @next/next/no-img-element -- fotos del volumen, ya optimizadas al subirlas
        <img src={`/fotos/${imagen}`} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <>
          <IlustracionPlato />
          <span className="text-xs font-medium text-oliva">{nombre}</span>
        </>
      )}
      {children}
    </div>
  );
}

export function ChipsProteina({ gramosPollo, proteina, mostrar }: { gramosPollo: number; proteina: number; mostrar: boolean }) {
  return (
    <div className="absolute left-3 top-3 flex flex-col items-start gap-1">
      <span className="rounded-full bg-oliva px-2.5 py-1 font-titulo text-xs font-semibold leading-[1.3] text-crema">{gramosPollo} g de pollo</span>
      {mostrar && (
        <span className="rounded-full bg-white px-2.5 py-[3px] text-xs font-medium leading-[1.3] text-oliva-oscuro">≈ {proteina} g de proteína</span>
      )}
    </div>
  );
}

export function ChipEstado({ estado, vista = 'cliente', grande = false }: { estado: string; vista?: 'cliente' | 'panel'; grande?: boolean }) {
  const e = ETIQUETA_ESTADO[estado] ?? ETIQUETA_ESTADO.pendiente;
  return (
    <span
      className={`inline-block rounded-full font-semibold leading-[1.3] ${grande ? 'px-3 py-[5px] text-[13px]' : 'px-2.5 py-[3px] text-xs'}`}
      style={{ background: e.fondo, color: e.color }}
    >
      {vista === 'panel' ? e.panel : e.cliente}
    </span>
  );
}

/** Casilla visual del diseño (cuadrada, oliva al marcar). */
export function Casilla({ marcada, tamano = 22 }: { marcada: boolean; tamano?: number }) {
  return (
    <span
      className="box-border flex flex-none items-center justify-center rounded-md border-2 border-solid"
      style={{ width: tamano, height: tamano, borderColor: marcada ? '#5B6B2F' : '#B9B2A0', background: marcada ? '#5B6B2F' : '#FFFFFF' }}
    >
      <svg width={tamano * 0.6} height={tamano * 0.6} viewBox="0 0 24 24" fill="none" stroke={marcada ? '#FFFFFF' : 'transparent'} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12l5 5 9-10" />
      </svg>
    </span>
  );
}

/** Radio visual del diseño. */
export function Radio({ marcado, tamano = 20 }: { marcado: boolean; tamano?: number }) {
  return (
    <span className="box-border flex flex-none items-center justify-center rounded-full border-2 border-solid border-oliva" style={{ width: tamano, height: tamano }}>
      <span className="rounded-full" style={{ width: tamano / 2, height: tamano / 2, background: marcado ? '#5B6B2F' : 'transparent' }} />
    </span>
  );
}
