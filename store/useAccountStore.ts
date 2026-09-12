import { ACCOUNTS_STORAGE_KEY } from "@/lib/constants";
import { Channel, User } from "@/lib/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface StoredAccount {
  user: User;
  tokens?: {
    refresh_token?: string;
  };
  channels?: Channel[];
  activeChannelId?: string | null;
}

interface AccountState {
  accounts: StoredAccount[];
  activeAccountId: string | null;
  addAccount: (user: User, tokens?: { refresh_token?: string }) => void;
  setActiveAccountId: (id: string | null) => void;
  getActiveAccount: () => StoredAccount | null;
  removeAccount: (id: string) => StoredAccount | null;
  clearAllAccounts: () => void;
  updateTokens: (
    id: string,
    tokens: { access_token: string; refresh_token: string },
  ) => void;
  updateAccountChannels: (userId: string, channels: Channel[]) => void;
  setAccountActiveChannelId: (userId: string, channelId: string | null) => void;
}

/**
 * Rút gọn thông tin User chỉ giữ lại các trường tối thiểu cần thiết
 * để hiển thị UI chuyển đổi tài khoản (thẻ avatar, tên, email) và bảo mật dữ liệu trong localStorage.
 */
function sanitizeUser(user: User): User {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar_url: user.avatar_url,
    created_at: "",
    updated_at: "",
  };
}

function getInitialAccountState(): {
  accounts: StoredAccount[];
  activeAccountId: string | null;
} {
  if (typeof window === "undefined") {
    return { accounts: [], activeAccountId: null };
  }
  try {
    const rawAcc = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (rawAcc) {
      const parsed = JSON.parse(rawAcc);
      return {
        accounts: parsed?.state?.accounts || [],
        activeAccountId: parsed?.state?.activeAccountId || null,
      };
    }
  } catch {
    // ignore
  }
  return { accounts: [], activeAccountId: null };
}

const initialAccountState = getInitialAccountState();

export const useAccountStore = create<AccountState>()(
  persist(
    (set, get) => ({
      accounts: initialAccountState.accounts,
      activeAccountId: initialAccountState.activeAccountId,

      addAccount: (user, tokens) => {
        set((state) => {
          const cleanUser = sanitizeUser(user);
          const existingIndex = state.accounts.findIndex(
            (acc) =>
              acc.user.id === cleanUser.id ||
              acc.user.email === cleanUser.email,
          );

          const existingAccount =
            existingIndex >= 0 ? state.accounts[existingIndex] : null;
          const mergedTokens = tokens || existingAccount?.tokens;

          const newAccount: StoredAccount = {
            user: cleanUser,
            tokens: mergedTokens,
            channels: existingAccount?.channels,
            activeChannelId: existingAccount?.activeChannelId || null,
          };
          const updatedAccounts = [...state.accounts];

          if (existingIndex >= 0) {
            updatedAccounts[existingIndex] = newAccount;
          } else {
            updatedAccounts.push(newAccount);
          }

          return {
            accounts: updatedAccounts,
            activeAccountId: cleanUser.id,
          };
        });
      },

      setActiveAccountId: (id) => {
        set({ activeAccountId: id });
      },

      getActiveAccount: () => {
        const { accounts, activeAccountId } = get();
        if (!activeAccountId) return null;
        return accounts.find((a) => a.user.id === activeAccountId) || null;
      },

      removeAccount: (id) => {
        let remainingAccount: StoredAccount | null = null;
        set((state) => {
          const updatedAccounts = state.accounts.filter(
            (acc) => acc.user.id !== id,
          );
          let newActiveId = state.activeAccountId;

          if (state.activeAccountId === id) {
            if (updatedAccounts.length > 0) {
              newActiveId = updatedAccounts[0].user.id;
              remainingAccount = updatedAccounts[0];
            } else {
              newActiveId = null;
            }
          }

          return {
            accounts: updatedAccounts,
            activeAccountId: newActiveId,
          };
        });

        return remainingAccount;
      },

      clearAllAccounts: () => {
        set({ accounts: [], activeAccountId: null });
      },

      updateTokens: (id, tokens) => {
        set((state) => ({
          accounts: state.accounts.map((acc) =>
            acc.user.id === id ? { ...acc, tokens } : acc,
          ),
        }));
      },

      updateAccountChannels: (userId, channels) => {
        set((state) => ({
          accounts: state.accounts.map((acc) =>
            acc.user.id === userId ? { ...acc, channels } : acc,
          ),
        }));
      },

      setAccountActiveChannelId: (userId, channelId) => {
        set((state) => ({
          accounts: state.accounts.map((acc) =>
            acc.user.id === userId
              ? { ...acc, activeChannelId: channelId }
              : acc,
          ),
        }));
      },
    }),
    {
      name: ACCOUNTS_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      // Cấu hình partialize: Lưu activeAccountId, User tối thiểu, refresh_token, channels và activeChannelId
      partialize: (state) => ({
        activeAccountId: state.activeAccountId,
        accounts: state.accounts.map((acc) => ({
          user: sanitizeUser(acc.user),
          tokens: acc.tokens?.refresh_token
            ? { refresh_token: acc.tokens.refresh_token }
            : undefined,
          channels: acc.channels,
          activeChannelId: acc.activeChannelId || null,
        })),
      }),
    },
  ),
);
