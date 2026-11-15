import { test } from 'node:test';
import assert from 'node:assert/strict';
import { estadoSemana, semanaPanel, esSemanaValida, fechaLima } from '../src/lib/semana';
import { resolverLinea, totales, ahorroPack, opcionesPorDefecto } from '../src/lib/calculos';
import { resumirProduccion, MIX_CASA, SALSA_COCINA } from '../src/lib/produccion';
import { soles, soles2, hora, diaCorto, diaLargo, kilos, ventana, momentoCorto } from '../src/lib/formato';
import type { Catalogo, Config } from '../src/lib/tipos';

// Instante de Lima (UTC−5) para escribir los casos como se leen.
const lima = (iso: string) => new Date(`${iso}-05:00`);
const regla = { corteDia: 4, corteHora: '19:00', entregaDia: 0 };

test('semana: sábado 14-nov entra al domingo 22 (ejemplo de la especificación)', () => {
  const e = estadoSemana(lima('2026-11-14T10:00:00'), regla);
  assert.equal(e.entrega, '2026-11-22');
  assert.equal(e.corte.toISOString(), '2026-11-20T00:00:00.000Z'); // jue 19 19:00 Lima
});

test('semana: jueves 19:00 en punto ya es después del corte; 18:59 todavía no', () => {
  assert.equal(estadoSemana(lima('2026-11-19T18:59:00'), regla).entrega, '2026-11-22');
  assert.equal(estadoSemana(lima('2026-11-19T19:00:00'), regla).entrega, '2026-11-29');
});

test('semana: criterio 3 — jueves 19:01 queda en el domingo de la semana siguiente', () => {
  const e = estadoSemana(lima('2026-11-19T19:01:00'), regla);
  assert.equal(e.entrega, '2026-11-29');
  assert.equal(e.cerrado, true);
});

test('semana: viernes 20 → domingo 29; lunes 23 vuelve a estar abierto', () => {
  assert.equal(estadoSemana(lima('2026-11-20T09:00:00'), regla).entrega, '2026-11-29');
  const lunes = estadoSemana(lima('2026-11-23T08:00:00'), regla);
  assert.equal(lunes.entrega, '2026-11-29');
  assert.equal(lunes.cerrado, false);
});

test('semana: el domingo de reparto el menú sigue "cerrado" y el panel muestra ese domingo', () => {
  const ahora = lima('2026-11-22T11:00:00');
  assert.equal(estadoSemana(ahora, regla).cerrado, true);
  assert.equal(semanaPanel(ahora, 0), '2026-11-22');
  assert.equal(semanaPanel(lima('2026-11-23T08:00:00'), 0), '2026-11-29');
});

test('semana: la medianoche de Lima no se confunde con la de UTC', () => {
  // 23:30 del miércoles en Lima ya es jueves en UTC.
  assert.equal(fechaLima(lima('2026-11-18T23:30:00')), '2026-11-18');
  assert.equal(estadoSemana(lima('2026-11-18T23:30:00'), regla).entrega, '2026-11-22');
});

test('semana: validación de la semana del panel', () => {
  assert.equal(esSemanaValida('2026-11-22', 0), true);
  assert.equal(esSemanaValida('2026-11-21', 0), false);
  assert.equal(esSemanaValida('2026-02-30', 1), false);
  assert.equal(esSemanaValida(undefined, 0), false);
});

