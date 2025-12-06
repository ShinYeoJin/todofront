/**
 * useFilter 커스텀 훅
 * 
 * Todo 목록 필터링 로직을 관리합니다.
 */

import { useState, useMemo, useCallback } from "react";
import dayjs from "dayjs";

/**
 * @param {Array} todos - 전체 할 일 목록
 */
export default function useFilter(todos) {
  // ============================================
  // State
  // ============================================
  const [selectedDate, setSelectedDate] = useState(null);  // 선택된 날짜
  const [filter, setFilter] = useState("all");              // 필터 상태 ('all', 'active', 'completed')

  // ============================================
  // 핸들러
  // ============================================
  
  /** 날짜 선택/해제 토글 */
  const handleDateSelect = useCallback((date) => {
    setSelectedDate((prev) => (prev === date ? null : date));
  }, []);

  /** 날짜 선택 해제 */
  const clearDateFilter = useCallback(() => {
    setSelectedDate(null);
  }, []);

  // ============================================
  // 필터링된 Todos
  // ============================================
  const filteredTodos = useMemo(() => {
    let filtered = todos;

    // 날짜 필터
    if (selectedDate) {
      filtered = filtered.filter((todo) => dayjs(todo.date).isSame(selectedDate, "day"));
    }

    // 완료 상태 필터
    if (filter === "completed") {
      filtered = filtered.filter((todo) => todo.completed);
    } else if (filter === "active") {
      filtered = filtered.filter((todo) => !todo.completed);
    }

    return filtered;
  }, [todos, selectedDate, filter]);

  return {
    // 상태
    selectedDate,
    filter,
    filteredTodos,
    
    // 핸들러
    setFilter,
    handleDateSelect,
    clearDateFilter,
  };
}

