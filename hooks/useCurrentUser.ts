import { qKeys } from "@/lib/queryClient";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export function useCurrentUser() {
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);

  const q = useQuery({
    queryKey: qKeys.currentUser,
    queryFn: authService.getMe,
    retry: false,
  });

  useEffect(() => {
    if (q.data) {
      setUser(q.data);
    } else if (q.isError) {
      clearUser();
    }
  }, [q.data, q.isError, clearUser, setUser]);
  return q;
}
