import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require an authenticated session
const PROTECTED_ROUTES = [
  "/dashboard",
  "/products/saved",
  "/settings",
  "/profile",
  "/subscription",
];

// Routes that should redirect authenticated users away (auth pages)
const AUTH_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await auth();
  const isAuthenticated = !!session?.user;

  // Check if the path is protected
  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Check if the path is an auth page
  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Redirect unauthenticated users away from protected pages
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    // Preserve the return path (only safe relative paths)
    if (pathname !== "/") {
      loginUrl.searchParams.set("callbackUrl", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages to dashboard
  if (isAuthRoute && isAuthenticated) {
    const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");
    const destination = callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/dashboard";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files
     * - API routes handled by Auth.js itself
     */
    "/((?!_next/static|_next/image|favicon.ico|api/auth).*)",
  ],
};

