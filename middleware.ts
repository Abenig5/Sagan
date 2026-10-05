import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { LOCALES, DEFAULT_LOCALE } from "./lib/i18n/dictionaries";

function hasLocalePrefix(pathname: string) {
  return LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin area: protect everything except /admin/login, independent of locale.
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin") || pathname.startsWith("/api") || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  // Public site: default-locale redirect, e.g. "/" -> "/de", "/services" -> "/de/services".
  if (!hasLocalePrefix(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets).*)"],
};
