import axios, { InternalAxiosRequestConfig } from "axios";
import { API_PREFIX, BACKEND_API_PREFIX, BFF_ROUTES } from "./constants";

export const api = axios.create({
  baseURL: API_PREFIX,
  withCredentials: true,
});

export const backendApi = axios.create({
  baseURL: BACKEND_API_PREFIX,
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
let isSessionExpired = false; // Flag đánh dấu khi refresh token đã hỏng / chưa đăng nhập

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

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Nếu không phải 401 thì trả lỗi bình thường
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const reqUrl = originalRequest.url || "";

    // Không refresh nếu chính request là endpoint refresh
    if (reqUrl.includes("/auth/refresh") || reqUrl.includes("/refresh")) {
      isSessionExpired = true; // Đã kiểm tra refresh và thất bại -> người dùng chưa đăng nhập
      return Promise.reject(error);
    }

    // Nếu đã biết session hết hạn / khách chưa đăng nhập -> KHÔNG GỬI REQUEST REFRESH NỮA!
    if (isSessionExpired) {
      return Promise.reject(error);
    }

    // Request này đã retry rồi
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // Đang có request khác refresh token
    if (isRefreshing) {
      await new Promise<void>((resolve, reject) => {
        pendingQueue.push({
          resolve,
          reject,
        });
      });

      return api(originalRequest);
    }

    isRefreshing = true;

    try {
      await api.post(BFF_ROUTES.AUTH.REFRESH, null, {
        withCredentials: true,
      });

      // Refresh thành công -> reset trạng thái session
      isSessionExpired = false;
      resolveQueue();

      return api(originalRequest);
    } catch (refreshError) {
      // Refresh thất bại -> Đánh dấu session hết hạn để dừng tất cả request sau ngay lập tức
      isSessionExpired = true;
      rejectQueue(refreshError);

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
