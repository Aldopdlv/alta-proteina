import { leerCatalogo } from '@/lib/catalogo';
import { DIAS } from '@/lib/formato';
import { Cabecera, Contenido } from '../Cabecera';
import { campoPanel, Fila, Interruptor, Seccion } from './Piezas';
import { guardarCalendario, guardarOpciones, guardarPagos, guardarProductos, guardarRendimiento, guardarZonas } from './acciones';

const soles = (c: number) => (c % 100 === 0 ? String(c / 100) : (c / 100).toFixed(2).replace('.', ','));

function SelectDia({ nombre, valor }: { nombre: string; valor: number }) {
  return (
    <select name={nombre} defaultValue={valor} className={`${campoPanel} w-[180px]`}>
      {DIAS.map((d, i) => (
        <option key={d} value={i}>
          {d.charAt(0).toUpperCase() + d.slice(1)}
        </option>
      ))}
    </select>
  );
}

export default async function Configuracion() {
  const { config: c, productos, marinados, salsas, zonas } = await leerCatalogo();
  const platos = productos.filter((p) => p.categoria !== 'packs');
  const prefijo = (t: string) => <span className="text-sm text-tinta-suave">{t}</span>;

  return (
    <Contenido>
      <Cabecera titulo="Configuración" ruta="/panel/configuracion" sinSemana />
      <p className="m-0 max-w-[70ch] text-sm text-tinta-suave">Todo lo que cambies aquí se aplica de inmediato en la web, sin desplegar.</p>
      <div className="max-w-[760px] rounded-2xl border border-solid border-borde">
        <Seccion titulo="Productos" primera accion={guardarProductos}>
          {productos.map((p) => (
            <div key={p.id} className="flex flex-col gap-2 border-b border-solid border-borde-tenue py-3">
              <input type="hidden" name="id" value={p.id} />
              <div className="flex flex-wrap items-center gap-2.5">
                <input name={`nombre_${p.id}`} defaultValue={p.nombre} aria-label="Nombre" className={`${campoPanel} flex-[1_1_200px] font-medium`} />
                <span className="flex items-center gap-1.5">
                  {prefijo('S/')}
                  <input name={`precio_${p.id}`} defaultValue={soles(p.precio)} inputMode="decimal" aria-label={`Precio de ${p.nombre}`} className={`${campoPanel} w-[90px]`} />
                </span>
                <Interruptor nombre={`activo_${p.id}`} inicial={p.activo} />
              </div>
              <input name={`descripcion_${p.id}`} defaultValue={p.descripcion} aria-label={`Descripción de ${p.nombre}`} className={`${campoPanel} w-full`} />
              <label className="flex flex-wrap items-center gap-2 text-[13px] text-tinta-suave">
                {p.imagen ? 'Foto cargada · cambiar:' : 'Foto (JPG, PNG o WebP, 4:3):'}
                <input type="file" name={`foto_${p.id}`} accept="image/jpeg,image/png,image/webp" className="text-[13px]" />
              </label>
            </div>
          ))}
        </Seccion>

        <Seccion titulo="Marinados y salsas" accion={guardarOpciones}>
          <h3 className="m-0 mt-1 font-titulo text-sm font-semibold text-oliva-oscuro">Marinados</h3>
          {marinados.map((m) => (
            <div key={m.id} className="flex flex-wrap items-center gap-2.5 border-b border-solid border-borde-tenue py-2">
              <input type="hidden" name="marinado" value={m.id} />
              <input name={`m_nombre_${m.id}`} defaultValue={m.nombre} aria-label="Nombre del marinado" className={`${campoPanel} flex-[1_1_160px]`} />
              <input name={`m_desc_${m.id}`} defaultValue={m.descripcion} aria-label="Descripción" className={`${campoPanel} flex-[2_1_220px]`} />
              <Interruptor nombre={`m_activo_${m.id}`} inicial={m.activo} />
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-2.5 py-2">
            <input name="m_nuevo" placeholder="Marinado nuevo (opcional)" className={`${campoPanel} flex-[1_1_160px]`} />
            <input name="m_nuevo_desc" placeholder="Descripción" className={`${campoPanel} flex-[2_1_220px]`} />
          </div>
          <h3 className="m-0 mt-3 font-titulo text-sm font-semibold text-oliva-oscuro">Salsas</h3>
          {salsas.map((s) => (
            <div key={s.id} className="flex flex-wrap items-center gap-2.5 border-b border-solid border-borde-tenue py-2">
              <input type="hidden" name="salsa" value={s.id} />
              <input name={`s_nombre_${s.id}`} defaultValue={s.nombre} aria-label="Nombre de la salsa" className={`${campoPanel} flex-[1_1_220px]`} />
              <Interruptor nombre={`s_activa_${s.id}`} inicial={s.activo} etiquetas={['Activa', 'Inactiva']} />
            </div>
          ))}
          <div className="py-2">
            <input name="s_nueva" placeholder="Salsa nueva (opcional)" className={`${campoPanel} w-full max-w-[320px]`} />
          </div>
          <Fila etiqueta="Salsa extra (precio)">
            {prefijo('S/')}
            <input name="precio_salsa_extra" defaultValue={soles(c.precioSalsaExtra)} inputMode="decimal" className={`${campoPanel} w-[90px]`} />
          </Fila>
        </Seccion>

        <Seccion titulo="Zonas y delivery" accion={guardarZonas}>
          {zonas.map((z) => (
            <div key={z.id} className="flex flex-wrap items-center gap-2.5 border-b border-solid border-borde-tenue py-2">
              <input type="hidden" name="zona" value={z.id} />
              <input name={`z_nombre_${z.id}`} defaultValue={z.nombre} aria-label="Zona" className={`${campoPanel} flex-[1_1_180px]`} />
              <span className="flex items-center gap-1.5">
                {prefijo('S/')}
                <input name={`z_costo_${z.id}`} defaultValue={soles(z.costo)} inputMode="decimal" aria-label={`Costo de delivery a ${z.nombre} (0 = gratis)`} className={`${campoPanel} w-[80px]`} />
              </span>
              <Interruptor nombre={`z_activa_${z.id}`} inicial={z.activa} etiquetas={['Activa', 'Inactiva']} />
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-2.5 py-2">
            <input name="z_nueva" placeholder="Zona nueva (opcional)" className={`${campoPanel} flex-[1_1_180px]`} />
            <span className="flex items-center gap-1.5">
              {prefijo('S/')}
              <input name="z_nueva_costo" defaultValue="0" inputMode="decimal" aria-label="Costo de la zona nueva" className={`${campoPanel} w-[80px]`} />
            </span>
          </div>
          <p className="m-0 text-xs text-tinta-suave">Costo 0 = envío gratis.</p>
        </Seccion>

        <Seccion titulo="Corte y día de entrega" accion={guardarCalendario}>
          <Fila etiqueta="Corte (día)">
            <SelectDia nombre="corte_dia" valor={c.corteDia} />
          </Fila>
          <Fila etiqueta="Corte (hora)">
            <input type="time" name="corte_hora" defaultValue={c.corteHora} className={`${campoPanel} w-[180px]`} />
          </Fila>
          <Fila etiqueta="Producción">
            <SelectDia nombre="cocina_dia" valor={c.cocinaDia} />
          </Fila>
          <Fila etiqueta="Entrega (día)">
            <SelectDia nombre="entrega_dia" valor={c.entregaDia} />
          </Fila>
          <Fila etiqueta="Ventana de entrega">
            <input type="time" name="entrega_desde" defaultValue={c.entregaDesde} aria-label="Desde" className={`${campoPanel} w-[120px]`} />
            {prefijo('a')}
            <input type="time" name="entrega_hasta" defaultValue={c.entregaHasta} aria-label="Hasta" className={`${campoPanel} w-[120px]`} />
          </Fila>
          <Fila etiqueta="Pedido mínimo">
            {prefijo('S/')}
            <input name="pedido_minimo" defaultValue={soles(c.pedidoMinimo)} inputMode="decimal" className={`${campoPanel} w-[90px]`} />
          </Fila>
        </Seccion>

        <Seccion titulo="Pagos (Yape y tarjeta)" accion={guardarPagos}>
          <Fila etiqueta="Número de Yape">
            {prefijo('+51')}
            <input name="yape_numero" defaultValue={c.yapeNumero} inputMode="numeric" className={`${campoPanel} w-[150px]`} />
          </Fila>
          <Fila etiqueta="Titular">
            <input name="yape_titular" defaultValue={c.yapeTitular} className={`${campoPanel} w-[220px]`} />
          </Fila>
          <Fila etiqueta="QR de Yape" nota={c.yapeQr ? 'Cargado. Sube otro para cambiarlo.' : 'Sin cargar: se muestra un recuadro.'}>
            <input type="file" name="yape_qr" accept="image/jpeg,image/png,image/webp" className="text-[13px]" />
          </Fila>
          <Fila etiqueta="WhatsApp de atención">
            <input name="whatsapp" defaultValue={c.whatsapp} inputMode="numeric" className={`${campoPanel} w-[150px]`} />
          </Fila>
          <Fila etiqueta="Instagram (enlace)">
            <input name="instagram_url" defaultValue={c.instagramUrl ?? ''} placeholder="https://instagram.com/…" className={`${campoPanel} w-[260px]`} />
          </Fila>
          <Fila etiqueta="Aceptar tarjeta">
            <Interruptor nombre="aceptar_tarjeta" inicial={c.aceptarTarjeta} etiquetas={['Sí', 'No']} />
          </Fila>
          <Fila etiqueta="Proveedor de link de pago" nota="Vacío = el link se envía a mano por WhatsApp.">
            <input name="proveedor_pago" defaultValue={c.proveedorPago ?? ''} placeholder="Por definir" className={`${campoPanel} w-[180px]`} />
          </Fila>
          <Fila etiqueta="Umbral del recargo">
            {prefijo('S/')}
            <input name="recargo_umbral" defaultValue={soles(c.recargoUmbral)} inputMode="decimal" className={`${campoPanel} w-[90px]`} />
          </Fila>
          <Fila etiqueta="Recargo bajo el umbral">
            <input name="recargo_bajo_pct" defaultValue={c.recargoBajoPct} inputMode="decimal" className={`${campoPanel} w-[70px]`} />
            {prefijo('%')}
          </Fila>
          <Fila etiqueta="Recargo desde el umbral">
            <input name="recargo_alto_pct" defaultValue={c.recargoAltoPct} inputMode="decimal" className={`${campoPanel} w-[70px]`} />
            {prefijo('%')}
          </Fila>
        </Seccion>

        <Seccion titulo="Rendimiento de cocción" accion={guardarRendimiento}>
          <Fila etiqueta="Pollo cocido por porción">
            <input name="pollo_cocido_g" defaultValue={platos[0]?.polloCocidoG ?? 150} inputMode="numeric" className={`${campoPanel} w-[80px]`} />
            {prefijo('g')}
          </Fila>
          <Fila etiqueta="Rendimiento" nota="Crudo = cocido ÷ rendimiento.">
            <input name="rendimiento" defaultValue={Math.round(c.rendimientoCoccion * 100)} inputMode="numeric" className={`${campoPanel} w-[80px]`} />
            {prefijo('%')}
          </Fila>
          <Fila etiqueta="Proteína estimada por porción">
            <input name="proteina_g" defaultValue={platos[0]?.proteinaG ?? 45} inputMode="numeric" className={`${campoPanel} w-[80px]`} />
            {prefijo('g')}
          </Fila>
          <Fila etiqueta="Mostrar «≈ g de proteína»">
            <Interruptor nombre="mostrar_proteina" inicial={c.mostrarProteina} etiquetas={['Sí', 'No']} />
          </Fila>
          <Fila etiqueta="Duración congelado">
            <input name="duracion_congelado_dias" defaultValue={c.duracionCongeladoDias} inputMode="numeric" className={`${campoPanel} w-[80px]`} />
            {prefijo('días')}
          </Fila>
        </Seccion>
      </div>
    </Contenido>
  );
}
