'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { resubirCaptura } from '../../pago/acciones';

export function BotonesPedido({ whatsapp }: { whatsapp: string }) {
  const [copiado, setCopiado] = useState(false);
  const guardar = async () => {
    // El enlace sin "&nuevo=1": el que el cliente guarda para volver.
    const url = new URL(location.href);
    url.searchParams.delete('nuevo');
    try {
      if (navigator.share && /Android|iPhone|iPad/i.test(navigator.userAgent)) {
        await navigator.share({ title: 'Mi pedido de Alta Proteína', url: url.toString() });
        return;
      }
      await navigator.clipboard.writeText(url.toString());
    } catch {
      /* el usuario canceló o no hay portapapeles */
    }
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1800);
  };
  return (
    <div className="flex flex-wrap gap-2.5">
      <button type="button" onClick={guardar} className="btn-sec min-h-[48px] flex-[1_1_180px]">
        {copiado ? 'Enlace copiado' : 'Guardar enlace'}
      </button>
      <a href={whatsapp} className="btn-oliva flex-[1_1_180px]">
        Escribir por WhatsApp
      </a>
    </div>
  );
}

export function ResubirCaptura({ codigo, clave }: { codigo: string; clave: string }) {
  const router = useRouter();
  const entrada = useRef<HTMLInputElement>(null);
  const [estado, setEstado] = useState<'inicial' | 'enviando' | 'error'>('inicial');
  const [error, setError] = useState('');

  const subir = async (f: File | undefined) => {
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      setEstado('error');
      setError('La imagen pesa más de 5 MB.');
      return;
    }
    setEstado('enviando');
    const form = new FormData();
    form.set('codigo', codigo);
    form.set('clave', clave);
    form.set('captura', f);
    try {
      const r = await resubirCaptura(form);
      if (!r.ok) {
        setEstado('error');
        setError(r.error ?? 'No pudimos subir la imagen.');
        return;
      }
      router.refresh();
    } catch {
      setEstado('error');
      setError('No pudimos subir la imagen. Revisa tu conexión e intenta de nuevo.');
    }
  };

  return (
    <div className="mt-1 flex flex-col gap-2">
      <input ref={entrada} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif" className="sr-only" tabIndex={-1} onChange={(e) => subir(e.target.files?.[0])} />
      <button type="button" onClick={() => entrada.current?.click()} disabled={estado === 'enviando'} className="btn-cta min-h-[48px] self-start px-5 text-[15px]">
        {estado === 'enviando' ? 'Subiendo…' : 'Volver a subir captura'}
      </button>
      {estado === 'error' && (
        <p role="alert" className="m-0 rounded-xl bg-error-fondo px-3.5 py-2.5 text-sm font-medium text-error">
          {error}
        </p>
      )}
    </div>
  );
}
