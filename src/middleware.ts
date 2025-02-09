import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-fallback-secret-key"
);

export async function middleware(request: NextRequest) {
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }

  // Exclude login page and API from middleware
  if (
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/api/login"
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    await jwtVerify(token, secretKey);
    return NextResponse.next();
  } catch (error: any) {
    console.error("validate jwt error", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/login (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page)
     */
    "/((?!api/login|_next/static|_next/image|favicon.ico|login).*)",
  ],
};
