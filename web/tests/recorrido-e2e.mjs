// Recorrido completo como cliente (390 px) + panel, con capturas de pantalla.
//   CLAVE=<contraseña del panel> SEMANA=<AAAA-MM-DD del domingo del pedido> node tests/recorrido-e2e.mjs
//   Requiere playwright-core. Crea un pedido "Prueba Recorrido": BORRARLO después (ver README).
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

// Base: túnel SSH al puerto 8097 del Dappnode (ssh -N -L 18097:127.0.0.1:8097 …) o la URL pública.
const B = process.env.BASE ?? 'http://localhost:18097';
const OUT = new URL('./capturas/', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
mkdirSync(OUT, { recursive: true });
const CHROME = process.env.CHROME ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const errores = [];
const paso = (t) => console.log(`✔ ${t}`);

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const movil = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'es-PE' });
const p = await movil.newPage();
p.on('pageerror', (e) => errores.push(`pageerror: ${e.message}`));
p.on('console', (m) => m.type() === 'error' && errores.push(`console: ${m.text()}`));
const foto = (n, full = true) => p.screenshot({ path: `${OUT}${n}.png`, fullPage: full });

// 1. Inicio y menú
await p.goto(`${B}/`);
await foto('m01-inicio');
paso('Inicio');
await p.goto(`${B}/menu`);
await p.getByRole('heading', { name: 'Menú de la semana' }).waitFor();
await foto('m02-menu');
paso('Menú');

// 2. Agregar rápido 5 burritos
const burrito = p.locator('article', { hasText: 'Burrito de pollo' }).first();
await burrito.getByRole('button', { name: 'Agregar', exact: true }).click();
for (let i = 0; i < 4; i++) await burrito.getByRole('button', { name: 'Agregar uno' }).click();
await p.getByText('5 ítems · S/ 60').waitFor();
paso('5 burritos con "Agregar" rápido → barra "5 ítems · S/ 60"');

// 3. Pack con mezcla 4 + 3 y una salsa extra
await p.getByRole('button', { name: 'Elegir marinado', exact: true }).click();
const hoja = p.getByRole('dialog');
await hoja.getByText('7 de 7 elegidos').waitFor();
for (let i = 0; i < 3; i++) await hoja.getByRole('button', { name: 'Quitar uno de Ají panca' }).click();
await hoja.getByRole('button', { name: 'Elige 3 más' }).waitFor();
await foto('m03-hoja-pack-incompleto', false);
for (let i = 0; i < 3; i++) await hoja.getByRole('button', { name: 'Agregar uno de Achiote' }).click();
await hoja.getByRole('checkbox', { name: /Chimichurri/ }).click();
await hoja.getByRole('button', { name: 'Agregar · S/ 82' }).click();
paso('Pack: con 4 de 7 el botón dice "Elige 3 más"; con 4 Ají panca + 3 Achiote + Chimichurri → S/ 82');

// 4. Fideos personalizados
await p.locator('article', { hasText: 'Fideos con pollo' }).getByRole('button', { name: 'Elegir marinado y salsa' }).click();
await hoja.getByRole('radio', { name: /Teriyaki/ }).first().click();
await hoja.getByRole('radio', { name: 'Huancaína' }).click();
await foto('m04-hoja-plato', false);
await hoja.getByRole('button', { name: 'Agregar · S/ 11' }).click();
paso('Fideos con Teriyaki y Huancaína');

// 5. Carrito
await p.getByRole('link', { name: 'Ver carrito' }).click();
await p.getByRole('heading', { name: 'Tu semana' }).waitFor();
await p.getByText('4 Ají panca, 3 Achiote · Extra: Chimichurri').waitFor();
await foto('m05-carrito');
paso('Carrito: S/ 60 + S/ 82 + S/ 11 = S/ 153');

// 6. Entrega con errores y luego bien
await p.getByRole('link', { name: 'Continuar a entrega' }).click();
await p.getByRole('heading', { name: '¿A dónde te lo llevamos?' }).waitFor();
await p.getByRole('button', { name: 'Continuar al pago' }).click();
await p.getByText('Escribe tu nombre').waitFor();
await foto('m06-entrega-errores');
await p.getByLabel('Nombre y apellido').fill('Prueba Recorrido');
await p.locator('input[type=tel]').fill('987654321');
await p.getByLabel('Zona').selectOption('magdalena');
await p.getByLabel('Dirección').fill('Av. Brasil 2850');
await p.getByLabel('Referencia (opcional)').fill('Edificio verde, dpto. 302');
await p.getByRole('button', { name: 'Continuar al pago' }).click();
paso('Entrega: valida campos vacíos y avanza con datos completos');

