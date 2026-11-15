'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { guardarEntrega, leerEntrega, useTienda } from '@/lib/carrito';
import { enlaceWhatsapp } from '@/lib/formato';
import { textoEntrega } from '@/lib/textos';
import { Encabezado } from '@/componentes/Encabezado';
import { ResumenEntrega } from '@/componentes/ResumenPedido';
import { IconoAtras, IconoCalendario } from '@/componentes/Iconos';
import type { DatosEntrega } from '@/lib/tipos';

type Errores = Partial<Record<'nombre' | 'celular' | 'zona' | 'direccion', string>>;
const VACIO: DatosEntrega = { nombre: '', celular: '', zonaId: '', direccion: '', referencia: '', notas: '' };

export default function Entrega() {
  const t = useTienda();
  const router = useRouter();
  const { config, zonas } = t.catalogo;
  const [d, setD] = useState<DatosEntrega>(VACIO);
  const [errores, setErrores] = useState<Errores>({});
  const refs = { nombre: useRef<HTMLInputElement>(null), celular: useRef<HTMLInputElement>(null), zona: useRef<HTMLSelectElement>(null), direccion: useRef<HTMLInputElement>(null) };

  useEffect(() => {
    const previo = leerEntrega();
    if (previo) setD({ ...VACIO, ...previo });
  }, []);

  // Sin carrito (o bajo el mínimo) no hay nada que entregar.
  useEffect(() => {
    if (t.listo && (t.lineas.length === 0 || t.subtotal < config.pedidoMinimo)) router.replace('/carrito');
  }, [t.listo, t.lineas.length, t.subtotal, config.pedidoMinimo, router]);

  const set = (k: keyof DatosEntrega) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const v = k === 'celular' ? e.target.value.replace(/\D/g, '').slice(0, 9) : e.target.value;
    setD((x) => ({ ...x, [k]: v }));
    if (Object.keys(errores).length) setErrores((x) => ({ ...x, [k === 'zonaId' ? 'zona' : k]: undefined }));
  };

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Errores = {};
    if (!d.nombre.trim()) err.nombre = 'Escribe tu nombre';
    if (d.celular.length !== 9) err.celular = 'El celular debe tener 9 dígitos';
    if (!zonas.some((z) => z.id === d.zonaId)) err.zona = 'Elige tu zona';
    if (!d.direccion.trim()) err.direccion = 'Escribe tu dirección';
    setErrores(err);
    const primero = (['nombre', 'celular', 'zona', 'direccion'] as const).find((k) => err[k]);
    if (primero) {
      refs[primero].current?.focus();
      return;
    }
    guardarEntrega(d);
    router.push('/pago');
  };

  const zonaOtra = d.zonaId === 'otra';
  return (
    <>
      <Encabezado paso="Paso 1 de 2 · Entrega" />
      <main className="contenedor flex flex-1 flex-col gap-5 pb-8 pt-5">
        <Link href="/carrito" className="-mb-3 -ml-1 -mt-2 flex min-h-[44px] items-center gap-1.5 self-start px-1 font-titulo text-sm font-semibold leading-none text-oliva no-underline">
          <IconoAtras tamano={16} trazo={2} />
          Volver al carrito
        </Link>
        <h1 className="h1">¿A dónde te lo llevamos?</h1>
        <ResumenEntrega zonaId={d.zonaId} variante="movil" />

        <div className="flex flex-wrap items-start gap-x-10 gap-y-5">
          <form onSubmit={enviar} noValidate className="flex min-w-0 flex-[3_1_420px] flex-col gap-[18px]">
            <label className="flex flex-col gap-1.5">
              <span className="etiqueta">Nombre y apellido</span>
              <input ref={refs.nombre} type="text" autoComplete="name" value={d.nombre} onChange={set('nombre')} aria-invalid={!!errores.nombre} aria-describedby="e-nombre" className="campo" />
              {errores.nombre && <span id="e-nombre" className="error-campo">{errores.nombre}</span>}
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="etiqueta">Celular (WhatsApp)</span>
              <div className={`flex h-12 overflow-hidden rounded-xl border-[1.5px] border-solid bg-white focus-within:border-oliva focus-within:shadow-[0_0_0_2px_#5B6B2F] ${errores.celular ? 'border-error' : 'border-borde'}`}>
                <span className="flex items-center border-r border-solid border-borde bg-crema px-3 font-medium text-tinta-suave">+51</span>
                <input ref={refs.celular} type="tel" inputMode="numeric" maxLength={9} autoComplete="tel-national" value={d.celular} onChange={set('celular')} aria-invalid={!!errores.celular} aria-describedby="e-celular" className="min-w-0 flex-1 border-0 px-3.5 tracking-[0.04em] text-tinta outline-none" />
              </div>
              {errores.celular && <span id="e-celular" className="error-campo">{errores.celular}</span>}
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="etiqueta">Zona</span>
              <select ref={refs.zona} value={d.zonaId} onChange={set('zonaId')} aria-invalid={!!errores.zona && !zonaOtra} aria-describedby="e-zona" className="campo">
                <option value="">Elige tu zona</option>
                {zonas.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.nombre} · {z.costo === 0 ? 'Envío gratis' : `S/ ${z.costo / 100}`}
                  </option>
                ))}
                <option value="otra">Mi zona no está en la lista</option>
              </select>
              {errores.zona && !zonaOtra && <span id="e-zona" className="error-campo">{errores.zona}</span>}
              {zonaOtra && (
                <div className="mt-1 flex flex-col gap-1.5 rounded-xl bg-oliva-claro px-3.5 py-3 text-sm text-tinta">
                  <span>Todavía no llegamos a tu zona. Escríbenos por WhatsApp y te avisamos cuando lleguemos.</span>
                  <a href={enlaceWhatsapp(config.whatsapp, 'Hola, ¿llegan a mi zona? Vivo en ')} className="font-semibold text-oliva-oscuro">
                    Escribir por WhatsApp
                  </a>
                </div>
              )}
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="etiqueta">Dirección</span>
              <input ref={refs.direccion} type="text" autoComplete="street-address" value={d.direccion} onChange={set('direccion')} aria-invalid={!!errores.direccion} aria-describedby="e-direccion" className="campo" />
              {errores.direccion && <span id="e-direccion" className="error-campo">{errores.direccion}</span>}
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="etiqueta">Referencia (opcional)</span>
              <input type="text" placeholder="Edificio verde, dpto. 302" value={d.referencia} onChange={set('referencia')} className="campo" />
            </label>
            <div className="flex items-start gap-3 rounded-xl bg-oliva-claro px-4 py-3.5">
              <IconoCalendario tamano={22} className="mt-px text-oliva" />
              <div className="flex flex-col gap-0.5">
                <span className="font-titulo text-sm font-semibold leading-[1.3] text-oliva-oscuro">Día de entrega</span>
                <span className="text-[15px]">Recibes el {textoEntrega(config, t.semana.entrega)}</span>
              </div>
            </div>
            <label className="flex flex-col gap-1.5">
              <span className="etiqueta">Notas para la entrega (opcional)</span>
              <textarea rows={3} value={d.notas} onChange={set('notas')} className="campo h-auto resize-y py-3" />
            </label>
            <button type="submit" className="btn-cta">
              Continuar al pago
            </button>
          </form>
          <ResumenEntrega zonaId={d.zonaId} variante="lateral" />
        </div>
      </main>
    </>
  );
}
