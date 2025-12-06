/**
 * API 유틸리티 모듈
 * 
 * 백엔드 서버와의 통신을 담당하는 axios 인스턴스와 헬퍼 함수를 제공합니다.
 * Next.js API 프록시를 통해 CORS 문제를 우회합니다.
 */

import axios from "axios";

/**
 * Axios 인스턴스 생성
 * - baseURL: Next.js API 프록시 경로 (/api/proxy)
 * - 프록시를 통해 실제 백엔드(Render)로 요청이 전달됩니다.
 */
const instance = axios.create({
  baseURL: "/api/proxy",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * API 응답에서 데이터를 추출하는 헬퍼 함수
 * 
 * 백엔드 응답 형식이 다를 수 있어 두 가지 형식을 모두 처리합니다:
 * 1. { success: true, data: [...] } - data 속성에서 추출
 * 2. [...] 또는 {...} - 직접 반환
 * 
 * @param {Object} response - axios 응답 객체
 * @returns {Array|Object} - 추출된 데이터
 */
export const extractData = (response) => {
  const responseData = response.data;
  
  // { success: true, data: [...] } 형식인 경우
  if (responseData && responseData.data !== undefined) {
    return responseData.data;
  }
  
  // 직접 데이터 반환 형식 (배열 또는 객체)
  return responseData;
};

export default instance;
