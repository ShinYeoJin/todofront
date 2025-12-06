/**
 * Next.js API 프록시
 * 
 * 프론트엔드와 백엔드 사이의 CORS 문제를 해결하기 위한 프록시 엔드포인트입니다.
 * 모든 /api/proxy/* 요청을 Render에 배포된 백엔드로 전달합니다.
 * 
 * 사용 예시:
 * - /api/proxy/todos → https://todolist-back-fohi.onrender.com/api/todos
 * - /api/proxy/subtasks → https://todolist-back-fohi.onrender.com/api/subtasks
 */

// 백엔드 서버 URL
const BACKEND_URL = "https://todolist-back-fohi.onrender.com/api";

/**
 * API 프록시 핸들러
 * 
 * @param {Object} req - Next.js 요청 객체
 * @param {Object} res - Next.js 응답 객체
 */
export default async function handler(req, res) {
  // URL 경로 추출 (배열을 문자열로 결합)
  const { path } = req.query;
  const targetPath = Array.isArray(path) ? path.join("/") : path;
  const targetUrl = `${BACKEND_URL}/${targetPath}`;

  try {
    // 요청 옵션 설정
    const fetchOptions = {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    // GET, HEAD 요청이 아닌 경우에만 body 추가
    if (req.method !== "GET" && req.method !== "HEAD" && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    // 백엔드로 요청 전달
    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.json();

    // 응답 반환
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ 
      error: "Proxy request failed", 
      message: error.message 
    });
  }
}
