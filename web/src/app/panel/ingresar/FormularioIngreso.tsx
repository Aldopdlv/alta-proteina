'use client';

import { useActionState } from 'react';
import { Isotipo } from '@/componentes/Logo';
import { ingresar } from '../acciones';

export function FormularioIngreso() {
  const [error, accion, enviando] = useActionState(ingresar, null);
  return (
    <form action={accion} className="box-border flex w-full max-w-[380px] flex-col gap-[18px] rounded-3xl border border-solid border-borde bg-white px-6 py-8">
      <Isotipo tamano={48} />
      <h1 className="m-0 font-titulo text-2xl font-bold leading-[1.2] tracking-[-0.02em]">Panel de Alta Proteína</h1>
      <label className="flex flex-col gap-1.5">
        <span className="etiqueta">Contraseña</span>
        <input name="clave" type="password" autoComplete="current-password" required autoFocus aria-invalid={!!error} aria-describedby="e-clave" className="campo" />
        {error && (
          <span id="e-clave" role="alert" className="error-campo">
            {error}
          </span>
        )}
      </label>
      <button type="submit" disabled={enviando} className="btn-oliva min-h-[50px] text-base disabled:opacity-60">
        {enviando ? 'Ingresando…' : 'Ingresar'}
      </button>
    </form>
  );
}