// 7. Pago: ver tarjeta (recargo 5 %) y pagar con Yape
await p.getByRole('heading', { name: '¿Cómo quieres pagar?' }).waitFor();
await foto('m07-pago-yape');
await p.getByRole('radio', { name: /Tarjeta/ }).click();
await p.getByText('Recargo por tarjeta (5 %)').waitFor();
await p.getByRole('button', { name: 'Pagar S/ 160,65 con tarjeta' }).waitFor();
await foto('m08-pago-tarjeta');
paso('Tarjeta: recargo 5 % sobre S/ 153 → S/ 160,65');
await p.getByRole('radio', { name: /Yape/ }).click();
const captura = await p.screenshot({ type: 'png' });
await p.locator('input[type=file]').setInputFiles({ name: 'captura-yape.png', mimeType: 'image/png', buffer: captura });
await p.getByText('Imagen lista').waitFor();
await p.getByRole('checkbox', { name: 'Confirmo que ya pagué este monto' }).click();
await p.getByRole('button', { name: 'Enviar pedido' }).click();
await p.waitForURL(/\/pedido\/AP-\d{4}-\d{4}\?t=/);
const urlPedido = p.url();
const codigo = urlPedido.match(/AP-\d{4}-\d{4}/)[0];
await p.getByText('Pendiente de confirmación').first().waitFor();
await foto('m09-pedido-pendiente');
paso(`Pedido creado ${codigo} (pendiente de confirmación)`);

// 8. Panel
const panel = await movil.newPage();
panel.on('pageerror', (e) => errores.push(`panel pageerror: ${e.message}`));
await panel.goto(`${B}/panel`);
await panel.getByLabel('Contraseña').fill('equivocada');
await panel.getByRole('button', { name: 'Ingresar' }).click();
await panel.getByText('Contraseña incorrecta.').waitFor();
await panel.getByLabel('Contraseña').fill(process.env.CLAVE);
await panel.getByRole('button', { name: 'Ingresar' }).click();
await panel.waitForURL(`${B}/panel`);
const SEM = `?semana=${process.env.SEMANA}`;
await panel.goto(`${B}/panel${SEM}`);
await panel.getByText(codigo).locator('visible=true').first().waitFor();
await panel.screenshot({ path: `${OUT}m10-panel-pedidos.png`, fullPage: true });
paso('Panel: rechaza contraseña equivocada, entra con la correcta y lista el pedido');
await panel.goto(`${B}/panel/yape`);
await panel.getByText('S/ 153,00').waitFor();
await panel.screenshot({ path: `${OUT}m11-panel-yape.png`, fullPage: true });
await panel.getByRole('button', { name: 'Aprobar' }).click();
await panel.getByText('Pago aprobado').waitFor();
await panel.getByText('No hay capturas por revisar.').waitFor();
paso('Yape: aprobado, la cola queda vacía');
await panel.goto(`${B}/panel/produccion${SEM}`);
await panel.getByText('Pollo crudo a comprar').first().waitFor();
const kilos = await panel.locator('span', { hasText: / kg$/ }).first().textContent();
await panel.screenshot({ path: `${OUT}m12-panel-produccion.png`, fullPage: true });
paso(`Producción: ${kilos} (13 porciones × 250 g = 3,25 kg)`);
await panel.goto(`${B}/panel/entregas${SEM}`);
await panel.getByText('Magdalena del Mar').first().waitFor();
await panel.screenshot({ path: `${OUT}m13-panel-entregas.png`, fullPage: true });
await panel.goto(`${B}/panel/configuracion`);
await panel.getByRole('button', { name: 'Corte y día de entrega' }).click();
await panel.screenshot({ path: `${OUT}m14-panel-configuracion.png`, fullPage: true });
paso('Entregas y Configuración cargan');

// 9. El cliente ve su pedido pagado
await p.goto(urlPedido);
await p.getByText('Pago confirmado. Cocinamos tu pedido el sábado').waitFor();
await foto('m15-pedido-pagado');
paso('El enlace del cliente muestra "Pagado"');

// 10. Escritorio
const esc = await browser.newContext({ viewport: { width: 1280, height: 800 }, locale: 'es-PE' });
const d = await esc.newPage();
d.on('pageerror', (e) => errores.push(`desk pageerror: ${e.message}`));
await d.goto(`${B}/`);
await d.screenshot({ path: `${OUT}d01-inicio.png`, fullPage: true });
await d.goto(`${B}/menu?hoja=burrito-pollo`);
await d.getByRole('dialog').waitFor();
await d.screenshot({ path: `${OUT}d02-menu-hoja.png` });
await esc.addCookies(await movil.cookies());
await d.goto(`${B}/panel?semana=${process.env.SEMANA}&pedido=${codigo}`);
await d.getByRole('dialog').waitFor();
await d.screenshot({ path: `${OUT}d03-panel-detalle.png` });
await d.goto(`${B}/panel/produccion/cocina?semana=${process.env.SEMANA}`);
await d.screenshot({ path: `${OUT}d04-hoja-cocina.png`, fullPage: true });
paso('Escritorio: inicio, hoja como modal, detalle lateral del panel, hoja de cocina');

console.log(`CODIGO=${codigo}`);
console.log(errores.length ? `ERRORES:\n${errores.join('\n')}` : 'Sin errores de consola ni de página.');
await browser.close();
