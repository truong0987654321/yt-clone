export const API_URL = process.env.API_URL || "http://localhost:8080";
export const PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/**
 * BFF_ROUTES: đường dẫn các Route Handler CỦA CHÍNH Next.js (app/api/...).
 * Đây là nơi DUY NHẤT khai path để gọi (fetch/axios) tới các route này.
 *
 * LƯU Ý QUAN TRỌNG: đổi giá trị ở đây KHÔNG tự đổi route thật. Next.js định
 * tuyến theo TÊN THƯ MỤC (file-based routing) — muốn đổi URL thật của route,
 * phải đổi tên thư mục tương ứng trong app/api/, rồi mới sửa hằng số này cho khớp.
 * Hằng số này chỉ tránh việc gõ tay chuỗi "/api/..." rải rác nhiều nơi khi GỌI.
 *
 * Đã bao gồm sẵn API_PREFIX ("/api") trong từng giá trị — nơi gọi (lib/axios.ts,
 * services/) dùng thẳng giá trị này, KHÔNG cộng thêm prefix nữa (tránh double prefix).
 */
export const API_PREFIX = "/api";
export const BFF_ROUTES = {
  AUTH: {
    GOOGLE: {
      LOGIN: `/auth/google/login`,
      CALLBACK: `/auth/google/callback`,
    },
    REFRESH: `/auth/refresh`,
    LOGOUT: `/auth/logout`,
    SET_COOKIE: `/auth/set-cookie`,
  },
  USERS: {
    ME: `/users/me`,
  },
} as const;

const BACKEND_API_PREFIX = `${API_URL}/api`;
export const BACKEND_ROUTES = {
  AUTH: {
    GOOGLE: {
      LOGIN: `${BACKEND_API_PREFIX}/auth/google/login`,
      CALLBACK: `${BACKEND_API_PREFIX}/auth/google/callback`,
    },
    REFRESH: `${BACKEND_API_PREFIX}/auth/refresh`,
    LOGOUT: `${BACKEND_API_PREFIX}/auth/logout`,
  },
  USERS: {
    ME: `${BACKEND_API_PREFIX}/users/me`,
  },
} as const;

export const PAGES = {
  LOGIN: "/",
  PROFILE: "/",
  DASHBOARD: "/channel",
  AUTH_CALLBACK: "/auth/callback",
};

export const ACCESS_TOKEN_COOKIE = "access_token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";

// Access token backend cấp mặc định 15 phút, để cookie sống hơi lâu hơn 1 chút
// cho an toàn (thực tế phải verify JWT ở backend mỗi request).
export const ACCESS_TOKEN_MAX_AGE = 15 * 60; // 15 phút, tính bằng giây
export const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60; // 30 ngày

export const COOKIE_SECURE = process.env.COOKIE_SECURE === "true";
