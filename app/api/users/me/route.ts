import { backendApi } from "@/lib/axios";
import { ACCESS_TOKEN_COOKIE, BACKEND_ROUTES } from "@/lib/constants";
import { AxiosError } from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// GET /api/users/me
// Dùng bởi hooks/useCurrentUser.ts (client component qua axios).
// Đây chính là điểm "BFF": client JS không cầm được access_token (httpOnly),
// nên phải nhờ route chạy trên server này đọc cookie giúp rồi gọi hộ Go backend.
export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error_code: "UNAUTHORIZED", message: "Not logged in" },
      { status: 401 },
    );
  }

  try {
    const { data } = await backendApi.get(BACKEND_ROUTES.USERS.ME, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return NextResponse.json(data);
  } catch (err) {
    const axiosError = err as AxiosError;
    const status = axiosError.response?.status || 500;
    const data = axiosError.response?.data ?? {
      error_code: "INTERNAL_ERROR",
      message: "Internal server error",
    };
    return NextResponse.json(data, { status });
  }
}
