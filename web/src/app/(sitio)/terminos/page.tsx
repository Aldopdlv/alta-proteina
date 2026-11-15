import Link from 'next/link';
import { Encabezado } from '@/componentes/Encabezado';
import { leerConfig } from '@/lib/catalogo';
import { enlaceWhatsapp } from '@/lib/formato';
import { terminos } from '@/lib/textos';

export const metadata = { title: 'Términos y entregas' };

export default async function Terminos() {
  const config = await leerConfig();
  return (
    <>
      <Encabezado sinCarrito />
      <main className="mx-auto box-border flex w-full max-w-[720px] flex-1 flex-col gap-5 px-4 pb-16 pt-8">
        <h1 className="h1">Términos y entregas</h1>
        <ol className="tarjeta m-0 list-none p-0">
          {terminos(config).map((texto, i) => (
            <li key={i} className={`flex gap-3.5 px-5 py-4 ${i ? 'border-t border-solid border-borde' : ''}`}>
              <span className="flex-none font-titulo text-lg font-bold leading-[1.4] text-oliva">{i + 1}</span>
              <span>{texto}</span>
            </li>
          ))}
        </ol>
        <div className="flex flex-wrap gap-2.5">
          <a href={enlaceWhatsapp(config.whatsapp)} className="btn-sec min-h-[48px] flex-[1_1_200px]">
            Escribir por WhatsApp
          </a>
          <Link href="/menu" className="btn-cta min-h-[48px] flex-[1_1_200px] text-[15px]">
            Ver el menú
          </Link>
        </div>
      </main>
    </>
  );
}
