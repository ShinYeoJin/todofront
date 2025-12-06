/**
 * TodoForm 컴포넌트
 * 
 * 새로운 할 일을 추가하는 폼입니다.
 * 제목과 날짜를 입력받아 백엔드에 전송합니다.
 * 
 * @param {Object} props
 * @param {Function} props.onAddTodo - 할 일 추가 완료 시 호출되는 콜백
 * @param {string} props.selectedDate - 선택된 날짜 (기본값으로 사용)
 */

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import dayjs from "dayjs";
import axios, { extractData } from "../../utils/api";

export default function TodoForm({ onAddTodo, selectedDate }) {
  // ============================================
  // State 관리
  // ============================================
  const [title, setTitle] = useState("");   // 할 일 제목
  const [date, setDate] = useState("");     // 할 일 날짜

  // ============================================
  // 날짜 초기화 및 동기화
  // - 클라이언트 마운트 후 오늘 날짜로 초기화 (SSR 호환)
  // - 상위에서 날짜 선택 시 자동으로 동기화
  // ============================================
  useEffect(() => {
    if (selectedDate) {
      setDate(selectedDate);
    } else {
      setDate(dayjs().format("YYYY-MM-DD"));
    }
  }, [selectedDate]);

  // ============================================
  // 폼 제출 핸들러
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 유효성 검사: 빈 제목 방지
    if (!title.trim()) {
      alert("Please enter a task!");
      return;
    }

    try {
      // 백엔드에 할 일 생성 요청
      const response = await axios.post("/todos", { 
        title: title.trim(), 
        date 
      });
      
      // 응답에서 생성된 할 일 데이터 추출
      const newTodo = extractData(response);
      
      if (newTodo) {
        onAddTodo(newTodo);  // 부모 컴포넌트에 알림
      }
      
      setTitle("");  // 입력 필드 초기화
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  };

  // ============================================
  // 렌더링
  // ============================================
  return (
    <form onSubmit={handleSubmit} className="hufflepuff-card p-3 sm:p-4 mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        
        {/* 제목 입력 필드 */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="
            flex-1 px-3 sm:px-4 py-2 sm:py-3 
            rounded-lg border-2 border-hufflepuff-gold dark:border-hufflepuff-yellow 
            bg-white dark:bg-hufflepuff-gray 
            text-hufflepuff-black dark:text-hufflepuff-light 
            focus:outline-none focus:ring-2 focus:ring-hufflepuff-yellow 
            text-sm sm:text-base
          "
        />

        {/* 날짜 선택 & 추가 버튼 */}
        <div className="flex gap-2 sm:gap-3">
          {/* 날짜 선택 */}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="
              flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-3 
              rounded-lg border-2 border-hufflepuff-gold dark:border-hufflepuff-yellow 
              bg-white dark:bg-hufflepuff-gray 
              text-hufflepuff-black dark:text-hufflepuff-light 
              focus:outline-none focus:ring-2 focus:ring-hufflepuff-yellow 
              text-sm sm:text-base
            "
          />

          {/* 추가 버튼 */}
          <button 
            type="submit" 
            className="
              hufflepuff-btn flex items-center justify-center gap-1 sm:gap-2 
              px-3 sm:px-4 py-2 sm:py-3 
              text-sm sm:text-base whitespace-nowrap
            "
          >
            <Plus size={18} className="sm:w-5 sm:h-5" />
            <span className="hidden xs:inline sm:inline">Add</span>
          </button>
        </div>
      </div>
    </form>
  );
}
