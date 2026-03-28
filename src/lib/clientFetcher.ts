import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api", // ** 모든 요청은 slug 프록시로 향함
  withCredentials: true, // ** 브라우저가 자동으로 쿠키를 실어 보냄
});


axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // auth 관련 요청은 리다이렉트하지 않음 ,
    // users/me 는 유저 정보를 가져오는건데 겹쳐지게 사용하는 부분이 있어서 route단으로 빼던가 하는게 좋을것같다는 생각 일단 미룸
    const SKIP_REDIRECT_PATHS = ["/auth", "/users/me", '/api/hot'];

    const shouldSkipRedirect = SKIP_REDIRECT_PATHS.some((path) =>
      error.config?.url?.startsWith(path),
    );

    // 401 + err.res.code = REFRESH_FAILED 인건 node 단에서 리프레쉬 토큰 갱신 불가거나 없을때 강제로 집어넣은 코드라 바로 로그인으로 떨어뜨림
    if (
      !shouldSkipRedirect &&
      error.response?.status === 401 &&
      error.response?.data?.code === "REFRESH_FAILED"
    ) {
      window.location.href = "/login";
      return new Promise(() => {});
    }

    return Promise.reject(error);
  },
);



export default axiosInstance;

