import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;

  const { pathname } = req.nextUrl;

  const isPrivateRoute =
    pathname.startsWith("/profile") || pathname.startsWith("/notes");
  const isPublicRoute =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  // 🔒 Якщо немає токена → редірект на логін
  if (isPrivateRoute && !accessToken) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // 🔑 Якщо є токен і користувач йде на публічний маршрут → редірект у профіль
  if (isPublicRoute && accessToken) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
