import { QueryClient } from "@tanstack/react-query";

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 phút - tránh refetch liên tục khi chuyển trang
        retry: 1, // API lỗi thì thử lại 1 lần (401 đã tự xử lý riêng ở axios interceptor)
        refetchOnWindowFocus: false,
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
};
