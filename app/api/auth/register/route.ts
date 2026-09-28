import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { hashPassword } from "@/lib/password";
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

  const { name, email, password, role } = (body ?? {}) as Record<string, unknown>;

  // ---- validation ----
  if (typeof name !== "string" || name.trim().length < 2) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }
  if (typeof password !== "string" || password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    );
  }
  const safeRole: UserRole = role === "ADMIN" ? "ADMIN" : "CLIENT";

  const normalizedEmail = email.trim().toLowerCase();

  try {
    // ---- uniqueness check ----
    const existing = await sql`
      SELECT id FROM users WHERE lower(email) = ${normalizedEmail} LIMIT 1
    `;
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "An account with that email already exists" },
        { status: 409 }
      );
    }

    // ---- create ----
    const passwordHash = await hashPassword(password);
    const rows = await sql`
      INSERT INTO users (email, password_hash, name, role)
      VALUES (${normalizedEmail}, ${passwordHash}, ${name.trim()}, ${safeRole})
      RETURNING id, email, name, role
    `;

    const user = rows[0] as {
      id: string;
      email: string;
      name: string;
      role: UserRole;
    };

    // ---- session ----
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
    console.error("[POST /api/auth/register]", err);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}