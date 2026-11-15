import 'server-only';
import { cache } from 'react';
import { consultar, consultarUna } from './db';
import type { Catalogo, Config, Opcion, Producto, Zona } from './tipos';

/**
 * Catálogo y configuración desde la base: TODO lo de ESPECIFICACION.md §1 vive
 * aquí y se edita en /panel/configuracion sin desplegar.
 */

type Fila = Record<string, unknown>;

const hhmm = (t: unknown) => String(t).slice(0, 5);

function aConfig(f: Fila): Config {
  return {
    corteDia: Number(f.corte_dia),
    corteHora: hhmm(f.corte_hora),
    cocinaDia: Number(f.cocina_dia),
    entregaDia: Number(f.entrega_dia),
    entregaDesde: hhmm(f.entrega_desde),
    entregaHasta: hhmm(f.entrega_hasta),
    pedidoMinimo: Number(f.pedido_minimo),
    precioSalsaExtra: Number(f.precio_salsa_extra),
    recargoUmbral: Number(f.recargo_umbral),
    recargoBajoPct: Number(f.recargo_bajo_pct),
    recargoAltoPct: Number(f.recargo_alto_pct),
    aceptarTarjeta: Boolean(f.aceptar_tarjeta),
    proveedorPago: (f.proveedor_pago as string) || null,
    yapeNumero: String(f.yape_numero),
    yapeTitular: String(f.yape_titular),
    yapeQr: (f.yape_qr as string) || null,
    whatsapp: String(f.whatsapp),
    instagramUrl: (f.instagram_url as string) || null,
    rendimientoCoccion: Number(f.rendimiento_coccion),
    mostrarProteina: Boolean(f.mostrar_proteina),
    duracionCongeladoDias: Number(f.duracion_congelado_dias),
  };
}

function aProducto(f: Fila): Producto {
  return {
    id: String(f.id),
    nombre: String(f.nombre),
    descripcion: String(f.descripcion),
    categoria: f.categoria as Producto['categoria'],
    precio: Number(f.precio),
    polloCocidoG: Number(f.pollo_cocido_g),
    proteinaG: Number(f.proteina_g),
    recalentado: String(f.recalentado),
    packProductoId: (f.pack_producto_id as string) ?? null,
    packUnidades: f.pack_unidades == null ? null : Number(f.pack_unidades),
    imagen: (f.imagen as string) ?? null,
    activo: Boolean(f.activo),
    orden: Number(f.orden),
  };
}

export async function leerConfig(): Promise<Config> {
  const f = await consultarUna<Fila>('select * from config where id = 1');
  if (!f) throw new Error('Falta la fila de configuración (db/seed.sql).');
  return aConfig(f);
}

/** Catálogo completo (incluye inactivos: el panel los necesita; la web filtra). */
export const leerCatalogo = cache(async (): Promise<Catalogo> => {
  const [config, productos, marinados, salsas, zonas] = await Promise.all([
    leerConfig(),
    consultar<Fila>('select * from productos order by orden, nombre'),
    consultar<Fila>('select id, nombre, descripcion, activo, orden from marinados order by orden, nombre'),
    consultar<Fila>('select id, nombre, activa as activo, orden from salsas order by orden, nombre'),
    consultar<Fila>('select id, nombre, costo, activa, orden from zonas order by orden, nombre'),
  ]);
  return {
    config,
    productos: productos.map(aProducto),
    marinados: marinados.map((m) => ({ id: String(m.id), nombre: String(m.nombre), descripcion: String(m.descripcion), activo: Boolean(m.activo), orden: Number(m.orden) }) as Opcion),
    salsas: salsas.map((s) => ({ id: String(s.id), nombre: String(s.nombre), activo: Boolean(s.activo), orden: Number(s.orden) }) as Opcion),
    zonas: zonas.map((z) => ({ id: String(z.id), nombre: String(z.nombre), costo: Number(z.costo), activa: Boolean(z.activa), orden: Number(z.orden) }) as Zona),
  };
});

/** Lo que viaja al navegador: solo lo activo (y sin datos internos). */
export function catalogoPublico(c: Catalogo): Catalogo {
  return {
    config: c.config,
    productos: c.productos.filter((p) => p.activo || p.categoria !== 'packs'), // inactivos se ven como "Esta semana no"
    marinados: c.marinados.filter((m) => m.activo),
    salsas: c.salsas.filter((s) => s.activo),
    zonas: c.zonas.filter((z) => z.activa),
  };
}
