import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("admin_token")?.value;
  const { pathname } = request.nextUrl;

  const ADMIN_ROUTE = process.env.ADMIN_ROUTE || "login";

  const ADMIN_LOGIN_ROUTE = `/Admin/${ADMIN_ROUTE}`;
  const ADMIN_BASE_ROUTE = "/Admin";

  const isAdminRoute = pathname.startsWith(ADMIN_BASE_ROUTE);
  const isAdminLoginRoute = pathname === ADMIN_LOGIN_ROUTE;

  // Not logged in → redirect to login
  if (isAdminRoute && !isAdminLoginRoute && !token) {
    return NextResponse.redirect(
      new URL(ADMIN_LOGIN_ROUTE, request.url)
    );
  }

  // Logged in → prevent accessing login again
  if (isAdminLoginRoute && token) {
    return NextResponse.redirect(
      new URL(`${ADMIN_BASE_ROUTE}/dashboard`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/Admin/:path*"],
};