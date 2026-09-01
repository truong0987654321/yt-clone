import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  IS_LOGGED_IN_COOKIE,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
  COOKIE_SECURE,
  BACKEND_ROUTES,
} from "@/lib/constants";
import { backendApi } from "@/lib/axios";

// POST /api/auth/refresh
export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!refreshToken) {
    const res = NextResponse.json({ error: "Not logged in" }, { status: 401 });
    res.cookies.delete(IS_LOGGED_IN_COOKIE);
    return res;
  }
  try {
    const data = await backendApi.post(BACKEND_ROUTES.AUTH.REFRESH, {
      refresh_token: refreshToken,
    });
    const res = NextResponse.json({ ok: true });
    res.cookies.set(ACCESS_TOKEN_COOKIE, data.data.access_token, {
      httpOnly: true,
      secure: COOKIE_SECURE,
      sameSite: "lax",
      path: "/",
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });
    res.cookies.set(IS_LOGGED_IN_COOKIE, "1", {
      httpOnly: false,
      secure: COOKIE_SECURE,
      sameSite: "lax",
      path: "/",
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });
    return res;
  } catch {
    const res = NextResponse.json(
      { error: "Invalid refresh token" },
      { status: 401 },
    );
    res.cookies.delete(IS_LOGGED_IN_COOKIE);
    return res;
  }
}
