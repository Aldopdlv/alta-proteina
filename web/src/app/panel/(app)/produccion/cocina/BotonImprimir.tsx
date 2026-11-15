'use client';

export function BotonImprimir() {
  return (
    <button type="button" onClick={() => window.print()} className="btn-oliva min-h-[44px] px-[18px]">
      Imprimir / Guardar PDF
    </button>
  );
}
