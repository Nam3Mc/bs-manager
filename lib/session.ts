import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  verifySession,
  roleHome,
  type SessionPayload,
  type UserRole,
} from "@/lib/auth";

/** Read the current session in a Server Component / Route Handler. */
export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return verifySession(token);
}

/** Require a session, redirecting to /login if missing. */
export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

/** Require a specific role, redirecting to the user's own home otherwise. */
export async function requireRole(role: UserRole): Promise<SessionPayload> {
  const session = await requireSession();
  if (session.role !== role) redirect(roleHome(session.role));
  return session;
}