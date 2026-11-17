/**
 * Logo de Alta Proteína: monograma «AP» con hoja-flecha (variante v4 elegida
 * el 17-nov-2026, docs/logo/). Redibujado en vector; los mismos trazos están
 * en public/marca/isotipo.svg (con anillo) y public/marca/favicon.svg
 * (versión simplificada para 16-32 px: círculo relleno, sin anillo).
 */

const OLIVA = '#5B6B2F';
const CREMA = '#F5EFE0';
const NARANJA = '#E8772E';

export function Isotipo({ tamano = 36, invertido = false }: { tamano?: number; invertido?: boolean }) {
  // fondo = color del círculo y del "aire" que separa letras y hoja; tinta = letras y anillo.
  const fondo = invertido ? OLIVA : CREMA;
  const tinta = invertido ? CREMA : OLIVA;
  return (
    <svg width={tamano} height={tamano} viewBox="0 0 200 200" aria-hidden="true" className="flex-none">
      <circle cx="100" cy="100" r="92" fill={fondo} stroke={tinta} strokeWidth="8" />
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M46 150 L77 52 L108 150" stroke={tinta} strokeWidth="24" />
        <path d="M124 150 V54 H139 a28 28 0 0 1 0 56 H124" stroke={fondo} strokeWidth="34" />
        <path d="M124 150 V54 H139 a28 28 0 0 1 0 56 H124" stroke={tinta} strokeWidth="24" />
      </g>
      <path
        d="M38 138 C 46 112, 70 100, 104 98 L 100 88 L 124 92 L 110 112 L 108 103 C 96 124, 70 134, 38 138 Z"
        fill={NARANJA}
        stroke={fondo}
        strokeWidth="6"
        strokeLinejoin="round"
        paintOrder="stroke"
      />
      <path d="M50 130 Q 76 114 104 104" fill="none" stroke={fondo} strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ invertido = false, tamano = 36, texto = 20 }: { invertido?: boolean; tamano?: number; texto?: number }) {
  return (
    <span className="flex items-center gap-2.5">
      <Isotipo tamano={tamano} invertido={invertido} />
      <span className="font-titulo font-bold" style={{ fontSize: texto, letterSpacing: '-0.4px', color: invertido ? CREMA : OLIVA }}>
        Alta Proteína
      </span>
    </span>
  );
}
