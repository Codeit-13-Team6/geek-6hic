import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// refresh 중복 호출 방지용 플래그
let isRefreshing = false;
// refresh 완료 후 재시도할 대기 요청 목록
let pendingRequests: Array<() => void> = [];

// 응답 인터셉터: 401 시 BFF refresh 시도 후 재요청, 실패 시 로그인으로 이동
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // 이미 refresh 진행 중이면 대기열에 추가 후 완료 시 재시도
      if (isRefreshing) {
        return new Promise((resolve) => {
          pendingRequests.push(() => resolve(axiosInstance(originalRequest)));
        });
      }

      isRefreshing = true;

      try {
        await axios.post("/api/auth/refresh", {}, { withCredentials: true });

        // 대기 중인 요청 전부 재시도
        pendingRequests.forEach((cb) => cb());
        pendingRequests = [];

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        pendingRequests = [];

        const excludedPaths = ["/login", "/signup", "/oauth/callback"];
        if (
          typeof window !== "undefined" &&
          !excludedPaths.includes(window.location.pathname)
        ) {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
