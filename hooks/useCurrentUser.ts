import { IS_LOGGED_IN_COOKIE } from "@/lib/constants";
import { qKeys } from "@/lib/queryClient";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

let isGuestSession = false;

export function resetGuestSession() {
  isGuestSession = false;
}

export function useCurrentUser() {
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);

  // Kiểm tra sự tồn tại của cookie is_logged_in trên trình duyệt
  const hasAuthCookie =
    typeof document !== "undefined" &&
    document.cookie.includes(`${IS_LOGGED_IN_COOKIE}=1`);

  const shouldFetch = hasAuthCookie && !isGuestSession;

  const q = useQuery({
    queryKey: qKeys.currentUser,
    queryFn: authService.getMe,
    retry: false,
    enabled: shouldFetch,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (q.data) {
      setUser(q.data);
      isGuestSession = false;
    } else if (q.isError) {
      clearUser();
      isGuestSession = true;
    }
  }, [q.data, q.isError, clearUser, setUser]);

  return {
    ...q,
    data: shouldFetch ? q.data : null,
    isLoading: shouldFetch ? q.isLoading : false,
  };
}
