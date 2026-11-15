import { Pool, type PoolClient } from 'pg';

/**
 * Pool de conexiones a Postgres (mismo patrón que La Doble T).
 *
 * Se crea en el primer uso: durante `next build` no hay DATABASE_URL y así la
 * imagen se construye en cualquier máquina. En desarrollo se cachea en
 * `globalThis` para que el hot reload no abra un pool nuevo en cada cambio.
 */

declare global {
  // eslint-disable-next-line no-var
  var __apPool: Pool | undefined;
}

export function hayBase(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function obtenerPool(): Pool {
  if (!globalThis.__apPool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error('Falta DATABASE_URL (ver .env.example).');
    globalThis.__apPool = new Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    });
  }
  return globalThis.__apPool;
}

export async function consultar<T extends Record<string, unknown>>(sql: string, parametros: unknown[] = []): Promise<T[]> {
  const r = await obtenerPool().query(sql, parametros);
  return r.rows as T[];
}

export async function consultarUna<T extends Record<string, unknown>>(sql: string, parametros: unknown[] = []): Promise<T | null> {
  return (await consultar<T>(sql, parametros))[0] ?? null;
}

/** Bloque en transacción con commit/rollback automático. */
export async function enTransaccion<T>(bloque: (c: PoolClient) => Promise<T>): Promise<T> {
  const c = await obtenerPool().connect();
  try {
    await c.query('begin');
    const r = await bloque(c);
    await c.query('commit');
    return r;
  } catch (e) {
    await c.query('rollback');
    throw e;
  } finally {
    c.release();
  }
}
