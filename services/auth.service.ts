import { api } from "@/lib/axios";
import { API_ROUTES } from "@/lib/constants";
import { User } from "@/lib/types";
import { useAccountStore } from "@/store/useAccountStore";

export interface GoogleLoginParams {
  state: string;
  prompt?: string;
  login_hint?: string;
}

export interface GoogleLoginResponse {
  auth_url: string;
}

export const authService = {
  getMe: async (): Promise<User> => {
    const { data } = await api.get<User>(API_ROUTES.USERS.ME);
    return data;
  },

  logout: async (): Promise<void> => {
    await api.post(API_ROUTES.AUTH.LOGOUT);
  },

  refresh: async (): Promise<void> => {
    await api.post(API_ROUTES.AUTH.REFRESH);
  },

  googleLogin: async ({
    state,
    prompt,
    login_hint,
  }: GoogleLoginParams): Promise<GoogleLoginResponse> => {
    const response = await api.get<GoogleLoginResponse>(
      API_ROUTES.AUTH.GOOGLE.LOGIN,
      {
        params: { state, prompt, login_hint },
      },
    );

    let authUrl = response.data.auth_url;
    if (authUrl) {
      try {
        const url = new URL(authUrl);
        if (prompt) url.searchParams.set("prompt", prompt);
        if (login_hint) url.searchParams.set("login_hint", login_hint);
        authUrl = url.toString();
      } catch {
        if (prompt && !authUrl.includes("prompt=")) {
          authUrl +=
            (authUrl.includes("?") ? "&" : "?") +
            `prompt=${encodeURIComponent(prompt)}`;
        }
        if (login_hint && !authUrl.includes("login_hint=")) {
          authUrl +=
            (authUrl.includes("?") ? "&" : "?") +
            `login_hint=${encodeURIComponent(login_hint)}`;
        }
      }
    }

    return { auth_url: authUrl };
  },
};
