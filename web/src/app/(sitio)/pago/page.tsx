'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { CLAVE_ENTREGA, leerEntrega, useTienda } from '@/lib/carrito';
import { totales } from '@/lib/calculos';
import { celularLegible, soles2 } from '@/lib/formato';
import { Encabezado } from '@/componentes/Encabezado';
import { Casilla } from '@/componentes/Piezas';
import { IconoAtras, IconoCandado, IconoImagen, IconoSubir } from '@/componentes/Iconos';
import { enviarPedido } from './acciones';
import type { DatosEntrega, Medio } from '@/lib/tipos';

const MAX = 5 * 1024 * 1024;
const ACEPTA = 'image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif';

export default function Pago() {
  const t = useTienda();
  const router = useRouter();
  const { config, zonas } = t.catalogo;
  const [entrega, setEntrega] = useState<DatosEntrega | null>(null);
  const [medio, setMedio] = useState<Medio>('yape');
  const [captura, setCaptura] = useState<File | null>(null);
  const [vista, setVista] = useState<string | null>(null);
  const [errorCaptura, setErrorCaptura] = useState<string | null>(null);
  const [confirmo, setConfirmo] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sinRed, setSinRed] = useState(false);
  const entrada = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const d = leerEntrega();
    if (!d || !d.nombre || !d.zonaId) router.replace('/entrega');
    else setEntrega(d as DatosEntrega);
  }, [router]);
  useEffect(() => {
    if (t.listo && (t.lineas.length === 0 || t.subtotal < config.pedidoMinimo) && !enviando) router.replace('/carrito');
  }, [t.listo, t.lineas.length, t.subtotal, config.pedidoMinimo, enviando, router]);
  useEffect(() => () => {
    if (vista) URL.revokeObjectURL(vista);
  }, [vista]);

  const zona = zonas.find((z) => z.id === entrega?.zonaId);
  const tYape = totales(t.subtotal, zona?.costo ?? 0, 'yape', config);
  const tTarjeta = totales(t.subtotal, zona?.costo ?? 0, 'tarjeta', config);
  const tot = medio === 'tarjeta' ? tTarjeta : tYape;
  const entregaTxt = zona ? (zona.costo === 0 ? 'Gratis' : soles2(zona.costo)) : '';

  const elegirArchivo = (f: File | undefined) => {
    setError(null);
    if (!f) return;
    const ext = f.name.split('.').pop()?.toLowerCase() ?? '';
    const valido = /^image\/(jpeg|png|webp|heic|heif)$/.test(f.type) || ['heic', 'heif', 'jpg', 'jpeg', 'png', 'webp'].includes(ext);
    if (!valido) return setErrorCaptura('Sube una imagen JPG, PNG o HEIC.');
    if (f.size > MAX) return setErrorCaptura(`La imagen pesa ${(f.size / 1048576).toFixed(1).replace('.', ',')} MB y el máximo son 5 MB.`);
    setErrorCaptura(null);
    if (vista) URL.revokeObjectURL(vista);
    setCaptura(f);
    setVista(/heic|heif/.test(f.type + ext) ? null : URL.createObjectURL(f));
  };

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(config.yapeNumero);
    } catch {
      /* sin portapapeles: el número está a la vista */
    }
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1600);
  };

  const enviar = async () => {
    if (!entrega || enviando) return;
    if (medio === 'yape' && (!captura || !confirmo)) return;
    setEnviando(true);
    setError(null);
    setSinRed(false);
    const form = new FormData();
    form.set('datos', JSON.stringify({ lineas: t.lineas.map((l) => l.linea), entrega, medio }));
    if (medio === 'yape' && captura) form.set('captura', captura);
    try {
      const r = await enviarPedido(form);
      if (!r.ok) {
        if (medio === 'yape' && /imagen|captura|MB/.test(r.error)) setErrorCaptura(r.error);
        else setError(r.error);
        if (r.campos) router.push('/entrega');
        setEnviando(false);
        return;
      }
      t.vaciar();
      try {
        sessionStorage.removeItem(CLAVE_ENTREGA);
      } catch {
        /* nada */
      }
      router.replace(`/pedido/${r.codigo}?t=${r.clave}&nuevo=1`);
    } catch {
      setSinRed(true);
      if (medio === 'yape') setErrorCaptura('subida');
      setEnviando(false);
    }
  };

  if (!entrega || !t.listo) return <Encabezado paso="Paso 2 de 2 · Pago" />;

  const puedeEnviar = !!captura && confirmo && !enviando;
  const tarjeta = (on: boolean) => `overflow-hidden rounded-2xl border-2 border-solid bg-white ${on ? 'border-oliva' : 'border-borde'}`;
  const radio = (on: boolean) => (
    <span className="box-border flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full border-2 border-solid border-oliva">
      <span className="h-[11px] w-[11px] rounded-full" style={{ background: on ? '#5B6B2F' : 'transparent' }} />
    </span>
  );

  return (
    <>
      <Encabezado paso="Paso 2 de 2 · Pago" />
      <main className="mx-auto box-border flex w-full max-w-[640px] flex-1 flex-col gap-4 px-4 pb-10 pt-5">
        <Link href="/entrega" className="-my-2 -ml-1 flex min-h-[44px] items-center gap-1.5 self-start px-1 font-titulo text-sm font-semibold leading-none text-oliva no-underline">
          <IconoAtras tamano={16} trazo={2} />
          Volver a entrega
        </Link>

        <div className="tarjeta flex flex-col gap-1.5 p-4 text-sm">
          <div className="flex justify-between">
            <span>Ítems</span>
            <span className="num">{soles2(tot.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery ({zona?.nombre})</span>
            <span className="num">{entregaTxt}</span>
          </div>
          {medio === 'tarjeta' && (
            <div className="flex justify-between font-medium text-naranja-oscuro">
              <span>Recargo por tarjeta ({tot.recargoPct} %)</span>
              <span className="num">{soles2(tot.recargo)}</span>
            </div>
          )}
          <div className="mt-1 flex items-baseline justify-between border-t border-solid border-borde pt-2.5">
            <span className="font-titulo text-base font-semibold">Total</span>
            <span className="num font-titulo text-2xl font-bold leading-none">{soles2(tot.total)}</span>
          </div>
        </div>

        <h1 className="h1 mt-2">¿Cómo quieres pagar?</h1>

        {error && (
          <div role="alert" className="rounded-xl bg-error-fondo px-3.5 py-3 text-sm font-medium text-error">
            {error}
          </div>
        )}

        <div role="radiogroup" aria-label="Medio de pago" className="flex flex-col gap-3">
          <div className={tarjeta(medio === 'yape')}>
            <button type="button" role="radio" aria-checked={medio === 'yape'} onClick={() => setMedio('yape')} className="flex min-h-[64px] w-full cursor-pointer items-center gap-3.5 border-0 bg-transparent px-4 py-3.5 text-left text-tinta">
              {radio(medio === 'yape')}
              <span className="flex flex-1 flex-col">
                <span className="font-titulo text-[17px] font-bold leading-[1.3]">Yape</span>
                <span className="text-sm font-medium text-exito">Sin recargo.</span>
              </span>
            </button>
            {medio === 'yape' && (
              <div className="flex flex-col gap-4 px-4 pb-[18px] pt-1">
                <div className="flex flex-wrap items-center gap-4 rounded-xl bg-crema p-4">
                  <div className="flex flex-[1_1_180px] flex-col gap-1.5">
                    <span className="text-sm text-tinta-suave">
                      Yapea exactamente <strong className="num font-titulo text-xl font-bold leading-none text-tinta">{soles2(tYape.total)}</strong> a:
                    </span>
                    <div className="flex items-center gap-2.5">
                      <span className="num font-titulo text-[26px] font-bold leading-[1.1] tracking-[0.02em]">{celularLegible(config.yapeNumero)}</span>
                      <button type="button" onClick={copiar} className="min-h-[40px] cursor-pointer rounded-[10px] border-[1.5px] border-solid border-oliva bg-white px-3 font-titulo text-sm font-semibold leading-none text-oliva">
                        {copiado ? 'Copiado' : 'Copiar'}
                      </button>
                    </div>
                    <span className="text-sm text-tinta-suave">Titular: {config.yapeTitular}</span>
                  </div>
                  <div role="img" aria-label="Código QR de Yape" className="flex h-[104px] w-[104px] flex-none items-center justify-center overflow-hidden rounded-[10px] border border-dashed border-borde-fuerte bg-white text-xs text-tinta-suave">
                    {config.yapeQr ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={`/fotos/${config.yapeQr}`} alt="" className="h-full w-full object-contain" />
                    ) : (
                      'QR'
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="font-titulo text-[15px] font-semibold leading-[1.3]">Sube la captura de tu pago</span>
                  <input ref={entrada} type="file" accept={ACEPTA} className="sr-only" tabIndex={-1} onChange={(e) => elegirArchivo(e.target.files?.[0])} />
                  {captura && !errorCaptura ? (
                    <div className="flex items-center gap-3 rounded-xl border border-solid border-borde p-2.5">
                      <div role="img" aria-label="Vista previa de la captura" className="flex h-[84px] w-14 flex-none items-center justify-center overflow-hidden rounded-lg bg-crema-oscura text-oliva">
                        {vista ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={vista} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <IconoImagen tamano={20} />
                        )}
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className="truncate text-sm font-medium">{captura.name}</span>
                        <span className="text-[13px] font-medium text-exito">Imagen lista · {(captura.size / 1048576).toFixed(1).replace('.', ',')} MB</span>
                      </div>
                      <button type="button" onClick={() => entrada.current?.click()} className="min-h-[44px] cursor-pointer border-0 bg-transparent px-2 text-sm text-tinta-suave underline">
                        Cambiar
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => entrada.current?.click()} className="flex min-h-[96px] cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-[1.5px] border-dashed border-oliva bg-oliva-claro text-oliva-oscuro">
                      <IconoSubir />
                      <span className="font-titulo text-[15px] font-semibold leading-[1.3]">Elegir imagen</span>
                      <span className="text-[13px] text-tinta-suave">JPG, PNG o HEIC, hasta 5 MB</span>
                    </button>
                  )}
                  {errorCaptura && (
                    <div role="alert" className="flex flex-col gap-2 rounded-xl bg-error-fondo px-3.5 py-3 text-sm font-medium text-error">
                      <span>
                        {errorCaptura === 'subida'
                          ? `No pudimos subir la imagen. Intenta de nuevo o envíala por WhatsApp al ${celularLegible(config.whatsapp)} con tu código de pedido.`
                          : errorCaptura}
                      </span>
                      <button
                        type="button"
                        onClick={() => (errorCaptura === 'subida' && captura ? (setErrorCaptura(null), enviar()) : entrada.current?.click())}
                        className="min-h-[40px] cursor-pointer self-start rounded-[10px] border-[1.5px] border-solid border-error bg-white px-3.5 font-titulo text-sm font-semibold leading-none text-error"
                      >
                        Intentar de nuevo
                      </button>
                    </div>
                  )}
                </div>

                <button type="button" role="checkbox" aria-checked={confirmo} onClick={() => setConfirmo(!confirmo)} className="flex min-h-[44px] cursor-pointer items-center gap-3 border-0 bg-transparent p-0 text-left text-[15px] text-tinta">
                  <Casilla marcada={confirmo} />
                  Confirmo que ya pagué este monto
                </button>
                <button type="button" onClick={enviar} disabled={!puedeEnviar} className="btn-cta">
                  {enviando ? 'Enviando…' : 'Enviar pedido'}
                </button>
              </div>
            )}
          </div>

          {config.aceptarTarjeta && (
            <div className={tarjeta(medio === 'tarjeta')}>
              <button type="button" role="radio" aria-checked={medio === 'tarjeta'} onClick={() => setMedio('tarjeta')} className="flex min-h-[64px] w-full cursor-pointer items-center gap-3.5 border-0 bg-transparent px-4 py-3.5 text-left text-tinta">
                {radio(medio === 'tarjeta')}
                <span className="flex flex-1 flex-col">
                  <span className="font-titulo text-[17px] font-bold leading-[1.3]">Tarjeta (link de pago)</span>
                  <span className="text-sm text-tinta-suave">
                    Recargo del {config.recargoBajoPct} % en compras menores a S/ {config.recargoUmbral / 100}; {config.recargoAltoPct} % desde S/ {config.recargoUmbral / 100}.
                  </span>
                </span>
              </button>
              {medio === 'tarjeta' && (
                <div className="flex flex-col gap-3 px-4 pb-[18px] pt-1">
                  <button type="button" onClick={enviar} disabled={enviando} className="btn-cta num">
                    {enviando ? 'Enviando…' : `Pagar ${soles2(tTarjeta.total)} con tarjeta`}
                  </button>
                  <p className="m-0 flex gap-2 text-[13px] text-tinta-suave">
                    <IconoCandado tamano={16} className="mt-0.5" />
                    {config.proveedorPago
                      ? 'Te llevaremos a una página segura para pagar. Al terminar, vuelves aquí con tu pedido confirmado.'
                      : 'Te enviamos el link de pago seguro por WhatsApp. Al pagar, confirmamos tu pedido.'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {sinRed && (
        <div role="alert" className="fixed inset-x-4 bottom-6 z-40 flex justify-center">
          <div className="flex w-full max-w-[440px] items-center justify-between gap-3 rounded-xl bg-tinta py-2.5 pl-4 pr-2.5 text-sm text-white shadow-toast">
            <span>No hay conexión. Tu carrito sigue guardado.</span>
            <button type="button" onClick={() => (setSinRed(false), setErrorCaptura(null), enviar())} className="min-h-[40px] flex-none cursor-pointer rounded-[10px] border-0 bg-crema px-3.5 font-titulo text-sm font-semibold leading-none text-tinta">
              Reintentar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
