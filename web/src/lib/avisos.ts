import 'server-only';
import { leerCaptura } from './capturas';
import { soles2 } from './formato';
import type { Pedido } from './pedidos';

/**
 * Avisos al equipo por Telegram (opcional). Sin TELEGRAM_BOT_TOKEN y
 * TELEGRAM_CHAT_ID solo se registra en el log: un aviso nunca puede tumbar un
 * pedido. La captura viaja como ARCHIVO, nunca como enlace público.
 */

const API = 'https://api.telegram.org/bot';

function credenciales() {
  return { token: process.env.TELEGRAM_BOT_TOKEN ?? '', chat: process.env.TELEGRAM_CHAT_ID ?? '' };
}

const escapar = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

async function llamar(metodo: string, cuerpo: FormData | object): Promise<boolean> {
  const { token } = credenciales();
  try {
    const esForm = cuerpo instanceof FormData;
    const r = await fetch(`${API}${token}/${metodo}`, {
      method: 'POST',
      headers: esForm ? undefined : { 'Content-Type': 'application/json' },
      body: esForm ? cuerpo : JSON.stringify(cuerpo),
      signal: AbortSignal.timeout(15_000),
    });
    const d = (await r.json()) as { ok: boolean; description?: string };
    if (!d.ok) console.error('[avisos] Telegram rechazó', metodo, d.description);
    return d.ok;
  } catch (e) {
    console.error('[avisos] no se pudo llamar a Telegram', e);
    return false;
  }
}

export async function avisarPedido(p: Pedido, motivo: 'nuevo' | 'nueva-captura'): Promise<void> {
  const { token, chat } = credenciales();
  const sitio = process.env.SITIO_URL ?? '';
  const titulo = motivo === 'nuevo' ? '🧾 Pedido nuevo' : '🔁 Nueva captura';
  const texto = [
    `<b>${titulo} ${p.codigo}</b> · ${p.medio === 'yape' ? 'Yape' : 'Tarjeta (enviar link)'}`,
    `${escapar(p.nombre)} · ${p.celular}`,
    `${escapar(p.zona_nombre)} · ${escapar(p.direccion)}`,
    `Total: <b>${soles2(p.total)}</b>`,
    `${sitio}/panel/${p.medio === 'yape' ? 'yape' : `?pedido=${p.codigo}`}`,
  ].join('\n');

  if (!token || !chat) {
    console.log(`[avisos] (Telegram sin configurar) ${titulo} ${p.codigo} ${soles2(p.total)}`);
    return;
  }
  const archivo = p.captura ? await leerCaptura(p.captura) : null;
  if (archivo && archivo.tipo !== 'image/heic') {
    const form = new FormData();
    form.set('chat_id', chat);
    form.set('caption', texto);
    form.set('parse_mode', 'HTML');
    form.set('photo', new Blob([new Uint8Array(archivo.contenido)], { type: archivo.tipo }), p.captura!);
    if (await llamar('sendPhoto', form)) return;
  }
  await llamar('sendMessage', { chat_id: chat, text: texto, parse_mode: 'HTML', disable_web_page_preview: true });
}
