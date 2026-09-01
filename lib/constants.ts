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
  CATEGORY: {
    GET_ALL: "/categories",
    GET_BY_ID: (id: string) => `/categories/${id}`,
    CREATE: "/categories",
    UPDATE: (id: string) => `/categories/${id}`,
    DELETE: (id: string) => `/categories/${id}`,
  },
  CHANNELS: {
    CREATE: "/channels",
    MY_CHANNELS: "/channels/me",
    BY_ID: (id: string) => `/channels/${id}`,
    BY_HANDLE: (handle: string) => `/channels/handle/${handle}`,
  },
} as const;

export const BACKEND_API_PREFIX = `${API_URL}/api`;
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
  CATEGORY: {
    GET_ALL: `${BACKEND_API_PREFIX}/categories`,
    GET_BY_ID: (id: string) => `${BACKEND_API_PREFIX}/categories/${id}`,
    CREATE: `${BACKEND_API_PREFIX}/categories`,
    UPDATE: (id: string) => `${BACKEND_API_PREFIX}/categories/${id}`,
    DELETE: (id: string) => `${BACKEND_API_PREFIX}/categories/${id}`,
  },
  CHANNELS: {
    CREATE: `${BACKEND_API_PREFIX}/channels`,
    MY_CHANNELS: `${BACKEND_API_PREFIX}/channels/me`,
    BY_ID: (id: string) => `${BACKEND_API_PREFIX}/channels/${id}`,
    BY_HANDLE: (handle: string) =>
      `${BACKEND_API_PREFIX}/channels/handle/${handle}`,
  },
} as const;

export const PAGES = {
  LOGIN: "/",
  PROFILE: "/",
  DASHBOARD: "/channel",
  AUTH_CALLBACK: "/auth/callback",
  ACCOUNT_ADVANCED: "/account_advanced",
  ACCOUNT: "/account",
};

/**
 * Hằng số Prefix dành riêng cho dự án để tạo Key chuẩn cho Cookie, localStorage, sessionStorage.
 * Tránh đụng độ dữ liệu giữa các dự án khác nhau cùng chạy trên localhost.
 */
export const PREFIX_PROJECT = "yt-clone";

export function getProjectKey(keyName: string): string {
  return `${PREFIX_PROJECT}:${keyName}`;
}

export const ACCESS_TOKEN_COOKIE = getProjectKey("access_token");
export const REFRESH_TOKEN_COOKIE = getProjectKey("refresh_token");
export const IS_LOGGED_IN_COOKIE = getProjectKey("is_logged_in");
export const ACCOUNTS_STORAGE_KEY = getProjectKey("accounts_storage");
export const OAUTH_STATE_KEY = getProjectKey("oauth_state");
export const HAS_SEEN_NOTICE_KEY = getProjectKey("has_seen_notice");
export const LANGUAGE_KEY = getProjectKey("language");

export const ACCESS_TOKEN_MAX_AGE = 15 * 60; // 15 phút, tính bằng giây
export const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60; // 30 ngày

export const COOKIE_SECURE = process.env.COOKIE_SECURE === "true";
