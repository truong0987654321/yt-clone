import { NextResponse } from "next/server";
import { AxiosError } from "axios";
import { ACCESS_TOKEN_COOKIE, BACKEND_ROUTES } from "@/lib/constants";
import { cookies } from "next/headers";
import { backendApi } from "@/lib/axios";

// GET /api/channels/me -> Lấy danh sách tất cả các kênh của user đang đăng nhập
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
    const { data } = await backendApi.get(BACKEND_ROUTES.CHANNELS.MY_CHANNELS, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return NextResponse.json(data);
  } catch (err) {
    const axiosError = err as AxiosError;
    return NextResponse.json(
      axiosError.response?.data || {
        message: "Failed to fetch channel information.",
      },
      { status: axiosError.response?.status || 500 },
    );
  }
}
