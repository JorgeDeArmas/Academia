import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/api/auth/tiktok", "/api/auth/tiktok/callback"];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Redirect to home if accessing protected routes without session
  if (!isPublicRoute && !session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect to dashboard if accessing public routes with active session
  if (isPublicRoute && session && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|json)$).*)",
  ],
};
