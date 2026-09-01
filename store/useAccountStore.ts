import { ACCOUNTS_STORAGE_KEY } from "@/lib/constants";
import { User } from "@/lib/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface StoredAccount {
  user: User;
  tokens: {
    access_token: string;
    refresh_token: string;
  };
}

interface AccountState {
  accounts: StoredAccount[];
  activeAccountId: string | null;
  addAccount: (
    user: User,
    tokens: { access_token: string; refresh_token: string },
  ) => void;
  setActiveAccountId: (id: string | null) => void;
  getActiveAccount: () => StoredAccount | null;
  removeAccount: (id: string) => StoredAccount | null;
  clearAllAccounts: () => void;
  updateTokens: (
    id: string,
    tokens: { access_token: string; refresh_token: string },
  ) => void;
}

export const useAccountStore = create<AccountState>()(
  persist(
    (set, get) => ({
      accounts: [],
      activeAccountId: null,

      addAccount: (user, tokens) => {
        set((state) => {
          const existingIndex = state.accounts.findIndex(
            (acc) => acc.user.id === user.id || acc.user.email === user.email,
          );

          const newAccount: StoredAccount = { user, tokens };
          const updatedAccounts = [...state.accounts];

          if (existingIndex >= 0) {
            updatedAccounts[existingIndex] = newAccount;
          } else {
            updatedAccounts.push(newAccount);
          }

          return {
            accounts: updatedAccounts,
            activeAccountId: user.id,
          };
        });
      },

      setActiveAccountId: (id) => {
        set({ activeAccountId: id });
      },

      getActiveAccount: () => {
        const { accounts, activeAccountId } = get();
        if (!activeAccountId) return null;
        return accounts.find((acc) => acc.user.id === activeAccountId) || null;
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
    }),
    {
      name: ACCOUNTS_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
