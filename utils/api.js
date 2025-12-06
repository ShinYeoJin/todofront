import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://todolist-back-fohi.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 응답에서 데이터를 추출하는 헬퍼 함수
// { data: [...] } 형식이든 직접 [...] 형식이든 모두 처리
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
