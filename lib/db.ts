import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Add it to .env.local and Vercel env vars.");
}

/**
 * Tagged-template SQL client.
 *
 *   const rows = await sql`SELECT * FROM products WHERE store_id = ${storeId}`;
 *
 * Every `${...}` is parameterized — this is the ONLY safe way to interpolate
 * values. Never build SQL with string concatenation.
 *
 * `neon()` uses HTTP fetch under the hood: no connection pool to manage,
 * no cold-start connection cost, works on both Node and Edge runtimes.
 */
export const sql: NeonQueryFunction<false, false> = neon(process.env.DATABASE_URL);

/** Typed helper for single-row fetches. */
export async function one<T>(query: Promise<T[]>): Promise<T | null> {
  const rows = await query;
  return rows[0] ?? null;
}