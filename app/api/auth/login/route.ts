import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import {
  SESSION_COOKIE,
  COOKIE_OPTIONS,
  signSession,
  roleHome,
  type UserRole,
} from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email, password } = (body ?? {}) as Record<string, unknown>;
  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const rows = await sql`
      SELECT id, email, name, role, password_hash
      FROM users
      WHERE lower(email) = ${normalizedEmail}
      LIMIT 1
    `;
    const user = rows[0] as
      | { id: string; email: string; name: string; role: UserRole; password_hash: string }
      | undefined;

    // Same message for "no user" and "bad password" — don't leak which emails exist.
    const invalid = () =>
      NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

    if (!user) return invalid();

    const ok = await verifyPassword(password, user.password_hash);
    if (!ok) return invalid();

    const token = await signSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const res = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      redirectTo: roleHome(user.role),
    });

    res.cookies.set(SESSION_COOKIE, token, COOKIE_OPTIONS);
    return res;
  } catch (err) {
    console.error("[POST /api/auth/login]", err);
    return NextResponse.json({ error: "Failed to sign in" }, { status: 500 });
  }
}