"use client";

import { useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { BFF_ROUTES, PAGES } from "@/lib/constants";
import { api } from "@/lib/axios";
import { Loading } from "@/components/Loading";
import { authService } from "@/services/auth.service";
import { useAccountStore } from "@/store/useAccountStore";

interface SetCookieRequest {
  access_token: string;
  refresh_token: string;
}

const setAuthCookies = async (data: SetCookieRequest) => {
  const response = await api.post(BFF_ROUTES.AUTH.SET_COOKIE, data);

  return response.data;
};

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasRun = useRef(false);

  const { mutate, isError } = useMutation({
    mutationFn: setAuthCookies,

    onSuccess: async (_, variables) => {
      try {
        const user = await authService.getMe();
        if (user) {
          useAccountStore.getState().addAccount(user, {
            access_token: variables.access_token,
            refresh_token: variables.refresh_token,
          });
        }
      } catch (err) {
        console.error("Failed to fetch user on callback:", err);
      } finally {
        window.history.replaceState({}, "", PAGES.AUTH_CALLBACK);
        router.replace(PAGES.PROFILE);
      }
    },
  });

  const accessToken = searchParams.get("access_token");
  const refreshToken = searchParams.get("refresh_token");

  useEffect(() => {
    if (!accessToken || !refreshToken || hasRun.current) {
      return;
    }
    hasRun.current = true;

    mutate({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }, [accessToken, refreshToken, mutate]);

  const error =
    !accessToken || !refreshToken
      ? "Missing authentication tokens from Google. Please try signing in again."
      : isError
        ? "Sign-in failed. Please try again."
        : null;

  return (
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
  );
}

export default function AuthCallbackPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Suspense
        fallback={
          <div className="flex items-center justify-center text-gray-500">
            <Loading className="size-20" />
          </div>
        }
      >
        <AuthCallbackContent />
      </Suspense>
    </main>
  );
}