const config: Config = {
  corteDia: 4, corteHora: '19:00', cocinaDia: 6, entregaDia: 0, entregaDesde: '09:00', entregaHasta: '15:00',
  pedidoMinimo: 5000, precioSalsaExtra: 200, recargoUmbral: 10000, recargoBajoPct: 10, recargoAltoPct: 5,
  aceptarTarjeta: true, proveedorPago: null, yapeNumero: '933980759', yapeTitular: 'Alta Proteína', yapeQr: null,
  whatsapp: '51933980759', instagramUrl: null, rendimientoCoccion: 0.6, mostrarProteina: true, duracionCongeladoDias: 30,
};
const prod = (id: string, nombre: string, precio: number, extra: object = {}) => ({
  id, nombre, descripcion: '', categoria: 'burritos-quesadillas' as const, precio, polloCocidoG: 150, proteinaG: 45,
  recalentado: '', packProductoId: null, packUnidades: null, imagen: null, activo: true, orden: 0, ...extra,
});
const cat: Catalogo = {
  config,
  productos: [
    prod('burrito-pollo', 'Burrito de pollo', 1200),
    prod('arroz-pollo', 'Arroz con pollo', 1100, { categoria: 'arroz-fideos' }),
    prod('pack-7', 'Pack semanal x7', 8000, { categoria: 'packs', packProductoId: 'burrito-pollo', packUnidades: 7 }),
    prod('viejo', 'Plato retirado', 1000, { activo: false }),
  ],
  marinados: [
    { id: 'aji-panca', nombre: 'Ají panca', activo: true, orden: 1 },
    { id: 'achiote', nombre: 'Achiote', activo: true, orden: 2 },
    { id: 'apagado', nombre: 'Apagado', activo: false, orden: 3 },
  ],
  salsas: [
    { id: 'aji-amarillo', nombre: 'Ají amarillo cremoso', activo: true, orden: 1 },
    { id: 'chimichurri', nombre: 'Chimichurri', activo: true, orden: 2 },
    { id: 'criolla', nombre: 'Salsa criolla', activo: true, orden: 3 },
  ],
  zonas: [{ id: 'magdalena', nombre: 'Magdalena del Mar', costo: 0, activa: true, orden: 1 }],
};

test('precio: plato con dos salsas extra = (12 + 2×2) × 3', () => {
  const r = resolverLinea({ key: 'a', productoId: 'burrito-pollo', cantidad: 3, marinadoId: 'aji-panca', salsaId: 'chimichurri', extras: ['criolla', 'aji-amarillo'] }, cat);
  assert.ok(r.ok);
  if (!r.ok) return;
  assert.equal(r.valor.unitario, 1600);
  assert.equal(r.valor.total, 4800);
  assert.equal(r.valor.detalle, 'Ají panca · Salsa: Chimichurri · Extra: Ají amarillo cremoso, Salsa criolla');
});

test('precio: rechaza producto inactivo, marinado apagado y cantidades raras', () => {
  assert.equal(resolverLinea({ key: 'a', productoId: 'viejo', cantidad: 1, marinadoId: 'aji-panca', salsaId: 'criolla', extras: [] }, cat).ok, false);
  assert.equal(resolverLinea({ key: 'a', productoId: 'arroz-pollo', cantidad: 1, marinadoId: 'apagado', salsaId: 'criolla', extras: [] }, cat).ok, false);
  assert.equal(resolverLinea({ key: 'a', productoId: 'arroz-pollo', cantidad: 0, marinadoId: 'aji-panca', salsaId: 'criolla', extras: [] }, cat).ok, false);
  assert.equal(resolverLinea({ key: 'a', productoId: 'arroz-pollo', cantidad: 1.5, marinadoId: 'aji-panca', salsaId: 'criolla', extras: [] }, cat).ok, false);
});

test('pack: criterio 5 — una mezcla que no suma 7 no se acepta', () => {
  const malo = resolverLinea({ key: 'p', productoId: 'pack-7', cantidad: 1, extras: [], packModo: 'mezcla', mezcla: { 'aji-panca': 4, achiote: 2 } }, cat);
  assert.equal(malo.ok, false);
  const bueno = resolverLinea({ key: 'p', productoId: 'pack-7', cantidad: 1, extras: [], packModo: 'mezcla', mezcla: { 'aji-panca': 4, achiote: 3 } }, cat);
  assert.ok(bueno.ok);
  if (bueno.ok) assert.equal(bueno.valor.detalle, '4 Ají panca, 3 Achiote');
  const mix = resolverLinea({ key: 'p', productoId: 'pack-7', cantidad: 2, extras: ['chimichurri'], packModo: 'mix-casa' }, cat);
  assert.ok(mix.ok);
  if (mix.ok) {
    assert.equal(mix.valor.detalle, 'Mix de la casa · Extra: Chimichurri');
    assert.equal(mix.valor.total, 16400);
  }
});

test('pack: el ahorro se calcula (7 × 12 − 80 = 4)', () => {
  assert.deepEqual(ahorroPack(cat.productos[2], cat.productos), { sinPack: 8400, ahorro: 400 });
});

