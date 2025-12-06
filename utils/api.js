import axios from "axios";

const instance = axios.create({
  // Next.js API 프록시를 통해 백엔드에 접근 (CORS 문제 해결)
  baseURL: "/api/proxy",
  headers: {
    "Content-Type": "application/json",
  },
});

// 응답에서 데이터를 추출하는 헬퍼 함수
export const extractData = (response) => {
  const responseData = response.data;
  
  // { success: true, data: [...] } 형식
  if (responseData && responseData.data !== undefined) {
    return responseData.data;
  }
  
  // 직접 데이터 반환 형식 (배열 또는 객체)
  return responseData;
};

export default instance;
