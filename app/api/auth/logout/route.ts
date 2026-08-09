import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  BACKEND_ROUTES,
} from "@/lib/constants";

// POST /api/auth/logout
export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (refreshToken) {
    // Thu hồi refresh token ở backend
    try {
      await axios.post(BACKEND_ROUTES.AUTH.LOGOUT, {
        refresh_token: refreshToken,
      });
    } catch {
      // Backend lỗi vẫn tiếp tục xóa cookie
    }
  }

  const res = NextResponse.json({ ok: true });

  res.cookies.delete(ACCESS_TOKEN_COOKIE);
  res.cookies.delete(REFRESH_TOKEN_COOKIE);

  return res;
}
