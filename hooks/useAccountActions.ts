import { qKeys } from "@/lib/queryClient";
import { accountService } from "@/services/account.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAccountActions() {
  const queryClient = useQueryClient();

  const switchAccount = useMutation({
    mutationFn: accountService.switchAccount,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: qKeys.currentUser,
      });
      window.location.reload();
    },
  });
  const addAccount = useMutation({
    mutationFn: accountService.addAccount,
  });
  const signOutAll = useMutation({
    mutationFn: accountService.signOutAll,

    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: qKeys.currentUser,
      });
      window.location.reload();
    },
  });
  const removeAccount = (userId: string) => {
    return accountService.removeAccount(userId);
  };
  return { switchAccount, addAccount, signOutAll, removeAccount };
}
