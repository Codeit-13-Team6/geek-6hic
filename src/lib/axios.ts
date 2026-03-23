import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// 응답 인터셉터: 401 시 BFF refresh 시도 후 재요청, 실패 시 로그인으로 이동
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post("/api/auth/refresh", {}, { withCredentials: true });
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        const excludedPaths = ["/login", "/signup", "/oauth/callback"];
        if (
          typeof window !== "undefined" &&
          !excludedPaths.includes(window.location.pathname)
        ) {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
