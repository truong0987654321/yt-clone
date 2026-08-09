import { qKeys } from "@/lib/queryClient";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/useAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearUser = useAuthStore((s) => s.clearUser);

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      clearUser();
      queryClient.removeQueries({ queryKey: qKeys.currentUser });
      router.refresh();
    },
  });
}
