'use client';

import { useState } from 'react';

/** Acordeón de preguntas frecuentes: la primera abierta por defecto. */
export function Preguntas({ preguntas }: { preguntas: [string, string][] }) {
  const [abierta, setAbierta] = useState(0);
  return (
    <div className="tarjeta min-w-0 flex-[3_1_480px]">
      {preguntas.map(([q, a], i) => {
        const open = abierta === i;
        return (
          <div key={q} className={i ? 'border-t border-solid border-borde' : ''}>
            <button
              type="button"
              onClick={() => setAbierta(open ? -1 : i)}
              aria-expanded={open}
              aria-controls={`faq-${i}`}
              className="flex min-h-[56px] w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent px-5 py-3.5 text-left font-titulo text-base font-semibold leading-[1.35] text-tinta"
            >
              <span>{q}</span>
              <span aria-hidden="true" className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-oliva-claro font-titulo text-lg font-medium leading-none text-oliva">
                {open ? '−' : '+'}
              </span>
            </button>
            {open && (
              <p id={`faq-${i}`} className="m-0 max-w-[62ch] px-5 pb-[18px] text-[15px] text-tinta-suave [text-wrap:pretty]">
                {a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
