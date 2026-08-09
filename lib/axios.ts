import axios, { InternalAxiosRequestConfig } from "axios";
import { API_PREFIX, BFF_ROUTES } from "./constants";

export const api = axios.create({
  baseURL: API_PREFIX,
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

    // QUAN TRỌNG:
    // Không được refresh chính request /refresh
    if (originalRequest.url === BFF_ROUTES.AUTH.REFRESH) {
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

      // Refresh thành công
      resolveQueue();

      return api(originalRequest);
    } catch (refreshError) {
      // Refresh thất bại
      rejectQueue(refreshError);

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
