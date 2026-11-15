/**
 * Prueba de integración contra un Postgres REAL con schema.sql + seed.sql.
 * NO usar la base de producción: crea una base de prueba aparte.
 *
 *   DATABASE_URL=postgresql://…/altaproteina_test CAPTURAS_DIR=/tmp/cap \
 *     node --conditions=react-server --import tsx --test tests/pedidos.integracion.ts
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cambiarEstado, crearPedido, listarSemana, obtenerPedidoPublico, reemplazarCaptura, type EntradaPedido } from '../src/lib/pedidos';
import { resumirProduccion } from '../src/lib/produccion';
import { obtenerPool } from '../src/lib/db';

const lima = (iso: string) => new Date(`${iso}-05:00`);
const entrega = { nombre: 'Lucía Prueba', celular: '987654321', zonaId: 'magdalena', direccion: 'Av. Brasil 2850', referencia: 'Edificio verde', notas: '' };
const burrito = (cantidad: number, extras: string[] = []) => ({ key: 'b', productoId: 'burrito-pollo', cantidad, marinadoId: 'aji-panca', salsaId: 'chimichurri', extras });
const pedido = (lineas: EntradaPedido['lineas'], medio: 'yape' | 'tarjeta' = 'yape'): EntradaPedido => ({ lineas, entrega, medio });

test('crea pedidos Yape con código correlativo mensual y semana correcta', async () => {
  const a = await crearPedido(pedido([burrito(5)]), 'a'.repeat(64) + '.png', lima('2026-11-14T10:00:00'));
  assert.ok(a.ok, JSON.stringify(a));
  const b = await crearPedido(pedido([burrito(5)]), 'b'.repeat(64) + '.png', lima('2026-11-14T10:05:00'));
  assert.ok(b.ok);
  if (!a.ok || !b.ok) return;
  assert.match(a.codigo, /^AP-2611-\d{4}$/);
  assert.equal(Number(b.codigo.slice(-4)), Number(a.codigo.slice(-4)) + 1);
  const p = await obtenerPedidoPublico(a.codigo, a.clave);
  assert.ok(p);
  assert.equal(p!.semana_entrega, '2026-11-22');
  assert.equal(p!.total, 6000);
  assert.equal(p!.celular, '+51987654321');
  assert.equal(p!.estado, 'pendiente');
});

test('criterio 3: jueves 19:01 queda en el domingo siguiente', async () => {
  const r = await crearPedido(pedido([burrito(5)]), 'c'.repeat(64) + '.png', lima('2026-11-19T19:01:00'));
  assert.ok(r.ok);
  if (!r.ok) return;
  assert.equal((await obtenerPedidoPublico(r.codigo, r.clave))!.semana_entrega, '2026-11-29');
});

test('criterio 2 y 5: bajo el mínimo, mezcla que no suma 7 y Yape sin captura se rechazan', async () => {
  const bajo = await crearPedido(pedido([burrito(4)]), 'd'.repeat(64) + '.png');
  assert.equal(bajo.ok, false);
  const mezcla = await crearPedido(pedido([{ key: 'p', productoId: 'pack-7', cantidad: 1, extras: [], packModo: 'mezcla', mezcla: { 'aji-panca': 6 } }]), 'e'.repeat(64) + '.png');
  assert.equal(mezcla.ok, false);
  const sinCaptura = await crearPedido(pedido([burrito(5)]), null);
  assert.equal(sinCaptura.ok, false);
  const celular = await crearPedido({ ...pedido([burrito(5)]), entrega: { ...entrega, celular: '98765' } }, 'f'.repeat(64) + '.png');
  assert.equal(celular.ok, false);
  if (!celular.ok) assert.ok(celular.campos?.celular);
});

test('criterio 4: tarjeta guarda el recargo como línea aparte (10 % y 5 %)', async () => {
  const bajo = await crearPedido(pedido([burrito(5)], 'tarjeta'), null, lima('2026-11-15T09:00:00'));
  assert.ok(bajo.ok);
  if (!bajo.ok) return;
  const p = (await obtenerPedidoPublico(bajo.codigo, bajo.clave))!;
  assert.equal(p.recargo, 600);
  assert.equal(p.recargo_pct, 10);
  assert.equal(p.total, 6600);

  const alto = await crearPedido(pedido([{ key: 'p', productoId: 'pack-7', cantidad: 1, extras: [], packModo: 'mix-casa' }, burrito(2)], 'tarjeta'), null, lima('2026-11-15T09:00:00'));
  assert.ok(alto.ok);
  if (!alto.ok) return;
  const q = (await obtenerPedidoPublico(alto.codigo, alto.clave))!;
  assert.equal(q.subtotal, 10400);
  assert.equal(q.recargo, 520);
  assert.equal(q.total, 10920);
});

test('el enlace público exige la clave', async () => {
  const r = await crearPedido(pedido([burrito(5)]), '1'.repeat(64) + '.png');
  assert.ok(r.ok);
  if (!r.ok) return;
  assert.equal(await obtenerPedidoPublico(r.codigo, undefined), null);
  assert.equal(await obtenerPedidoPublico(r.codigo, 'xxxxxxxx'), null);
  assert.ok(await obtenerPedidoPublico(r.codigo, r.clave));
});

test('criterio 6: rechazar y volver a subir captura cambia el estado visible', async () => {
  const r = await crearPedido(pedido([burrito(5)]), '2'.repeat(64) + '.png');
  assert.ok(r.ok);
  if (!r.ok) return;
  await cambiarEstado(r.codigo, 'rechazado', 'Monto distinto');
  let p = (await obtenerPedidoPublico(r.codigo, r.clave))!;
  assert.equal(p.estado, 'rechazado');
  assert.equal(p.motivo_rechazo, 'Monto distinto');
  assert.equal(await reemplazarCaptura(r.codigo, '3'.repeat(64) + '.png'), true);
  p = (await obtenerPedidoPublico(r.codigo, r.clave))!;
  assert.equal(p.estado, 'pendiente');
  assert.equal(p.motivo_rechazo, null);
  // Un pedido que no está rechazado no acepta otra captura.
  assert.equal(await reemplazarCaptura(r.codigo, '4'.repeat(64) + '.png'), false);
});

test('criterio 7: producción cuenta solo pagados y calcula el pollo crudo', async () => {
  const ahora = lima('2026-12-01T10:00:00'); // semana del domingo 6-dic, aislada del resto
  const pack = await crearPedido(pedido([{ key: 'p', productoId: 'pack-7', cantidad: 1, extras: ['criolla'], packModo: 'mezcla', mezcla: { 'aji-panca': 4, achiote: 3 } }]), '5'.repeat(64) + '.png', ahora);
  const platos = await crearPedido(pedido([{ key: 'f', productoId: 'fideos-pollo', cantidad: 5, marinadoId: 'teriyaki', salsaId: 'huancaina', extras: [] }]), '6'.repeat(64) + '.png', ahora);
  const sinPagar = await crearPedido(pedido([burrito(10)]), '7'.repeat(64) + '.png', ahora);
  assert.ok(pack.ok && platos.ok && sinPagar.ok);
  if (!pack.ok || !platos.ok) return;
  await cambiarEstado(pack.codigo, 'pagado');
  await cambiarEstado(platos.codigo, 'preparado');

  const semana = await listarSemana('2026-12-06');
  assert.equal(semana.length, 3);
  const r = resumirProduccion(semana.filter((p) => p.estado === 'pagado' || p.estado === 'preparado').flatMap((p) => p.lineas), 0.6);
  assert.equal(r.totalPorciones, 12);
  assert.equal(r.polloCrudoG, 3000); // 12 × 150 ÷ 0,6
  assert.deepEqual(r.productos.find((x) => x.producto === 'Burrito de pollo')!.filas, [{ marinado: 'Ají panca', n: 4 }, { marinado: 'Achiote', n: 3 }]);
  assert.equal(r.salsas.find((s) => s.nombre === 'Huancaína')!.n, 5);
  assert.equal(r.salsas.find((s) => s.nombre === 'Salsa criolla')!.n, 1);
});

test('cierre', async () => {
  await obtenerPool().end();
});
