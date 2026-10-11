import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "bs_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type UserRole = "ADMIN" | "CLIENT";

export type SessionPayload = {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
};

/**
 * Lazily resolve the secret. Never throw at module load — Next.js imports
 * every route module during the build to collect config, and a top-level
 * throw turns a missing env var into a build failure instead of a 500.
 */
function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not set. Add it to .env.local and Vercel env vars.");
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());
}

export async function verifySession(
  token: string | undefined
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE,
};

/** Where to send a user after login, based on role. */
export function roleHome(role: UserRole): string {
  return role === "ADMIN" ? "/admin/dashboard" : "/market";
}
