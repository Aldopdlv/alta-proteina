import { requerirSesion } from '@/lib/sesion';
import { contarCola } from '@/lib/panel';
import { NavPanel } from './NavPanel';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Panel', robots: { index: false } };

/**
 * Panel interno (README §Panel): fondo blanco, oliva como color de acción,
 * naranja solo para contadores. Sidebar desde 760 px; barra inferior en móvil.
 */
export default async function LayoutPanel({ children }: { children: React.ReactNode }) {
  await requerirSesion();
  const cola = await contarCola();
  return (
    <div className="min-h-screen bg-white text-[15px] panel:flex">
      <NavPanel cola={cola} />
      <div className="min-w-0 flex-1 pb-[76px] panel:pb-0">{children}</div>
    </div>
  );
}
