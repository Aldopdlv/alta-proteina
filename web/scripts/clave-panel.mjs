// Genera el hash de la contraseña del panel para PANEL_CLAVE_HASH (.env).
//   node scripts/clave-panel.mjs "la-contraseña"
import { randomBytes, scryptSync } from 'node:crypto';

const clave = process.argv[2];
if (!clave || clave.length < 10) {
  console.error('Uso: node scripts/clave-panel.mjs "<contraseña de al menos 10 caracteres>"');
  process.exit(1);
}
const sal = randomBytes(16).toString('base64url');
const hash = scryptSync(clave, sal, 32).toString('base64url');
// En docker compose el signo $ se escribe $$: por eso se separa con puntos.
console.log(`scrypt.${sal}.${hash}`);
