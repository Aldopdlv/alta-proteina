/**
 * Íconos de línea (trazos de Lucide, 1,75 px) copiados del diseño, sin
 * dependencias.
 */

type P = { tamano?: number; className?: string; trazo?: number };

function Svg({ tamano = 24, className, trazo = 1.75, children }: P & { children: React.ReactNode }) {
  return (
    <svg
      width={tamano}
      height={tamano}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={trazo}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className ? `flex-none ${className}` : 'flex-none'}
    >
      {children}
    </svg>
  );
}

export const IconoBolsa = (p: P) => (
  <Svg {...p}>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </Svg>
);
export const IconoReloj = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Svg>
);
export const IconoCalendario = (p: P) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M16 3v4M8 3v4M3 10h18" />
  </Svg>
);
export const IconoOjo = (p: P) => (
  <Svg {...p}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </Svg>
);
export const IconoCopo = (p: P) => (
  <Svg {...p}>
    <path d="M12 2v20M2 12h20M5 5l14 14M19 5 5 19" />
    <path d="m9 3 3 3 3-3M9 21l3-3 3 3M3 9l3 3-3 3M21 9l-3 3 3 3" />
  </Svg>
);
export const IconoTemporizador = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="13" r="8" />
    <path d="M12 9v4l2 2M10 2h4" />
  </Svg>
);
export const IconoSubir = (p: P) => (
  <Svg {...p}>
    <path d="M12 16V4M7 9l5-5 5 5M4 20h16" />
  </Svg>
);
export const IconoImagen = (p: P) => (
  <Svg {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-5-5L5 21" />
  </Svg>
);
export const IconoCandado = (p: P) => (
  <Svg {...p}>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </Svg>
);
export const IconoCerrar = (p: P) => (
  <Svg {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Svg>
);
export const IconoCheck = (p: P) => (
  <Svg {...p}>
    <path d="M5 12l5 5 9-10" />
  </Svg>
);
export const IconoAtras = (p: P) => (
  <Svg {...p}>
    <path d="m15 18-6-6 6-6" />
  </Svg>
);
export const IconoLista = (p: P) => (
  <Svg {...p}>
    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
  </Svg>
);
export const IconoCelularCheck = (p: P) => (
  <Svg {...p}>
    <rect x="5" y="2" width="14" height="20" rx="2" />
    <path d="m9 12 2 2 4-4" />
  </Svg>
);
export const IconoOlla = (p: P) => (
  <Svg {...p}>
    <path d="M2 12h20M4 12v6a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-6M8 8V5M12 8V3M16 8V5" />
  </Svg>
);
export const IconoCamion = (p: P) => (
  <Svg {...p}>
    <path d="M3 6h11v10H3zM14 9h4l3 3v4h-7" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="17" cy="18" r="2" />
  </Svg>
);
export const IconoAjustes = (p: P) => (
  <Svg {...p}>
    <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12" />
    <circle cx="16" cy="6" r="2" />
    <circle cx="10" cy="12" r="2" />
    <circle cx="18" cy="18" r="2" />
  </Svg>
);

/** Plato (placeholder de foto de producto). */
export function IlustracionPlato({ ancho = 56, alto = 40, trazo = 1.75 }: { ancho?: number; alto?: number; trazo?: number }) {
  return (
    <svg width={ancho} height={alto} viewBox="0 0 56 40" fill="none" stroke="#5B6B2F" strokeWidth={trazo} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 18h48l-4 16a4 4 0 0 1-4 3H12a4 4 0 0 1-4-3Z" />
      <path d="M16 18c0-6 5-10 12-10s12 4 12 10" />
      <path d="M24 4c0 2 2 2 2 4M32 4c0 2 2 2 2 4" />
    </svg>
  );
}

export function IlustracionPack() {
  return (
    <svg width="96" height="40" viewBox="0 0 96 40" fill="none" stroke="#5B6B2F" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
      {[2, 15, 28, 41, 54, 67, 80].map((x) => (
        <rect key={x} x={x} y="10" width="10" height="26" rx="5" />
      ))}
    </svg>
  );
}
