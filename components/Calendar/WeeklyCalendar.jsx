/**
 * WeeklyCalendar 컴포넌트
 * 
 * 주간/월간 캘린더 뷰를 제공합니다.
 * 타이틀 클릭으로 주간/월간 뷰 전환이 가능합니다.
 * 
 * @param {Object} props
 * @param {Array} props.todos - 할 일 목록 (날짜별 카운트 계산용)
 * @param {Function} props.onDateSelect - 날짜 선택 핸들러
 * @param {string} props.selectedDate - 현재 선택된 날짜
 */

import { useState, useEffect } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

import CalendarDay from "./CalendarDay";
import MonthlyCalendar from "./MonthlyCalendar";

dayjs.extend(isoWeek);

export default function WeeklyCalendar({ todos, onDateSelect, selectedDate }) {
  // ============================================
  // State 관리
  // ============================================
  const [currentWeek, setCurrentWeek] = useState(null);    // 현재 주
  const [currentMonth, setCurrentMonth] = useState(null);  // 현재 월
  const [today, setToday] = useState(null);                // 오늘 날짜
  const [viewMode, setViewMode] = useState("week");        // 뷰 모드 ("week" | "month")

  // ============================================
  // 초기화 (클라이언트 사이드)
  // SSR hydration 불일치 방지를 위해 useEffect에서 초기화
  // ============================================
  useEffect(() => {
    const now = dayjs();
    setCurrentWeek(now.startOf("isoWeek"));
    setCurrentMonth(now.startOf("month"));
    setToday(now);
  }, []);

  // ============================================
  // 주간 날짜 배열 생성
  // ============================================
  const getWeekDays = () => {
    if (!currentWeek) return [];
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(currentWeek.add(i, "day"));
    }
    return days;
  };

  // ============================================
  // 날짜별 할 일 개수 조회
  // ============================================
  const getTodoCountForDate = (date) => {
    return todos.filter((todo) => dayjs(todo.date).isSame(date, "day")).length;
  };

  // ============================================
  // 네비게이션 핸들러
  // ============================================
  const handlePrev = () => {
    if (viewMode === "week") {
      setCurrentWeek(currentWeek.subtract(1, "week"));
    } else {
      setCurrentMonth(currentMonth.subtract(1, "month"));
    }
  };

  const handleNext = () => {
    if (viewMode === "week") {
      setCurrentWeek(currentWeek.add(1, "week"));
    } else {
      setCurrentMonth(currentMonth.add(1, "month"));
    }
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "week" ? "month" : "week");
  };

  // ============================================
  // 로딩 상태
  // ============================================
  if (!currentWeek || !currentMonth || !today) {
    return (
      <div className="hufflepuff-card p-4 mb-6">
        <div className="flex items-center justify-center h-24">
          <span className="text-hufflepuff-gray dark:text-badger-cream">Loading calendar...</span>
        </div>
      </div>
    );
  }

  const weekDays = getWeekDays();
  const displayDate = viewMode === "week" ? currentWeek : currentMonth;

  // ============================================
  // 렌더링
  // ============================================
  return (
    <div className="hufflepuff-card p-3 sm:p-4 mb-4 sm:mb-6">
      {/* 헤더: 네비게이션 & 뷰 전환 */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        {/* 이전 버튼 */}
        <button
          onClick={handlePrev}
          className="p-1.5 sm:p-2 rounded-full hover:bg-hufflepuff-light dark:hover:bg-badger-brown transition-colors"
          aria-label={viewMode === "week" ? "Previous week" : "Previous month"}
        >
          <ChevronLeft className="text-hufflepuff-gold dark:text-hufflepuff-yellow w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* 타이틀 (클릭하면 뷰 전환) */}
        <button 
          onClick={toggleViewMode}
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-hufflepuff-light dark:hover:bg-badger-brown transition-colors"
        >
          <Calendar className="text-hufflepuff-gold dark:text-hufflepuff-yellow w-4 h-4 sm:w-5 sm:h-5" />
          <h2 className="font-potter text-base sm:text-xl text-hufflepuff-gold dark:text-hufflepuff-yellow">
            {displayDate.format("MMM YYYY")}
          </h2>
        </button>

        {/* 다음 버튼 */}
        <button 
          onClick={handleNext} 
          className="p-1.5 sm:p-2 rounded-full hover:bg-hufflepuff-light dark:hover:bg-badger-brown transition-colors" 
          aria-label={viewMode === "week" ? "Next week" : "Next month"}
        >
          <ChevronRight className="text-hufflepuff-gold dark:text-hufflepuff-yellow w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* 뷰 모드 표시 */}
      <div className="flex justify-center mb-2 sm:mb-3">
        <span className="text-[10px] sm:text-xs text-hufflepuff-gray dark:text-badger-cream px-2 sm:px-3 py-1 bg-hufflepuff-light dark:bg-badger-brown rounded-full">
          {viewMode === "week" ? "📅 Weekly" : "📆 Monthly"} (tap to switch)
        </span>
      </div>

      {/* 캘린더 뷰 */}
      {viewMode === "week" ? (
        // 주간 뷰
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => (
            <CalendarDay
              key={day.format("YYYY-MM-DD")}
              date={day}
              today={today}
              todoCount={getTodoCountForDate(day)}
              isSelected={selectedDate && dayjs(selectedDate).isSame(day, "day")}
              onClick={() => onDateSelect(day.format("YYYY-MM-DD"))}
            />
          ))}
        </div>
      ) : (
        // 월간 뷰
        <MonthlyCalendar
          currentMonth={currentMonth}
          today={today}
          selectedDate={selectedDate}
          onDateSelect={onDateSelect}
          getTodoCountForDate={getTodoCountForDate}
        />
      )}
    </div>
  );
}
