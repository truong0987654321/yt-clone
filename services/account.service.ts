import { api } from "@/lib/axios";
import { BFF_ROUTES } from "@/lib/constants";
import { StoredAccount, useAccountStore } from "@/store/useAccountStore";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "./auth.service";

export const accountService = {
  async switchAccount(acc: StoredAccount) {
    const { tokens, user } = acc;
    if (tokens?.access_token && tokens?.refresh_token) {
      await api.post(BFF_ROUTES.AUTH.SET_COOKIE, tokens);
      useAccountStore.getState().setActiveAccountId(user.id);
      useAuthStore.getState().setUser(user);

      return user;
    }
  },

  async addAccount() {
    const state = crypto.randomUUID();
    sessionStorage.setItem("oauth_state", state);
    const data = await authService.googleLogin({
      state,
      prompt: "select_account",
    });
    window.location.href = data.auth_url;
  },
  async signOutAll() {
    try {
      await authService.logout();
    } finally {
      useAccountStore.getState().clearAllAccounts();
      useAuthStore.getState().clearUser();
    }
  },
  removeAccount(userId: string) {
    return useAccountStore.getState().removeAccount(userId);
  },
};
