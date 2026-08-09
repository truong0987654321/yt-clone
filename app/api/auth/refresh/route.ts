import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE,
  COOKIE_SECURE,
  BACKEND_ROUTES,
} from "@/lib/constants";
import { api } from "@/lib/axios";

// POST /api/auth/refresh
// Gọi khi access token (15 phút) hết hạn. Đọc refresh_token từ cookie,
// gọi backend Go để lấy access token mới, rồi set lại cookie.
export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }
  try {
    const data = await api.post(BACKEND_ROUTES.AUTH.REFRESH, {
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
    return res;
  } catch {
    return NextResponse.json(
      { error: "Invalid refresh token" },
      { status: 401 },
    );
  }
}
