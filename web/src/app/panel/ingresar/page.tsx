import { redirect } from 'next/navigation';
import { haySesion } from '@/lib/sesion';
import { FormularioIngreso } from './FormularioIngreso';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Panel', robots: { index: false } };

export default async function Ingresar() {
  if (await haySesion()) redirect('/panel');
  return (
    <div className="box-border flex min-h-screen items-center justify-center bg-crema px-4 py-6">
      <FormularioIngreso />
    </div>
  );
}
