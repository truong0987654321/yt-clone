import { QueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 phút - giữ cache
        gcTime: 10 * 60 * 1000, // 10 phút
        retry: (failureCount, error) => {
          // KHÔNG THỬ LẠI các lỗi 401 (Chưa đăng nhập / hết hạn session)
          const axiosErr = error as AxiosError;
          if (axiosErr?.response?.status === 401) {
            return false;
          }
          return failureCount < 1;
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

// Key factory tập trung, tránh mỗi chỗ tự gõ tay mảng key dễ gõ sai/trùng.
export const qKeys = {
  currentUser: ["currentUser"] as const,
  categories: {
    all: ["categories"] as const,
    detail: (id: string) => ["categories", id] as const,
  },
  channels: {
    myChannels: ["myChannels"] as const,
    detail: (id: string) => ["channels", id] as const,
    byHandle: (handle: string) => ["channels", "handle", handle] as const,
  },
};
