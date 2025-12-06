/**
 * 메인 페이지 컴포넌트
 * 
 * Todo List 앱의 메인 페이지입니다.
 * 캘린더, 진행률, 필터, 할 일 목록을 표시합니다.
 */

import dayjs from "dayjs";

// 컴포넌트
import Header from "@/components/Layout/Header";
import WeeklyCalendar from "@/components/Calendar/WeeklyCalendar";
import TodoList from "@/components/Todo/TodoList";
import ProgressBar from "@/components/Progress/ProgressBar";
import FilterButtons from "@/components/Filter/FilterButtons";

// 커스텀 훅
import useTodos from "@/hooks/useTodos";
import useFilter from "@/hooks/useFilter";
import useProgress from "@/hooks/useProgress";

export default function Home() {
  // ============================================
  // 커스텀 훅 사용
  // ============================================
  
  // Todo & Subtask 상태 관리
  const {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    reorderTodos,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
  } = useTodos();

  // 필터링 로직
  const {
    selectedDate,
    filter,
    filteredTodos,
    setFilter,
    handleDateSelect,
    clearDateFilter,
  } = useFilter(todos);

  // 진행률 계산
  const {
    allCount,
    activeCount,
    completedCount,
    totalProgress,
    selectedDateProgress,
  } = useProgress(todos, selectedDate);

  // ============================================
  // 렌더링
  // ============================================
  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        
        {/* 헤더 */}
        <Header />

        {/* 캘린더 */}
        <WeeklyCalendar 
          todos={todos} 
          onDateSelect={handleDateSelect} 
          selectedDate={selectedDate} 
        />

        {/* 전체 진행률 (날짜 미선택 시) */}
        {!selectedDate && todos.length > 0 && (
          <div className="hufflepuff-card p-4 mb-6">
            <ProgressBar
              title="📊 Overall Progress"
              progress={totalProgress}
              showCongrats={true}
              congratsMessage="🎉 축하합니다! 모든 할 일을 완료했어요! 🎉"
              congratsSubMessage="정말 고생 많았어요! 오늘도 최선을 다한 당신이 자랑스럽습니다! ⭐"
            />
          </div>
        )}

        {/* 필터 버튼 */}
        <FilterButtons
          filter={filter}
          onFilterChange={setFilter}
          allCount={allCount}
          activeCount={activeCount}
          completedCount={completedCount}
        />

        {/* 선택된 날짜 정보 & 진행률 */}
        {selectedDate && (
          <div className="mb-4 hufflepuff-card p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-hufflepuff-gold dark:text-hufflepuff-yellow">
                📅 Showing tasks for {dayjs(selectedDate).format("MMMM DD, YYYY")}
              </span>
              <button 
                onClick={clearDateFilter} 
                className="text-sm text-hufflepuff-gray dark:text-badger-cream hover:text-hufflepuff-black dark:hover:text-hufflepuff-light"
              >
                Clear filter
              </button>
            </div>
            <ProgressBar
              title="📊 Daily Progress"
              progress={selectedDateProgress}
              size="sm"
              showCongrats={true}
              congratsMessage="🎉 오늘 할 일을 모두 완료했어요! 고생 많았어요! 🎉"
            />
          </div>
        )}

        {/* 할 일 목록 */}
        <TodoList
          todos={filteredTodos}
          selectedDate={selectedDate}
          filter={filter}
          onReorder={reorderTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onAddTodo={addTodo}
          onAddSubtask={addSubtask}
          onToggleSubtask={toggleSubtask}
          onDeleteSubtask={deleteSubtask}
        />
      </div>
    </div>
  );
}
