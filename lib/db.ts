import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Add it to .env.local and Vercel env vars.");
}

export const sql: NeonQueryFunction<false, false> = neon(process.env.DATABASE_URL);
