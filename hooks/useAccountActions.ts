import { qKeys } from "@/lib/queryClient";
import { accountService } from "@/services/account.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Channel } from "@/lib/types";
import { StoredAccount } from "@/store/useAccountStore";

export function useAccountActions() {
  const queryClient = useQueryClient();

  const switchAccount = useMutation({
    mutationFn: (
      param: StoredAccount | { acc: StoredAccount; targetChannel?: Channel },
    ) => {
      if ("user" in param) {
        return accountService.switchAccount(param);
      }
      return accountService.switchAccount(param.acc, param.targetChannel);
    },

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
