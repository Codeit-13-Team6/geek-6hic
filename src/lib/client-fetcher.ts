import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api", // ** 모든 요청은 slug 프록시로 향함
  withCredentials: true, // ** 브라우저가 자동으로 쿠키를 실어 보냄
});

export default axiosInstance;
