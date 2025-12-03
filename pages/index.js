import { useState, useEffect } from "react";
import dayjs from "dayjs";
import Header from "@/components/Layout/Header";
import WeeklyCalendar from "@/components/Calendar/WeeklyCalendar";
import TodoForm from "@/components/Todo/TodoForm";
import TodoList from "@/components/Todo/TodoList";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filter, setFilter] = useState("all"); // 'all', 'completed', 'active'

  // 초기 로드: LocalStorage에서 불러오기
  useEffect(() => {
    const savedTodos = localStorage.getItem("hufflepuff-todos");
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Todos 변경 시 LocalStorage에 저장 (Optimistic UI)
  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem("hufflepuff-todos", JSON.stringify(todos));
    }
  }, [todos]);

  // Todo 추가
  const handleAddTodo = (todoData) => {
    const newTodo = {
      id: Date.now(),
      title: todoData.title,
      date: todoData.date,
      completed: false,
      subtasks: [],
      createdAt: new Date().toISOString(),
    };
    setTodos([...todos, newTodo]);
  };

  // Todo 토글
  const handleToggleTodo = (id) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  };

  // Todo 삭제
  const handleDeleteTodo = (id) => {
    if (confirm("🦡 Are you sure you want to delete this task?")) {
      setTodos(todos.filter((todo) => todo.id !== id));
    }
  };

  // Todo 순서 변경
  const handleReorderTodos = (newTodos) => {
    setTodos(newTodos);
  };

  // Subtask 추가
  const handleAddSubtask = (todoId, subtaskTitle) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === todoId) {
          return {
            ...todo,
            subtasks: [
              ...(todo.subtasks || []),
              {
                id: Date.now(),
                title: subtaskTitle,
                completed: false,
              },
            ],
          };
        }
        return todo;
      })
    );
  };

  // Subtask 토글
  const handleToggleSubtask = (todoId, subtaskId) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === todoId) {
          return {
            ...todo,
            subtasks: todo.subtasks.map((subtask) => (subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask)),
          };
        }
        return todo;
      })
    );
  };

  // Subtask 삭제
  const handleDeleteSubtask = (todoId, subtaskId) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === todoId) {
          return {
            ...todo,
            subtasks: todo.subtasks.filter((subtask) => subtask.id !== subtaskId),
          };
        }
        return todo;
      })
    );
  };

  // 날짜 선택
  const handleDateSelect = (date) => {
    setSelectedDate(selectedDate === date ? null : date);
  };

  // 필터링된 Todos
  const getFilteredTodos = () => {
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
  };

  const filteredTodos = getFilteredTodos();

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <Header />

        <WeeklyCalendar todos={todos} onDateSelect={handleDateSelect} selectedDate={selectedDate} />

        <TodoForm onAddTodo={handleAddTodo} selectedDate={selectedDate} />

        {/* 필터 버튼 */}
        <div className="hufflepuff-card p-4 mb-6 flex gap-3 justify-center">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === "all" ? "bg-hufflepuff-gold text-hufflepuff-black" : "bg-white dark:bg-hufflepuff-gray text-hufflepuff-gray dark:text-badger-cream hover:bg-hufflepuff-light"
            }`}
          >
            All ({todos.length})
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === "active" ? "bg-hufflepuff-gold text-hufflepuff-black" : "bg-white dark:bg-hufflepuff-gray text-hufflepuff-gray dark:text-badger-cream hover:bg-hufflepuff-light"
            }`}
          >
            Active ({todos.filter((t) => !t.completed).length})
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === "completed" ? "bg-hufflepuff-gold text-hufflepuff-black" : "bg-white dark:bg-hufflepuff-gray text-hufflepuff-gray dark:text-badger-cream hover:bg-hufflepuff-light"
            }`}
          >
            Completed ({todos.filter((t) => t.completed).length})
          </button>
        </div>

        {selectedDate && (
          <div className="mb-4 flex items-center justify-between hufflepuff-card p-3">
            <span className="font-semibold text-hufflepuff-gold dark:text-hufflepuff-yellow">📅 Showing tasks for {dayjs(selectedDate).format("MMMM DD, YYYY")}</span>
            <button onClick={() => setSelectedDate(null)} className="text-sm text-hufflepuff-gray dark:text-badger-cream hover:text-hufflepuff-black dark:hover:text-hufflepuff-light">
              Clear filter
            </button>
          </div>
        )}

        <TodoList
          todos={filteredTodos}
          onReorder={handleReorderTodos}
          onToggle={handleToggleTodo}
          onDelete={handleDeleteTodo}
          onAddSubtask={handleAddSubtask}
          onToggleSubtask={handleToggleSubtask}
          onDeleteSubtask={handleDeleteSubtask}
        />
      </div>
    </div>
  );
}
