import type { Config } from 'tailwindcss';

/**
 * Tokens de Alta Proteína (design_handoff_alta_proteina_mvp/ESPECIFICACION.md §10).
 *
 * Contraste: el naranja es SOLO fondo de botón principal y contadores, siempre
 * con texto oscuro (#2B2B2B, 4,8:1). Blanco sobre naranja no pasa (2,9:1).
 * Si un texto tiene que ser naranja, va en `naranja-oscuro`.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        crema: { DEFAULT: '#F5EFE0', oscura: '#EDE5D2', suave: '#F2ECDD', fila: '#FBF8F1' },
        oliva: { DEFAULT: '#5B6B2F', oscuro: '#4A5826', claro: '#EEF0E3', borde: '#D9DEC4', foto: '#E3E7D2' },
        naranja: { DEFAULT: '#E8772E', hover: '#DC6E28', oscuro: '#A84E17' },
        tinta: { DEFAULT: '#2B2B2B', suave: '#5F5F5F' },
        borde: { DEFAULT: '#E3DCCB', fuerte: '#B9B2A0', linea: '#D6CFBD', tenue: '#F0EBDF', apagado: '#C9C2B0' },
        exito: { DEFAULT: '#3E7C4A', fondo: '#E6F0E8', hover: '#336840' },
        aviso: { DEFAULT: '#6E5108', fondo: '#FBF3DC' },
        error: { DEFAULT: '#B3261E', fondo: '#F9E3E1' },
        neutro: { DEFAULT: '#6B6B6B', fondo: '#ECECEC' },
      },
      fontFamily: {
        titulo: ['"DM Sans"', 'sans-serif'],
        texto: ['Inter', '"Segoe UI"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        tarjeta: '0 2px 8px rgba(43,43,43,0.08)',
        hoja: '0 -8px 24px rgba(43,43,43,0.12)',
        lateral: '-8px 0 24px rgba(43,43,43,0.12)',
        toast: '0 8px 24px rgba(43,43,43,0.25)',
      },
      screens: {
        // La hoja de personalización pasa a modal desde 720 px; el panel, a sidebar desde 760 px.
        hoja: '720px',
        panel: '760px',
      },
    },
  },
  plugins: [],
};

export default config;
