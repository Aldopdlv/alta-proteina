import type { Metadata, Viewport } from 'next';
import './globals.css';

const indexable = process.env.SITIO_INDEXABLE === '1';

export const metadata: Metadata = {
  title: {
    default: 'Alta Proteína · Comida de verdad, sin complicarte',
    template: '%s · Alta Proteína',
  },
  description:
    'Platos con 150 g de pollo, listos en 4 minutos. Pides una vez a la semana y recibes todo congelado en tu puerta. Lima.',
  metadataBase: new URL(process.env.SITIO_URL ?? 'https://altaproteina.solvelab.digital'),
  openGraph: {
    locale: 'es_PE',
    siteName: 'Alta Proteína',
    type: 'website',
    images: [{ url: '/img/og.jpg', width: 1200, height: 630, alt: 'Platos de Alta Proteína con 150 g de pollo' }],
  },
  twitter: { card: 'summary_large_image', images: ['/img/og.jpg'] },
  // Hasta el lanzamiento, fuera de Google (SITIO_INDEXABLE=1 lo abre).
  robots: indexable ? undefined : { index: false, follow: false },
  icons: { icon: '/marca/isotipo.svg' },
};

export const viewport: Viewport = {
  themeColor: '#5B6B2F',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-PE">
      <body>{children}</body>
    </html>
  );
}
