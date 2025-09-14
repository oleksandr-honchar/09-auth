import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkSession } from "./lib/api/serverApi";

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  const { pathname } = req.nextUrl;
  const isPrivateRoute = pathname.startsWith("/profile") || pathname.startsWith("/notes");
  const isPublicRoute = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  // If private route without any token → redirect to login
  if (isPrivateRoute && !accessToken && !refreshToken) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // If public route but already authenticated → redirect to profile
  if (isPublicRoute && accessToken) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  // If private route without accessToken but refreshToken exists → call /auth/session
  if (isPrivateRoute && !accessToken && refreshToken) {
    try {
      await checkSession(); // refreshes cookie automatically
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  return NextResponse.next();
}


export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
