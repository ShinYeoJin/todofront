import { useState, useEffect } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import CalendarDay from "./CalendarDay";

dayjs.extend(isoWeek);

export default function WeeklyCalendar({ todos, onDateSelect, selectedDate }) {
  // 클라이언트 사이드에서만 현재 날짜 계산 (SSR hydration 불일치 방지)
  const [currentWeek, setCurrentWeek] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(null);
  const [today, setToday] = useState(null);
  const [viewMode, setViewMode] = useState("week"); // "week" or "month"

  useEffect(() => {
    // 클라이언트 마운트 후 현재 날짜 설정
    const now = dayjs();
    setCurrentWeek(now.startOf("isoWeek"));
    setCurrentMonth(now.startOf("month"));
    setToday(now);
  }, []);

  const getWeekDays = () => {
    if (!currentWeek) return [];
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(currentWeek.add(i, "day"));
    }
    return days;
  };

  const getMonthDays = () => {
    if (!currentMonth) return [];
    const days = [];
    const startOfMonth = currentMonth.startOf("month");
    const endOfMonth = currentMonth.endOf("month");
    
    // 월의 첫 주 시작일 (일요일 기준)
    const startDay = startOfMonth.day(); // 0 = 일요일
    const firstDayToShow = startOfMonth.subtract(startDay, "day");
    
    // 6주 * 7일 = 42일 표시
    for (let i = 0; i < 42; i++) {
      days.push(firstDayToShow.add(i, "day"));
    }
    return days;
  };

  const getTodoCountForDate = (date) => {
    return todos.filter((todo) => dayjs(todo.date).isSame(date, "day")).length;
  };

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

  const weekDays = getWeekDays();
  const monthDays = getMonthDays();

  // 로딩 중일 때 placeholder 표시
  if (!currentWeek || !currentMonth || !today) {
    return (
      <div className="hufflepuff-card p-4 mb-6">
        <div className="flex items-center justify-center h-24">
          <span className="text-hufflepuff-gray dark:text-badger-cream">Loading calendar...</span>
        </div>
      </div>
    );
  }

  const displayDate = viewMode === "week" ? currentWeek : currentMonth;

  return (
    <div className="hufflepuff-card p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrev}
          className="p-2 rounded-full hover:bg-hufflepuff-light dark:hover:bg-badger-brown transition-colors"
          aria-label={viewMode === "week" ? "Previous week" : "Previous month"}
        >
          <ChevronLeft className="text-hufflepuff-gold dark:text-hufflepuff-yellow" size={24} />
        </button>

        <button 
          onClick={toggleViewMode}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-hufflepuff-light dark:hover:bg-badger-brown transition-colors"
        >
          <Calendar className="text-hufflepuff-gold dark:text-hufflepuff-yellow" size={20} />
          <h2 className="font-potter text-xl text-hufflepuff-gold dark:text-hufflepuff-yellow">
            {displayDate.format("MMMM YYYY")}
          </h2>
        </button>

        <button 
          onClick={handleNext} 
          className="p-2 rounded-full hover:bg-hufflepuff-light dark:hover:bg-badger-brown transition-colors" 
          aria-label={viewMode === "week" ? "Next week" : "Next month"}
        >
          <ChevronRight className="text-hufflepuff-gold dark:text-hufflepuff-yellow" size={24} />
        </button>
      </div>

      {/* 뷰 모드 표시 */}
      <div className="flex justify-center mb-3">
        <span className="text-xs text-hufflepuff-gray dark:text-badger-cream px-3 py-1 bg-hufflepuff-light dark:bg-badger-brown rounded-full">
          {viewMode === "week" ? "📅 Weekly View" : "📆 Monthly View"} (click title to switch)
        </span>
      </div>

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
        <div>
          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, idx) => (
              <div 
                key={day} 
                className={`text-center text-xs font-semibold py-1 ${
                  idx === 0 ? "text-red-500" : idx === 6 ? "text-blue-500" : "text-hufflepuff-gray dark:text-badger-cream"
                }`}
              >
                {day}
              </div>
            ))}
          </div>
          
          {/* 날짜 그리드 */}
          <div className="grid grid-cols-7 gap-1">
            {monthDays.map((day) => {
              const isCurrentMonth = day.month() === currentMonth.month();
              const isToday = today.isSame(day, "day");
              const isSelected = selectedDate && dayjs(selectedDate).isSame(day, "day");
              const todoCount = getTodoCountForDate(day);
              const dayOfWeek = day.day();
              const isSunday = dayOfWeek === 0;
              const isSaturday = dayOfWeek === 6;

              return (
                <button
                  key={day.format("YYYY-MM-DD")}
                  onClick={() => onDateSelect(day.format("YYYY-MM-DD"))}
                  className={`
                    relative p-2 rounded-lg text-center transition-all min-h-[50px]
                    ${isSelected 
                      ? "bg-hufflepuff-gold dark:bg-hufflepuff-yellow text-hufflepuff-black scale-105" 
                      : isCurrentMonth 
                        ? "bg-white dark:bg-hufflepuff-gray hover:bg-hufflepuff-light dark:hover:bg-badger-brown" 
                        : "bg-gray-100 dark:bg-gray-700 opacity-40"
                    }
                    ${isToday && !isSelected ? "ring-2 ring-hufflepuff-gold dark:ring-hufflepuff-yellow" : ""}
                  `}
                >
                  <span className={`text-sm font-bold ${
                    isSelected 
                      ? "text-hufflepuff-black" 
                      : isSunday 
                        ? "text-red-500 dark:text-red-400" 
                        : isSaturday 
                          ? "text-blue-500 dark:text-blue-400" 
                          : "text-hufflepuff-black dark:text-hufflepuff-light"
                  }`}>
                    {day.format("D")}
                  </span>
                  {todoCount > 0 && (
                    <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs bg-hufflepuff-gold dark:bg-hufflepuff-yellow text-hufflepuff-black rounded-full w-5 h-5 flex items-center justify-center">
                      {todoCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
