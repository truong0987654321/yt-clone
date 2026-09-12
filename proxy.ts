import { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_TOKEN_COOKIE,
  PAGES,
  REFRESH_TOKEN_COOKIE,
} from "@/lib/constants";

const PROTECTED_PATHS = [
  PAGES.ACCOUNT_ADVANCED,
  PAGES.ACCOUNT,
  // PAGES.SETTINGS,
];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));

  if (!isProtected) {
    return NextResponse.next();
  }

  const hasAccessToken = req.cookies.has(ACCESS_TOKEN_COOKIE);
  const hasRefreshToken = req.cookies.has(REFRESH_TOKEN_COOKIE);

  if (!hasAccessToken && !hasRefreshToken) {
    return NextResponse.redirect(new URL(PAGES.LOGIN, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
