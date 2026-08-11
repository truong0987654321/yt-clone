import { qKeys } from "@/lib/queryClient";
import { accountService } from "@/services/account.service";
import { authService } from "@/services/auth.service";
import { useAccountStore } from "@/store/useAccountStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useLogout() {
  const queryClient = useQueryClient();
  const clearUser = useAuthStore((s) => s.clearUser);

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: async () => {
      const currentUser = useAuthStore.getState().user;
      let remainingAccount = null;

      if (currentUser?.id) {
        remainingAccount = useAccountStore
          .getState()
          .removeAccount(currentUser.id);
      }

      if (remainingAccount && remainingAccount.tokens?.access_token) {
        await accountService.switchAccount(remainingAccount);
      } else {
        useAccountStore.getState().clearAllAccounts();
        clearUser();
        queryClient.removeQueries({ queryKey: qKeys.currentUser });
      }
      window.location.reload();
    },
  });
}
