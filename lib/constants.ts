const rawApiUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export const API_BASE_URL = rawApiUrl.endsWith("/api")
  ? rawApiUrl
  : `${rawApiUrl.replace(/\/+$/, "")}/api`;

/**
 * AUTH_TOKEN_KEYS: Định nghĩa tập trung tên các tham số Query Parameter & thuộc tính chứa Token.
 * Giúp mã nguồn thống nhất 100%. Khi cần đổi tên (vd: "access_token" -> "token"), chỉ cần sửa ở đây.
 */
export const AUTH_TOKEN_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
} as const;

/**
 * API_ROUTES: Định nghĩa tập trung tất cả các endpoint trực tiếp của Go Backend.
 */
export const API_ROUTES = {
  AUTH: {
    GOOGLE: {
      LOGIN: "/auth/google/login",
      CALLBACK: "/auth/google/callback",
    },
    REFRESH: "/auth/refresh",
    SWITCH: "/auth/switch",
    LOGOUT: "/auth/logout",
  },
  USERS: {
    ME: "/users/me",
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

export const PAGES = {
  LOGIN: "/",
  PROFILE: "/",
  CHANNEL: "/channel",
  AUTH_CALLBACK: "/auth/callback",
  ACCOUNT_ADVANCED: "/account_advanced",
  ACCOUNT: "/account",
};

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

/**
 * Hằng số Prefix dành riêng cho dự án để tạo Key chuẩn cho Cookie, localStorage, sessionStorage.
 */
export const PREFIX_PROJECT = "yt-clone";

export function getProjectKey(keyName: string): string {
  return `${PREFIX_PROJECT}_${keyName}`;
}

export const ACCESS_TOKEN_COOKIE = getProjectKey(AUTH_TOKEN_KEYS.ACCESS_TOKEN);
export const REFRESH_TOKEN_COOKIE = getProjectKey(
  AUTH_TOKEN_KEYS.REFRESH_TOKEN,
);
export const ACCOUNTS_STORAGE_KEY = getProjectKey("accounts_storage");
export const OAUTH_STATE_KEY = getProjectKey("oauth_state");
export const HAS_SEEN_NOTICE_KEY = getProjectKey("has_seen_notice");
export const LANGUAGE_KEY = getProjectKey("language");
export const THEME_KEY = getProjectKey("theme");

export const ACCESS_TOKEN_MAX_AGE = 15 * 60; // 15 phút, tính bằng giây
export const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60; // 30 ngày

export const COOKIE_SECURE = process.env.COOKIE_SECURE === "true";
