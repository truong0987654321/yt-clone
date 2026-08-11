import { api } from "@/lib/axios";
import { BFF_ROUTES } from "@/lib/constants";
import { User } from "@/lib/types";

export interface GoogleLoginParams {
  state: string;
  prompt?: string;
}

export interface GoogleLoginResponse {
  auth_url: string;
}

/**
 * authService là tầng DUY NHẤT gọi axios cho các thao tác auth.
 * Component/hook không bao giờ gọi axios trực tiếp -> sau này đổi endpoint,
 * đổi cách gửi request, chỉ cần sửa ở đây, không phải lục từng component.
 */
export const authService = {
  getMe: async (): Promise<User> => {
    const { data } = await api.get<User>(BFF_ROUTES.USERS.ME);
    return data;
  },

  logout: async (): Promise<void> => {
    await api.post(BFF_ROUTES.AUTH.LOGOUT);
  },

  refresh: async (): Promise<void> => {
    await api.post(BFF_ROUTES.AUTH.REFRESH);
  },
  googleLogin: async ({
    state,
    prompt,
  }: GoogleLoginParams): Promise<GoogleLoginResponse> => {
    const response = await api.get<GoogleLoginResponse>(
      BFF_ROUTES.AUTH.GOOGLE.LOGIN,
      {
        params: { state, prompt },
      },
    );

    let authUrl = response.data.auth_url;
    if (prompt && authUrl) {
      try {
        const url = new URL(authUrl);
        url.searchParams.set("prompt", prompt);
        authUrl = url.toString();
      } catch {
        if (!authUrl.includes("prompt=")) {
          authUrl +=
            (authUrl.includes("?") ? "&" : "?") +
            `prompt=${encodeURIComponent(prompt)}`;
        }
      }
    }

    return { auth_url: authUrl };
  },
};
