import { qKeys } from "@/lib/queryClient";
import { authService } from "@/services/auth.service";
import { useAccountStore } from "@/store/useAccountStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useChannelStore } from "@/store/useChannelStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

let isGuestSession = false;

export function resetGuestSession() {
  isGuestSession = false;
}

export function useCurrentUser() {
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);

  const shouldFetch = !isGuestSession;

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

      // Đồng bộ thông tin user vào account store nếu chưa có
      useAccountStore.getState().addAccount(q.data);
    } else if (q.isError) {
      clearUser();
      isGuestSession = true;

      // Tự động xóa tài khoản đã hết hạn phiên khỏi localStorage & xóa cache kênh
      const activeId = useAccountStore.getState().activeAccountId;
      if (activeId) {
        useAccountStore.getState().removeAccount(activeId);
      }
      useChannelStore.getState().clearAllChannels();
    }
  }, [q.data, q.isError, clearUser, setUser]);

  return {
    ...q,
    data: shouldFetch ? q.data : null,
    isLoading: shouldFetch ? q.isLoading : false,
  };
}
