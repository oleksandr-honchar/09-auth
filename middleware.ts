// middleware.ts
import { NextResponse } from "next/server";
import { parse } from "cookie";

const PRIVATE_ROUTES = ["/profile", "/notes"];
const PUBLIC_ROUTES = ["/sign-in", "/sign-up"];

export function middleware(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Extract cookies from headers
  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookies = parse(cookieHeader);
  const accessToken = cookies["accessToken"];

  const isPrivateRoute = PRIVATE_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Redirect non-authenticated users from private routes to login
  if (!accessToken && isPrivateRoute) {
    return NextResponse.redirect(new URL("/sign-in", url));
  }

  // Redirect authenticated users from public pages to profile
  if (accessToken && isPublicRoute) {
    return NextResponse.redirect(new URL("/profile", url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/notes/:path*",
    "/sign-in",
    "/sign-up",
  ],
};
