/**
 * useTodos 커스텀 훅
 * 
 * Todo와 Subtask 관련 상태 관리 및 CRUD 작업을 처리합니다.
 * 낙관적 업데이트 패턴을 사용하여 빠른 UI 반응을 제공합니다.
 */

import { useState, useEffect, useCallback } from "react";
import axios, { extractData } from "@/utils/api";

export default function useTodos() {
  // ============================================
  // State
  // ============================================
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ============================================
  // 데이터 로드
  // ============================================
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/todos");
        const data = extractData(response);
        if (Array.isArray(data)) {
          setTodos(data);
        }
      } catch (err) {
        console.error("Failed to fetch todos:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  // ============================================
  // Todo 핸들러
  // ============================================
  
  /** Todo 추가 */
  const addTodo = useCallback((newTodo) => {
    setTodos((prev) => [...prev, newTodo]);
  }, []);

  /** Todo 토글 (낙관적 업데이트) */
  const toggleTodo = useCallback(async (id) => {
    const prevTodos = todos;
    setTodos((prev) => prev.map((todo) => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));

    try {
      const response = await axios.patch(`/todos/${id}/toggle`);
      const updated = extractData(response);
      if (updated) {
        setTodos((prev) => prev.map((todo) => (todo.id === id ? updated : todo)));
      }
    } catch (err) {
      console.error("Failed to toggle todo:", err);
      setTodos(prevTodos);
    }
  }, [todos]);

  /** Todo 삭제 (낙관적 업데이트) */
  const deleteTodo = useCallback(async (id) => {
    if (!confirm("🦡 Are you sure you want to delete this task?")) return;

    const prevTodos = todos;
    setTodos((prev) => prev.filter((todo) => todo.id !== id));

    try {
      await axios.delete(`/todos/${id}`);
    } catch (err) {
      console.error("Failed to delete todo:", err);
      setTodos(prevTodos);
    }
  }, [todos]);

  /** Todo 순서 변경 */
  const reorderTodos = useCallback((newTodos) => {
    setTodos(newTodos);
  }, []);

  // ============================================
  // Subtask 핸들러
  // ============================================
  
  /** Subtask 추가 (낙관적 업데이트) */
  const addSubtask = useCallback(async (todoId, subtaskTitle) => {
    const prevTodos = todos;
    const tempId = Date.now();
    const optimisticSubtask = { id: tempId, title: subtaskTitle, completed: false };

    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id === todoId) {
          return { ...todo, subtasks: [...(todo.subtasks || []), optimisticSubtask] };
        }
        return todo;
      })
    );

    try {
      const response = await axios.post("/subtasks", { todoId, title: subtaskTitle });
      const newSubtask = extractData(response);

      if (newSubtask) {
        setTodos((prev) =>
          prev.map((todo) => {
            if (todo.id === todoId) {
              return {
                ...todo,
                subtasks: todo.subtasks.map((s) => (s.id === tempId ? newSubtask : s)),
              };
            }
            return todo;
          })
        );
      }
    } catch (err) {
      console.error("Failed to add subtask:", err);
      setTodos(prevTodos);
    }
  }, [todos]);

  /** Subtask 토글 (낙관적 업데이트) */
  const toggleSubtask = useCallback(async (todoId, subtaskId) => {
    const prevTodos = todos;

    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id === todoId) {
          return {
            ...todo,
            subtasks: todo.subtasks.map((s) =>
              s.id === subtaskId ? { ...s, completed: !s.completed } : s
            ),
          };
        }
        return todo;
      })
    );

    try {
      const response = await axios.patch(`/subtasks/${subtaskId}/toggle`);
      const updatedSubtask = extractData(response);

      if (updatedSubtask) {
        setTodos((prev) =>
          prev.map((todo) => {
            if (todo.id === todoId) {
              return {
                ...todo,
                subtasks: todo.subtasks.map((s) => (s.id === subtaskId ? updatedSubtask : s)),
              };
            }
            return todo;
          })
        );
      }
    } catch (err) {
      console.error("Failed to toggle subtask:", err);
      setTodos(prevTodos);
    }
  }, [todos]);

  /** Subtask 삭제 (낙관적 업데이트) */
  const deleteSubtask = useCallback(async (todoId, subtaskId) => {
    const prevTodos = todos;

    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id === todoId) {
          return { ...todo, subtasks: todo.subtasks.filter((s) => s.id !== subtaskId) };
        }
        return todo;
      })
    );

    try {
      await axios.delete(`/subtasks/${subtaskId}`);
    } catch (err) {
      console.error("Failed to delete subtask:", err);
      setTodos(prevTodos);
    }
  }, [todos]);

  // ============================================
  // 반환
  // ============================================
  return {
    // 상태
    todos,
    isLoading,
    error,
    
    // Todo 핸들러
    addTodo,
    toggleTodo,
    deleteTodo,
    reorderTodos,
    
    // Subtask 핸들러
    addSubtask,
    toggleSubtask,
    deleteSubtask,
  };
}

