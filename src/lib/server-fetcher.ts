import axios from "axios";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

// [병수]: 서버 컴포넌트에서 요청하는 놈 -> route handler로 간다. X -> 빌드 에러 발생

// [대안]
// 모든 토큰 재발급을 proxy에서만 처리한다.
// proxy는 페이지 접속 전에만 실행된다. -> route handler 전에도 발생
// 페이지 접속 전 + route handler 요청 전 -> refreshToken으로 accessToken 재발급
// 인터셉터 필요없다. proxy로 다 된다.
// 인터셉터는 Next.js 서버측에서 사용하는 것이 안좋다
//
const axiosInstance = axios.create({
  baseURL: "/api", // ** 모든 요청은 slug 프록시로 향함
  withCredentials: true, // ** 브라우저가 자동으로 쿠키를 실어 보냄
});

// 1. 요청 인터셉터: 신분증(토큰)을 헤더에 실어주는 비서 역할
axiosInstance.interceptors.request.use((config) => {
  return config;
});

// 2. 응답 인터셉터: 서버가 "너 신분증 만료됐어(401)"라고 할 때 수습
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config; //실패한 원래 요청 정보 -> 이거 채가오는거

    // 401 에러(인증 실패)가 났고, 아직 재시도를 안 했다면
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; //재시도 중임 알리는 플래그

      const refreshToken = getCookie("refreshToken");

      // 리프레시 토큰이 없으면 그냥 로그아웃 처리
      if (!refreshToken) {
        // 클라이언트 사이드 로그아웃 로직 (예: 쿠키 삭제 및 이동)
        deleteCookie("accessToken");
        deleteCookie("refreshToken");
        if (
          typeof window !== "undefined" &&
          window.location.pathname !== "/login"
        ) {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      try {
        await axios.post("/api/auth/refresh", {}, { withCredentials: true });

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // 리프레시 토큰마저 만료된 경우 (진짜 로그아웃)
        deleteCookie("accessToken");
        deleteCookie("refreshToken");
        if (typeof window !== "undefined") {
          // alert("세션이 만료되었습니다. 다시 로그인해주세요.");
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

const createAxios = () => {};

export default axiosInstance;
