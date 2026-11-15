-- Alta Proteína — esquema (ESPECIFICACION.md §4).
-- Dinero en CÉNTIMOS (enteros): S/ 61,00 = 6100. Nunca float.
-- Días de la semana con la convención de JavaScript: 0 = domingo … 6 = sábado.

create table config (
  id                 int primary key default 1 check (id = 1),   -- una sola fila
  corte_dia          int not null default 4 check (corte_dia between 0 and 6),   -- jueves
  corte_hora         time not null default '19:00',
  cocina_dia         int not null default 6 check (cocina_dia between 0 and 6),  -- sábado
  entrega_dia        int not null default 0 check (entrega_dia between 0 and 6), -- domingo
  entrega_desde      time not null default '09:00',
  entrega_hasta      time not null default '15:00',
  pedido_minimo      int not null default 5000,
  precio_salsa_extra int not null default 200,
  recargo_umbral     int not null default 10000,
  recargo_bajo_pct   numeric(5,2) not null default 10,
  recargo_alto_pct   numeric(5,2) not null default 5,
  aceptar_tarjeta    boolean not null default true,
  proveedor_pago     text,                                       -- null = el link se manda a mano por WhatsApp
  yape_numero        text not null default '933980759',
  yape_titular       text not null default 'Alta Proteína',
  yape_qr            text,                                       -- archivo en /fotos
  whatsapp           text not null default '51933980759',
  instagram_url      text,
  rendimiento_coccion numeric(4,3) not null default 0.6 check (rendimiento_coccion > 0 and rendimiento_coccion <= 1),
  mostrar_proteina   boolean not null default true,
  duracion_congelado_dias int not null default 30,
  actualizado_en     timestamptz not null default now()
);

create table productos (
  id              text primary key,
  nombre          text not null,
  descripcion     text not null default '',
  categoria       text not null check (categoria in ('burritos-quesadillas', 'arroz-fideos', 'packs')),
  precio          int not null check (precio > 0),
  pollo_cocido_g  int not null default 150,
  proteina_g      int not null default 45,
  recalentado     text not null default 'Microondas tapado, 3 a 4 minutos.',
  pack_producto_id text references productos(id),               -- solo packs
  pack_unidades   int check (pack_unidades is null or pack_unidades > 0),
  imagen          text,                                          -- archivo en /fotos
  activo          boolean not null default true,
  orden           int not null default 0,
  check ((categoria = 'packs') = (pack_producto_id is not null and pack_unidades is not null))
);

create table marinados (
  id          text primary key,
  nombre      text not null,
  descripcion text not null default '',
  activo      boolean not null default true,
  orden       int not null default 0
);

create table salsas (
  id      text primary key,
  nombre  text not null,
  activa  boolean not null default true,
  orden   int not null default 0
);

create table zonas (
  id      text primary key,
  nombre  text not null,
  costo   int not null default 0 check (costo >= 0),
  activa  boolean not null default true,
  orden   int not null default 0
);

-- Correlativo mensual del código AP-AAMM-NNNN.
create table contador_codigos (
  periodo text primary key,   -- 'AAMM'
  ultimo  int not null
);

create table pedidos (
  id              bigserial primary key,
  codigo          text not null unique,
  clave           text not null,                   -- token corto del enlace público (?t=)
  creado_en       timestamptz not null default now(),
  semana_entrega  date not null,                   -- el día de entrega identifica la semana
  nombre          text not null,
  celular         text not null,                   -- +51XXXXXXXXX
  zona_id         text not null references zonas(id),
  zona_nombre     text not null,
  direccion       text not null,
  referencia      text,
  notas           text,
  subtotal        int not null,
  delivery        int not null,
  recargo         int not null default 0,
  recargo_pct     numeric(5,2) not null default 0,
  total           int not null,
  medio           text not null check (medio in ('yape', 'tarjeta')),
  estado          text not null default 'pendiente'
                    check (estado in ('pendiente', 'pagado', 'preparado', 'entregado', 'rechazado')),
  motivo_rechazo  text,
  captura         text,                            -- archivo privado (solo panel)
  captura_en      timestamptz,
  pago_ref        text,
  notas_internas  text,
  pagado_en       timestamptz,
  entregado_en    timestamptz,
  actualizado_en  timestamptz not null default now()
);
create index pedidos_semana on pedidos (semana_entrega, estado);

create table lineas_pedido (
  id               bigserial primary key,
  pedido_id        bigint not null references pedidos(id),
  producto_id      text not null references productos(id),
  producto_nombre  text not null,                  -- congelado al pedir
  es_pack          boolean not null default false,
  pack_unidades    int,
  base_nombre      text not null,                  -- el plato que se cocina (en packs, Burrito de pollo)
  pollo_cocido_g   int not null,
  cantidad         int not null check (cantidad > 0),
  precio_producto  int not null,
  precio_unitario  int not null,                   -- producto + salsas extra
  marinado_id      text,
  marinado_nombre  text,
  salsa_id         text,
  salsa_nombre     text,
  salsas_extra     jsonb not null default '[]',    -- [{id, nombre}]
  pack_modo        text check (pack_modo in ('mezcla', 'mix-casa')),
  pack_mezcla      jsonb                           -- [{id, nombre, n}], suma = pack_unidades
);
create index lineas_pedido_pedido on lineas_pedido (pedido_id);
