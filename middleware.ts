import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkSession } from "./lib/api/serverApi";

interface SessionData {
  accessToken?: string;
  refreshToken?: string;
}

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  const { pathname } = req.nextUrl;
  const isPrivateRoute = pathname.startsWith("/profile") || pathname.startsWith("/notes");
  const isPublicRoute = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  // 🔒 Private route without any token
  if (isPrivateRoute && !accessToken && !refreshToken) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // 🔑 Public route with accessToken
  if (isPublicRoute && accessToken) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  // 🔄 Refresh session using refreshToken
  if (isPrivateRoute && !accessToken && refreshToken) {
    try {
      const resCheck = await checkSession() as { data: SessionData };
      const data = resCheck.data; // { accessToken?, refreshToken? }

      const res = NextResponse.next();
      if (data?.accessToken) {
        res.cookies.set("accessToken", data.accessToken, { httpOnly: true, secure: true, path: "/" });
      }
      if (data?.refreshToken) {
        res.cookies.set("refreshToken", data.refreshToken, { httpOnly: true, secure: true, path: "/" });
      }
      return res;
    } catch {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
