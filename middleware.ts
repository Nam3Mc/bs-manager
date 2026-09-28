import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySession, roleHome } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);

  const isAdmin = pathname.startsWith("/admin");
  const isMarket = pathname.startsWith("/market");
  const isAuthPage = pathname === "/login" || pathname === "/register";

  // Already signed in → bounce away from /login and /register
  if (isAuthPage && session) {
    return NextResponse.redirect(new URL(roleHome(session.role), req.url));
  }

  // Protected areas
  if ((isAdmin || isMarket) && !session) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Role mismatches
  if (isAdmin && session?.role !== "ADMIN") {
    return NextResponse.redirect(new URL(roleHome(session!.role), req.url));
  }
  if (isMarket && session?.role !== "CLIENT") {
    return NextResponse.redirect(new URL(roleHome(session!.role), req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/market/:path*", "/login", "/register"],
};