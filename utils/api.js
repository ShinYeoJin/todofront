import axios from "axios";

const instance = axios.create({
  // 기본값은 Render 배포 백엔드 URL로 설정
  // 로컬 개발 시에는 NEXT_PUBLIC_API_URL 환경 변수로 오버라이드 가능 (예: http://localhost:5001/api)
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://todolist-back-fohi.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 응답 정규화: { data: [...] } 또는 [...] 형식 모두 처리
instance.interceptors.response.use(
  (response) => {
    // 배열이 직접 반환된 경우 { data: [...] } 형식으로 변환
    if (Array.isArray(response.data)) {
      response.data = { data: response.data };
    }
    // 단일 객체가 반환되고 data 속성이 없는 경우
    else if (response.data && typeof response.data === "object" && !response.data.data && response.data.id) {
      response.data = { data: response.data };
    }
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default instance;

