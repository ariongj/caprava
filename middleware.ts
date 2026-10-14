import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale } from "./lib/i18n";

// Sends visitors without a language prefix to /sq or /en.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1] ?? "";
  if (isLocale(first)) return NextResponse.next();

  const saved = request.cookies.get("lang")?.value;
  const accept = request.headers.get("accept-language")?.toLowerCase() ?? "";
  const prefersAlbanian = accept.startsWith("sq") || accept.includes("sq-") || accept.includes(",sq");
  const locale = saved && isLocale(saved) ? saved : accept && !prefersAlbanian && accept.startsWith("en") ? "en" : defaultLocale;

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
