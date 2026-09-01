import { backendApi } from "@/lib/axios";
import { ACCESS_TOKEN_COOKIE, BACKEND_ROUTES } from "@/lib/constants";
import { AxiosError } from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error_code: "UNAUTHORIZED", message: "Not logged in" },
      { status: 401 },
    );
  }

  const body = await req.json();
  try {
    const { data } = await backendApi.post(
      BACKEND_ROUTES.CHANNELS.CREATE,
      body,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    const axiosError = err as AxiosError;
    return NextResponse.json(
      axiosError.response?.data || { message: "Failed to create channel." },
      { status: axiosError.response?.status || 500 },
    );
  }
}
