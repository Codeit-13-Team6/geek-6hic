import axios from "axios";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

const axiosInstance = axios.create({
  baseURL: "/api", // ** 모든 요청은 slug 프록시로 향함
  withCredentials: true, // ** 브라우저가 자동으로 쿠키를 실어 보냄
});

// 1. 요청 인터셉터: 신분증(토큰)을 헤더에 실어주는 비서 역할
axiosInstance.interceptors.request.use((config) => {
  // 로그인, 회원가입 등 토큰이 필요 없는 경로는 패스
  const skipList = ["/auth/login", "/auth/signup"];
  if (skipList.some((url) => config.url?.includes(url))) {
    return config;
  }

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
        // // 서버에 토큰 갱신 요청 (API 검증 단계)
        // const { data } = await axios.post(
        //   `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
        //   { refreshToken },
        // );

        // // 새 토큰 저장
        // setCookie("accessToken", data.accessToken);
        // if (data.refreshToken) setCookie("refreshToken", data.refreshToken);

        // // 실패했던 원래 API 요청을 다시 시도
        // originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        // ** 백엔드가 아닌 우리 BFF의 refresh 주소를 호출합
        // ** 이 요청을 받은 app/api/auth/refresh/route.ts 가 새 쿠키를 구워줌
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

export default axiosInstance;
