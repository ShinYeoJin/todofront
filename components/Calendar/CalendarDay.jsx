import dayjs from "dayjs";

export default function CalendarDay({ date, todoCount, isSelected, onClick }) {
  const isToday = dayjs().isSame(date, "day");

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
        ${isToday ? "ring-2 ring-hufflepuff-gold" : ""}
      `}
    >
      <span className={`text-xs font-semibold ${isSelected ? "text-hufflepuff-black" : "text-hufflepuff-gray dark:text-badger-cream"}`}>{dayjs(date).format("ddd")}</span>
      <span className={`text-lg font-bold ${isSelected ? "text-hufflepuff-black" : "text-hufflepuff-black dark:text-hufflepuff-yellow"}`}>{dayjs(date).format("DD")}</span>
      <span className="badger-badge mt-1">{todoCount}</span>
    </button>
  );
}
