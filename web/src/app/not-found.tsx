import Link from 'next/link';
import { Logo } from '@/componentes/Logo';

export default function NoEncontrado() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[520px] flex-col items-start justify-center gap-4 px-4">
      <Logo />
      <h1 className="h1">No encontramos esta página</h1>
      <p className="m-0 text-tinta-suave">Puede que el enlace esté incompleto. El menú de la semana te espera.</p>
      <Link href="/menu" className="btn-cta min-h-[48px]">
        Ver el menú
      </Link>
    </main>
  );
}
