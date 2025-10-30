// Helper Libs
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// Middleware Logic
export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (request.nextUrl.pathname.startsWith("/questions")) {
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET!);
      return NextResponse.next();
    } catch (error) {
      console.error("Invalid or expired token:", error);
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Default allow
  const res = NextResponse.next();
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.headers.set("Pragma", "no-cache");
  res.headers.set("Expires", "0");
  res.headers.set("Surrogate-Control", "no-store");

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/questions',
    '/'
  ],
}