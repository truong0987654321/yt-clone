import axios, { InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL, API_ROUTES } from "./constants";

// Instance axios kết nối trực tiếp tới Go Backend với withCredentials = true
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type QueueItem = {
  resolve: () => void;
  reject: (error: unknown) => void;
};

let isRefreshing = false;
let pendingQueue: QueueItem[] = [];
let isSessionExpired = false;

export function resetAuthSessionState() {
  isSessionExpired = false;
}

function resolveQueue() {
  pendingQueue.forEach(({ resolve }) => resolve());
  pendingQueue = [];
}

function rejectQueue(error: unknown) {
  pendingQueue.forEach(({ reject }) => reject(error));
  pendingQueue = [];
}

// Response Interceptor: Tự động gọi Go Backend /auth/refresh khi nhận được lỗi 401
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const reqUrl = originalRequest.url || "";

    // Không thử lại nếu chính request này là endpoint refresh
    if (reqUrl.includes("/auth/refresh") || reqUrl.includes("/refresh")) {
      isSessionExpired = true;
      return Promise.reject(error);
    }

    if (isSessionExpired) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      await new Promise<void>((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      });

      return api(originalRequest);
    }

    isRefreshing = true;

    try {
      // Go Backend tự động đọc HttpOnly refresh token cookie và ghi lại HttpOnly access token cookie mới
      await api.post(API_ROUTES.AUTH.REFRESH, {}, { withCredentials: true });

      isSessionExpired = false;
      resolveQueue();

      return api(originalRequest);
    } catch (refreshError) {
      isSessionExpired = true;
      rejectQueue(refreshError);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
