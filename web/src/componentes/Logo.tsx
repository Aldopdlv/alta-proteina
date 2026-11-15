/**
 * Logo PROVISIONAL (wordmark de Claude Design). El definitivo llega esta
 * semana: se reemplaza solo aquí y en public/marca/isotipo.svg.
 */

export function Isotipo({ tamano = 36, invertido = false }: { tamano?: number; invertido?: boolean }) {
  const fondo = invertido ? '#F5EFE0' : '#5B6B2F';
  const hoja = invertido ? '#5B6B2F' : '#F5EFE0';
  return (
    <svg width={tamano} height={tamano} viewBox="0 0 104 104" aria-hidden="true" className="flex-none">
      <circle cx="52" cy="52" r="52" fill={fondo} />
      <path d="M54 20 C 36 28, 26 46, 30 72 C 52 70, 68 56, 72 30 C 66 25, 60 21, 54 20 Z" fill={hoja} />
      <path d="M31 71 L 56 42" stroke={fondo} strokeWidth="4" strokeLinecap="round" fill="none" />
      <circle cx="80" cy="24" r="9" fill="#E8772E" />
    </svg>
  );
}

export function Logo({ invertido = false, tamano = 36, texto = 20 }: { invertido?: boolean; tamano?: number; texto?: number }) {
  return (
    <span className="flex items-center gap-2.5">
      <Isotipo tamano={tamano} invertido={invertido} />
      <span
        className="font-titulo font-bold"
        style={{ fontSize: texto, letterSpacing: '-0.4px', color: invertido ? '#F5EFE0' : '#5B6B2F' }}
      >
        Alta Proteína
      </span>
    </span>
  );
}
