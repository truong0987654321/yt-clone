import { api, resetAuthSessionState } from "@/lib/axios";
import { BFF_ROUTES, OAUTH_STATE_KEY } from "@/lib/constants";
import { StoredAccount, useAccountStore } from "@/store/useAccountStore";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "./auth.service";
import { resetGuestSession } from "@/hooks/useCurrentUser";

export const accountService = {
  async switchAccount(acc: StoredAccount) {
    const { tokens, user } = acc;
    if (tokens?.access_token && tokens?.refresh_token) {
      resetAuthSessionState();
      resetGuestSession();
      await api.post(BFF_ROUTES.AUTH.SET_COOKIE, tokens);
      useAccountStore.getState().setActiveAccountId(user.id);
      useAuthStore.getState().setUser(user);

      return user;
    }
  },

  async addAccount() {
    const state = crypto.randomUUID();
    sessionStorage.setItem(OAUTH_STATE_KEY, state);
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
