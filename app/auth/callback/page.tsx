"use client";

import { useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { API_ROUTES, AUTH_TOKEN_KEYS, PAGES } from "@/lib/constants";
import { Loading } from "@/components/Loading";
import { useAccountStore } from "@/store/useAccountStore";
import { api, resetAuthSessionState } from "@/lib/axios";
import { useI18n } from "@/i18n/context";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasRun = useRef(false);

  const { t } = useI18n();

  const accessToken = searchParams.get(AUTH_TOKEN_KEYS.ACCESS_TOKEN);
  const refreshToken = searchParams.get(AUTH_TOKEN_KEYS.REFRESH_TOKEN);

  useEffect(() => {
    if (!accessToken || !refreshToken || hasRun.current) {
      return;
    }
    hasRun.current = true;

    async function processCallback() {
      try {
        resetAuthSessionState();

        // Gửi request lấy thông tin người dùng trực tiếp từ Go Backend với token mới
        const { data: user } = await api.get(API_ROUTES.USERS.ME, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (user) {
          useAccountStore.getState().addAccount(user, {
            refresh_token: refreshToken!,
          });
        }
      } catch (err) {
        console.error("Failed to process Google OAuth callback:", err);
      } finally {
        window.history.replaceState({}, "", PAGES.AUTH_CALLBACK);
        router.replace(PAGES.PROFILE);
      }
    }

    processCallback();
  }, [accessToken, refreshToken, router]);

  const error =
    !accessToken || !refreshToken ? t("notice.missingTokens") : null;

  return (
    <div className="text-center">
      {error ? (
        <>
          <p className="text-foreground-error">{error}</p>

          <a
            href={PAGES.LOGIN}
            className="mt-4 inline-block text-sm text-brand-600 underline"
          >
            {t("backToSignIn")}
          </a>
        </>
      ) : (
        <div className="flex items-center justify-center text-foreground">
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
          <div className="flex items-center justify-center">
            <Loading className="size-20" />
          </div>
        }
      >
        <AuthCallbackContent />
      </Suspense>
    </main>
  );
}
