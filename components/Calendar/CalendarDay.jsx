import dayjs from "dayjs";

export default function CalendarDay({ date, today, todoCount, isSelected, onClick }) {
  // 부모에서 전달받은 today 사용 (클라이언트 사이드 기준)
  const isToday = today ? today.isSame(date, "day") : false;

  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center p-3 rounded-lg border-2 transition-all
        ${
          isSelected
            ? "bg-hufflepuff-gold dark:bg-hufflepuff-yellow border-hufflepuff-black scale-105"
            : "bg-white dark:bg-hufflepuff-gray border-hufflepuff-gold dark:border-hufflepuff-yellow hover:scale-105"
        }
        ${isToday ? "ring-2 ring-hufflepuff-gold dark:ring-hufflepuff-yellow ring-offset-2" : ""}
      `}
    >
      <span className={`text-xs font-semibold ${isSelected ? "text-hufflepuff-black" : "text-hufflepuff-gray dark:text-badger-cream"}`}>{dayjs(date).format("ddd")}</span>
      <span className={`text-lg font-bold ${isSelected ? "text-hufflepuff-black" : "text-hufflepuff-black dark:text-hufflepuff-yellow"}`}>{dayjs(date).format("DD")}</span>
      {isToday && <span className="text-xs text-hufflepuff-gold dark:text-hufflepuff-yellow font-semibold">Today</span>}
      <span className="badger-badge mt-1">{todoCount}</span>
    </button>
  );
}
