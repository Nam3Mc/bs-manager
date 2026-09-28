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

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
if (!process.env.AUTH_SECRET) {
  throw new Error("AUTH_SECRET is not set. Add it to .env.local and Vercel env vars.");
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secret);
}

export async function verifySession(
  token: string | undefined
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
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