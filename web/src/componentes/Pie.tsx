import Link from 'next/link';
import { Logo } from './Logo';
import { enlaceWhatsapp } from '@/lib/formato';
import { envioGratis, zonasTexto } from '@/lib/textos';
import type { Config, Zona } from '@/lib/tipos';

export function Pie({ config, zonas }: { config: Config; zonas: Zona[] }) {
  const wa = enlaceWhatsapp(config.whatsapp);
  const enlace = 'flex min-h-[44px] items-center font-medium text-crema underline-offset-[3px] hover:text-white';
  return (
    <footer className="bg-oliva text-crema">
      <div className="contenedor flex flex-col gap-6 pb-8 pt-10">
        <div className="flex flex-wrap justify-between gap-6">
          <Logo invertido />
          <p className="m-0 max-w-[40ch] text-[15px]">
            Repartimos{envioGratis(zonas) ? ' gratis' : ''} en {zonasTexto(zonas)}. ¿Tu zona no está?{' '}
            <a href={wa} className="font-semibold text-white underline-offset-[3px] hover:text-white">
              Escríbenos.
            </a>
          </p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1">
          <a href={wa} className={enlace}>
            WhatsApp
          </a>
          {config.instagramUrl && (
            <a href={config.instagramUrl} className={enlace} rel="noopener">
              Instagram
            </a>
          )}
          <Link href="/terminos" className={enlace}>
            Términos y entregas
          </Link>
        </div>
        <div className="flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-solid border-[rgba(245,239,224,0.25)] pt-5 text-sm">
          <span>{config.aceptarTarjeta ? 'Pagas con Yape o tarjeta' : 'Pagas con Yape'}</span>
          <span>Alta Proteína · Lima, Perú</span>
        </div>
      </div>
    </footer>
  );
}
