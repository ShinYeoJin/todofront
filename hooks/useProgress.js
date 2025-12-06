/**
 * useProgress 커스텀 훅
 * 
 * Todo와 Subtask의 진행률 및 카운트를 계산합니다.
 */

import { useMemo } from "react";
import dayjs from "dayjs";

/**
 * @param {Array} todos - 전체 할 일 목록
 * @param {string|null} selectedDate - 선택된 날짜 (YYYY-MM-DD 형식)
 */
export default function useProgress(todos, selectedDate) {
  
  /**
   * 필터 버튼 카운트 계산
   * Todo + Subtask 모두 포함
   */
  const counts = useMemo(() => {
    const todosForCount = selectedDate 
      ? todos.filter((todo) => dayjs(todo.date).isSame(selectedDate, "day")) 
      : todos;
    
    let all = todosForCount.length;
    let active = todosForCount.filter((t) => !t.completed).length;
    let completed = todosForCount.filter((t) => t.completed).length;
    
    // Subtask 카운트 추가
    todosForCount.forEach((todo) => {
      if (todo.subtasks?.length > 0) {
        all += todo.subtasks.length;
        active += todo.subtasks.filter((s) => !s.completed).length;
        completed += todo.subtasks.filter((s) => s.completed).length;
      }
    });

    return { allCount: all, activeCount: active, completedCount: completed };
  }, [todos, selectedDate]);

  /**
   * 전체 진행률 계산 (퍼센트)
   */
  const totalProgress = useMemo(() => {
    let total = todos.length;
    let completed = todos.filter((t) => t.completed).length;
    
    todos.forEach((todo) => {
      if (todo.subtasks?.length > 0) {
        total += todo.subtasks.length;
        completed += todo.subtasks.filter((s) => s.completed).length;
      }
    });

    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }, [todos]);

  /**
   * 선택된 날짜의 진행률 계산 (퍼센트)
   */
  const selectedDateProgress = useMemo(() => {
    if (!selectedDate) return 0;
    
    const dateTodos = todos.filter((todo) => dayjs(todo.date).isSame(selectedDate, "day"));
    let total = dateTodos.length;
    let completed = dateTodos.filter((t) => t.completed).length;
    
    dateTodos.forEach((todo) => {
      if (todo.subtasks?.length > 0) {
        total += todo.subtasks.length;
        completed += todo.subtasks.filter((s) => s.completed).length;
      }
    });

    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }, [todos, selectedDate]);

  return {
    ...counts,
    totalProgress,
    selectedDateProgress,
  };
}

