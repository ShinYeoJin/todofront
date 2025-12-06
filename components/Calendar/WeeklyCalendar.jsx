import { useState, useEffect } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CalendarDay from "./CalendarDay";

dayjs.extend(isoWeek);

export default function WeeklyCalendar({ todos, onDateSelect, selectedDate }) {
  // 클라이언트 사이드에서만 현재 날짜 계산 (SSR hydration 불일치 방지)
  const [currentWeek, setCurrentWeek] = useState(null);
  const [today, setToday] = useState(null);

  useEffect(() => {
    // 클라이언트 마운트 후 현재 날짜 설정
    const now = dayjs();
    setCurrentWeek(now.startOf("isoWeek"));
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

  const getTodoCountForDate = (date) => {
    return todos.filter((todo) => dayjs(todo.date).isSame(date, "day")).length;
  };

  const weekDays = getWeekDays();

  // 로딩 중일 때 placeholder 표시
  if (!currentWeek || !today) {
    return (
      <div className="hufflepuff-card p-4 mb-6">
        <div className="flex items-center justify-center h-24">
          <span className="text-hufflepuff-gray dark:text-badger-cream">Loading calendar...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="hufflepuff-card p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentWeek(currentWeek.subtract(1, "week"))}
          className="p-2 rounded-full hover:bg-hufflepuff-light dark:hover:bg-badger-brown transition-colors"
          aria-label="Previous week"
        >
          <ChevronLeft className="text-hufflepuff-gold dark:text-hufflepuff-yellow" size={24} />
        </button>

        <h2 className="font-potter text-xl text-hufflepuff-gold dark:text-hufflepuff-yellow">{currentWeek.format("MMMM YYYY")}</h2>

        <button onClick={() => setCurrentWeek(currentWeek.add(1, "week"))} className="p-2 rounded-full hover:bg-hufflepuff-light dark:hover:bg-badger-brown transition-colors" aria-label="Next week">
          <ChevronRight className="text-hufflepuff-gold dark:text-hufflepuff-yellow" size={24} />
        </button>
      </div>

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
    </div>
  );
}
