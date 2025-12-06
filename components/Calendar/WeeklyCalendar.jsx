import { useState, useEffect } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import CalendarDay from "./CalendarDay";

dayjs.extend(isoWeek);

// 한국 공휴일 목록 (2025-2026년) - 이름 포함
const KOREAN_HOLIDAYS = {
  // 2025년
  "2025-01-01": "신정",
  "2025-01-28": "설날",
  "2025-01-29": "설날",
  "2025-01-30": "설날",
  "2025-03-01": "삼일절",
  "2025-05-05": "어린이날",
  "2025-05-06": "부처님오신날",
  "2025-06-06": "현충일",
  "2025-08-15": "광복절",
  "2025-10-03": "개천절",
  "2025-10-05": "추석",
  "2025-10-06": "추석",
  "2025-10-07": "추석",
  "2025-10-08": "대체공휴일",
  "2025-10-09": "한글날",
  "2025-12-25": "크리스마스",
  // 2026년
  "2026-01-01": "신정",
  "2026-02-16": "설날",
  "2026-02-17": "설날",
  "2026-02-18": "설날",
  "2026-03-01": "삼일절",
  "2026-03-02": "대체공휴일",
  "2026-05-05": "어린이날",
  "2026-05-24": "부처님오신날",
  "2026-06-06": "현충일",
  "2026-08-15": "광복절",
  "2026-08-17": "대체공휴일",
  "2026-09-24": "추석",
  "2026-09-25": "추석",
  "2026-09-26": "추석",
  "2026-10-03": "개천절",
  "2026-10-09": "한글날",
  "2026-12-25": "크리스마스",
};

const isHoliday = (date) => {
  const dateStr = dayjs(date).format("YYYY-MM-DD");
  return dateStr in KOREAN_HOLIDAYS;
};

const getHolidayName = (date) => {
  const dateStr = dayjs(date).format("YYYY-MM-DD");
  return KOREAN_HOLIDAYS[dateStr] || null;
};

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
              const isHolidayDate = isHoliday(day);
              const holidayName = getHolidayName(day);

              return (
                <button
                  key={day.format("YYYY-MM-DD")}
                  onClick={() => onDateSelect(day.format("YYYY-MM-DD"))}
                  className={`
                    relative p-1 rounded-lg text-center transition-all min-h-[60px] flex flex-col items-center justify-start
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
                      : (isSunday || isHolidayDate)
                        ? "text-red-500 dark:text-red-400" 
                        : isSaturday 
                          ? "text-blue-500 dark:text-blue-400" 
                          : "text-hufflepuff-black dark:text-hufflepuff-light"
                  }`}>
                    {day.format("D")}
                  </span>
                  {holidayName && (
                    <span className={`text-[9px] leading-tight ${isSelected ? "text-hufflepuff-black" : "text-red-500 dark:text-red-400"}`}>
                      {holidayName}
                    </span>
                  )}
                  {todoCount > 0 && (
                    <span className="absolute bottom-0.5 right-0.5 text-[10px] bg-hufflepuff-gold dark:bg-hufflepuff-yellow text-hufflepuff-black rounded-full w-4 h-4 flex items-center justify-center">
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
