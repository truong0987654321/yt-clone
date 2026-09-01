import { NextRequest, NextResponse } from "next/server";
import { AxiosError } from "axios";
import { ACCESS_TOKEN_COOKIE, BACKEND_ROUTES } from "@/lib/constants";
import { cookies } from "next/headers";
import { backendApi } from "@/lib/axios";

// GET /api/categories -> Lấy danh sách tất cả danh mục từ Go Backend
export async function GET() {
  try {
    const { data } = await backendApi.get(BACKEND_ROUTES.CATEGORY.GET_ALL);
    return NextResponse.json(data);
  } catch (err) {
    const axiosError = err as AxiosError;
    return NextResponse.json(
      axiosError.response?.data || {
        message: "Failed to fetch categories.",
      },
      { status: axiosError.response?.status || 500 },
    );
  }
}

// POST /api/categories -> Tạo danh mục mới (Truyền token từ cookie nếu có)
export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const body = await req.json();

  try {
    const { data } = await backendApi.post(
      BACKEND_ROUTES.CATEGORY.CREATE,
      body,
      {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      },
    );
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    const axiosError = err as AxiosError;
    return NextResponse.json(
      axiosError.response?.data || { message: "Failed to create category." },
      { status: axiosError.response?.status || 500 },
    );
  }
}
