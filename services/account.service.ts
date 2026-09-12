import { api, resetAuthSessionState } from "@/lib/axios";
import { API_ROUTES, OAUTH_STATE_KEY } from "@/lib/constants";
import { StoredAccount, useAccountStore } from "@/store/useAccountStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useChannelStore } from "@/store/useChannelStore";
import { authService } from "./auth.service";
import { resetGuestSession } from "@/hooks/useCurrentUser";

import { Channel } from "@/lib/types";

export const accountService = {
  async switchAccount(acc: StoredAccount, targetChannel?: Channel) {
    const { user, tokens } = acc;
    const refreshToken = tokens?.refresh_token;

    if (!refreshToken) {
      return this.addAccount();
    }

    resetAuthSessionState();
    resetGuestSession();

    try {
      const { data: newTokens } = await api.post(API_ROUTES.AUTH.SWITCH, {
        refresh_token: refreshToken,
      });

      const updatedUser = newTokens.user || user;

      useAccountStore.getState().addAccount(updatedUser, {
        refresh_token: newTokens.refresh_token || refreshToken,
      });
      useAccountStore.getState().setActiveAccountId(updatedUser.id);
      useAuthStore.getState().setUser(updatedUser);

      if (targetChannel) {
        useChannelStore.getState().setActiveChannel(targetChannel);
      } else if (acc.channels && acc.channels.length > 0) {
        useChannelStore.getState().setActiveChannel(acc.channels[0]);
      }

      return updatedUser;
    } catch {
      useAccountStore.getState().removeAccount(user.id);
      useChannelStore.getState().clearAllChannels();
      return this.addAccount();
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
    } catch {
      // Ignore logout errors if session already expired
    } finally {
      useAccountStore.getState().clearAllAccounts();
      useChannelStore.getState().clearAllChannels();
      useAuthStore.getState().clearUser();
    }
  },

  removeAccount(userId: string) {
    return useAccountStore.getState().removeAccount(userId);
  },
};
