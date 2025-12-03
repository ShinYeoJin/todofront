import { useState } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CalendarDay from "./CalendarDay";

dayjs.extend(isoWeek);

export default function WeeklyCalendar({ todos, onDateSelect, selectedDate }) {
  const [currentWeek, setCurrentWeek] = useState(dayjs().startOf("isoWeek"));

  const getWeekDays = () => {
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
            todoCount={getTodoCountForDate(day)}
            isSelected={selectedDate && dayjs(selectedDate).isSame(day, "day")}
            onClick={() => onDateSelect(day.format("YYYY-MM-DD"))}
          />
        ))}
      </div>
    </div>
  );
}
