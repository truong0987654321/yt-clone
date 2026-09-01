import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { BACKEND_ROUTES } from "@/lib/constants";
import { backendApi } from "@/lib/axios";

export async function GET(req: NextRequest) {
  const state = req.nextUrl.searchParams.get("state");
  if (!state) {
    return NextResponse.json(
      {
        error_code: "INVALID_REQUEST",
        message: "Missing OAuth state",
      },
      { status: 400 },
    );
  }

  try {
    const response = await backendApi.get(BACKEND_ROUTES.AUTH.GOOGLE.LOGIN, {
      params: { state },
    });
    return NextResponse.json(response.data, {
      status: response.status,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        error.response?.data ?? {
          error_code: "INTERNAL_SERVER_ERROR",
          message: "Google login failed",
        },
        {
          status: error.response?.status ?? 500,
        },
      );
    }

    return NextResponse.json(
      {
        error_code: "INTERNAL_ERROR",
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
