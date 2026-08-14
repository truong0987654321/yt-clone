import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import { ACCESS_TOKEN_COOKIE, API_URL, BACKEND_ROUTES } from "@/lib/constants";
import { cookies } from "next/headers";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET /api/categories/[id] -> Lấy thông tin chi tiết 1 danh mục
export async function GET(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  try {
    const { data } = await axios.get(BACKEND_ROUTES.CATEGORY.GET_BY_ID(id));
    return NextResponse.json(data);
  } catch (err) {
    const axiosError = err as AxiosError;
    return NextResponse.json(
      axiosError.response?.data || { message: "Không tìm thấy category" },
      { status: axiosError.response?.status || 500 },
    );
  }
}

// PUT /api/categories/[id] -> Cập nhật danh mục
export async function PUT(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const body = await req.json();

  try {
    const { data } = await axios.put(BACKEND_ROUTES.CATEGORY.UPDATE(id), body, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });
    return NextResponse.json(data);
  } catch (err) {
    const axiosError = err as AxiosError;
    return NextResponse.json(
      axiosError.response?.data || { message: "Cập nhật category thất bại" },
      { status: axiosError.response?.status || 500 },
    );
  }
}

// DELETE /api/categories/[id] -> Xóa danh mục
export async function DELETE(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  try {
    const { data } = await axios.delete(BACKEND_ROUTES.CATEGORY.DELETE(id), {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });
    return NextResponse.json(data);
  } catch (err) {
    const axiosError = err as AxiosError;
    return NextResponse.json(
      axiosError.response?.data || { message: "Xóa category thất bại" },
      { status: axiosError.response?.status || 500 },
    );
  }
}