test('recargo: criterio 4 — 10 % bajo S/ 100 y 5 % desde S/ 100', () => {
  assert.deepEqual(totales(6100, 0, 'tarjeta', config), { subtotal: 6100, delivery: 0, base: 6100, recargoPct: 10, recargo: 610, total: 6710 });
  assert.equal(totales(9999, 0, 'tarjeta', config).recargo, 1000);
  assert.equal(totales(10000, 0, 'tarjeta', config).recargo, 500);
  assert.equal(totales(10400, 0, 'tarjeta', config).total, 10920);
  assert.equal(totales(6100, 0, 'yape', config).recargo, 0);
  // La base incluye el delivery.
  assert.equal(totales(9500, 600, 'tarjeta', config).recargoPct, 5);
});

test('agregar rápido usa el primer marinado y la primera salsa activos', () => {
  assert.deepEqual(opcionesPorDefecto(cat), { marinadoId: 'aji-panca', salsaId: 'aji-amarillo' });
});

test('producción: porciones, salsas y pollo crudo (21 porciones = 5,25 kg)', () => {
  const r = resumirProduccion(
    [
      { base_nombre: 'Burrito de pollo', es_pack: true, pack_unidades: 7, pollo_cocido_g: 150, cantidad: 1, marinado_nombre: null, salsa_nombre: null, salsas_extra: [{ id: 'chimichurri', nombre: 'Chimichurri' }], pack_modo: 'mix-casa', pack_mezcla: null },
      { base_nombre: 'Burrito de pollo', es_pack: true, pack_unidades: 7, pollo_cocido_g: 150, cantidad: 1, marinado_nombre: null, salsa_nombre: null, salsas_extra: [], pack_modo: 'mezcla', pack_mezcla: [{ id: 'aji-panca', nombre: 'Ají panca', n: 4 }, { id: 'achiote', nombre: 'Achiote', n: 3 }] },
      { base_nombre: 'Burrito de pollo', es_pack: false, pack_unidades: null, pollo_cocido_g: 150, cantidad: 3, marinado_nombre: 'Ají panca', salsa_nombre: 'Salsa criolla', salsas_extra: [], pack_modo: null, pack_mezcla: null },
      { base_nombre: 'Fideos con pollo', es_pack: false, pack_unidades: null, pollo_cocido_g: 150, cantidad: 4, marinado_nombre: 'Teriyaki', salsa_nombre: 'Chimichurri', salsas_extra: [{ id: 'criolla', nombre: 'Salsa criolla' }], pack_modo: null, pack_mezcla: null },
    ],
    0.6,
  );
  assert.equal(r.totalPorciones, 21);
  assert.equal(r.polloCrudoG, 5250);
  assert.equal(kilos(r.polloCrudoG / 1000), '5,25');
  const burrito = r.productos.find((p) => p.producto === 'Burrito de pollo')!;
  assert.equal(burrito.total, 17);
  assert.deepEqual(burrito.filas, [{ marinado: MIX_CASA, n: 7 }, { marinado: 'Ají panca', n: 7 }, { marinado: 'Achiote', n: 3 }]);
  assert.equal(r.salsas.find((s) => s.nombre === SALSA_COCINA)!.n, 14);
  assert.equal(r.salsas.find((s) => s.nombre === 'Chimichurri')!.n, 5); // 1 extra del pack + 4 incluidas
  assert.equal(r.salsas.find((s) => s.nombre === 'Salsa criolla')!.n, 7); // 3 incluidas + 4 extras
});

test('formatos es-PE', () => {
  assert.equal(soles(6100), 'S/ 61');
  assert.equal(soles(6110), 'S/ 61,10');
  assert.equal(soles2(6100), 'S/ 61,00');
  assert.equal(soles2(123456), 'S/ 1.234,56');
  assert.equal(hora('19:00'), '7:00 p. m.');
  assert.equal(hora('19:00', false), '7 p. m.');
  assert.equal(hora('09:30', false), '9:30 a. m.');
  assert.equal(hora('12:00', false), '12 p. m.');
  assert.equal(ventana('09:00', '15:00'), '9 a. m. y 3 p. m.');
  assert.equal(diaCorto('2026-11-22'), 'domingo 22');
  assert.equal(diaLargo('2026-11-22'), 'domingo 22 de noviembre');
  assert.equal(kilos(9.5), '9,5');
  assert.equal(kilos(7), '7');
  assert.equal(momentoCorto(lima('2026-11-12T21:14:00')), '12 nov · 9:14 p. m.');
});
