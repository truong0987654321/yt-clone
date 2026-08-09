import { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
  COOKIE_SECURE,
} from "@/lib/constants";

// POST /api/auth/set-cookie
// Body: { access_token, refresh_token }
// Được gọi từ app/auth/callback/page.tsx (client) ngay sau khi Google login xong.
// httpOnly cookie chỉ set được từ server (Route Handler), không set được từ client JS
// — đây là lý do cần route trung gian này thay vì set cookie thẳng trên trình duyệt.
export async function POST(req: NextRequest) {
  const { access_token, refresh_token } = await req.json();

  if (!access_token || !refresh_token) {
    return NextResponse.json(
      { error: "Missing access token or refresh token" },
      { status: 400 },
    );
  }

  const res = NextResponse.json({ ok: true });

  res.cookies.set(ACCESS_TOKEN_COOKIE, access_token, {
    httpOnly: true,
    secure: COOKIE_SECURE,
    sameSite: "lax",
    path: "/",
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });

  res.cookies.set(REFRESH_TOKEN_COOKIE, refresh_token, {
    httpOnly: true,
    secure: COOKIE_SECURE,
    sameSite: "lax",
    path: "/",
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });

  return res;
}
