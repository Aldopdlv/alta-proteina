/**
 * Tipos compartidos entre servidor y navegador. Dinero siempre en céntimos.
 */

export type Categoria = 'burritos-quesadillas' | 'arroz-fideos' | 'packs';
export type Estado = 'pendiente' | 'pagado' | 'preparado' | 'entregado' | 'rechazado';
export type Medio = 'yape' | 'tarjeta';
export type PackModo = 'mezcla' | 'mix-casa';

export interface Config {
  corteDia: number; // 0 = domingo … 6 = sábado
  corteHora: string; // 'HH:MM'
  cocinaDia: number;
  entregaDia: number;
  entregaDesde: string;
  entregaHasta: string;
  pedidoMinimo: number;
  precioSalsaExtra: number;
  recargoUmbral: number;
  recargoBajoPct: number;
  recargoAltoPct: number;
  aceptarTarjeta: boolean;
  proveedorPago: string | null;
  yapeNumero: string;
  yapeTitular: string;
  yapeQr: string | null;
  whatsapp: string;
  instagramUrl: string | null;
  rendimientoCoccion: number;
  mostrarProteina: boolean;
  duracionCongeladoDias: number;
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: Categoria;
  precio: number;
  polloCocidoG: number;
  proteinaG: number;
  recalentado: string;
  packProductoId: string | null;
  packUnidades: number | null;
  imagen: string | null;
  activo: boolean;
  orden: number;
}

export interface Opcion {
  id: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  orden: number;
}

export interface Zona {
  id: string;
  nombre: string;
  costo: number;
  activa: boolean;
  orden: number;
}

/** Todo lo que la web pública necesita para pintar y calcular. */
export interface Catalogo {
  config: Config;
  productos: Producto[];
  marinados: Opcion[];
  salsas: Opcion[];
  zonas: Zona[];
}

/** Línea del carrito tal como vive en el navegador (localStorage). */
export interface LineaCarrito {
  key: string;
  productoId: string;
  cantidad: number;
  marinadoId?: string;
  salsaId?: string;
  extras: string[];
  packModo?: PackModo;
  /** Mezcla del pack: id de marinado → unidades. */
  mezcla?: Record<string, number>;
}

export interface DatosEntrega {
  nombre: string;
  celular: string; // 9 dígitos
  zonaId: string;
  direccion: string;
  referencia: string;
  notas: string;
}
