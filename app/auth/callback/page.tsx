"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { BFF_ROUTES, PAGES } from "@/lib/constants";
import { api } from "@/lib/axios";
import { Loading } from "@/components/Loading";

interface SetCookieRequest {
  access_token: string;
  refresh_token: string;
}

const setAuthCookies = async (data: SetCookieRequest) => {
  const response = await api.post(BFF_ROUTES.AUTH.SET_COOKIE, data);

  return response.data;
};

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { mutate, isError } = useMutation({
    mutationFn: setAuthCookies,

    onSuccess: () => {
      window.history.replaceState({}, "", PAGES.AUTH_CALLBACK);
      router.replace(PAGES.PROFILE);
    },
  });

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");

    if (!accessToken || !refreshToken) {
      return;
    }

    mutate({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }, [searchParams, mutate]);

  const error =
    !searchParams.get("access_token") || !searchParams.get("refresh_token")
      ? "Missing authentication tokens from Google. Please try signing in again."
      : isError
        ? "Sign-in failed. Please try again."
        : null;

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        {error ? (
          <>
            <p className="text-red-600">{error}</p>

            <a
              href={PAGES.LOGIN}
              className="mt-4 inline-block text-sm text-brand-600 underline"
            >
              Back to sign in
            </a>
          </>
        ) : (
          <div className="flex items-center justify-center text-gray-500">
            <Loading className="size-20" />
          </div>
        )}
      </div>
    </main>
  );
}
