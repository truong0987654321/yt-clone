import { NextRequest, NextResponse } from "next/server";
import { AxiosError } from "axios";
import { ACCESS_TOKEN_COOKIE, BACKEND_ROUTES } from "@/lib/constants";
import { cookies } from "next/headers";
import { backendApi } from "@/lib/axios";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET /api/channels/[id] -> Chi tiết kênh
export async function GET(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  try {
    const { data } = await backendApi.get(BACKEND_ROUTES.CHANNELS.BY_ID(id));
    return NextResponse.json(data);
  } catch (err) {
    const axiosError = err as AxiosError;
    return NextResponse.json(
      axiosError.response?.data || { message: "Channel not found." },
      { status: axiosError.response?.status || 500 },
    );
  }
}

// PUT /api/channels/[id] -> Cập nhật thông tin kênh
export async function PUT(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
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
    const { data } = await backendApi.put(BACKEND_ROUTES.CHANNELS.BY_ID(id), body, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return NextResponse.json(data);
  } catch (err) {
    const axiosError = err as AxiosError;
    return NextResponse.json(
      axiosError.response?.data || { message: "Failed to update channel." },
      { status: axiosError.response?.status || 500 },
    );
  }
}

// DELETE /api/channels/[id] -> Xóa kênh
export async function DELETE(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error_code: "UNAUTHORIZED", message: "Not logged in" },
      { status: 401 },
    );
  }

  try {
    const { data } = await backendApi.delete(BACKEND_ROUTES.CHANNELS.BY_ID(id), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return NextResponse.json(data);
  } catch (err) {
    const axiosError = err as AxiosError;
    return NextResponse.json(
      axiosError.response?.data || { message: "Failed to delete channel." },
      { status: axiosError.response?.status || 500 },
    );
  }
}
