/**
 * CalendarDay 컴포넌트
 * 
 * 캘린더의 개별 날짜 셀을 렌더링합니다.
 * 주간 뷰에서 사용되며, 날짜별 할 일 개수와 공휴일 정보를 표시합니다.
 * 
 * @param {Object} props
 * @param {dayjs.Dayjs} props.date - 표시할 날짜
 * @param {dayjs.Dayjs} props.today - 오늘 날짜 (하이라이트용)
 * @param {number} props.todoCount - 해당 날짜의 할 일 개수
 * @param {boolean} props.isSelected - 선택된 날짜 여부
 * @param {Function} props.onClick - 클릭 핸들러
 */

import dayjs from "dayjs";
import { isHoliday, getHolidayName, getDateColorClass } from "../../utils/holidays";

export default function CalendarDay({ date, today, todoCount, isSelected, onClick }) {
  // ============================================
  // 날짜 속성 계산
  // ============================================
  const isToday = today ? today.isSame(date, "day") : false;
  const holidayName = getHolidayName(date);
  const dateColorClass = getDateColorClass(date, isSelected);

  // ============================================
  // 렌더링
  // ============================================
  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center p-1 sm:p-2 rounded-lg border-2 
        transition-all min-h-[70px] sm:min-h-[90px]
        ${isSelected
          ? "bg-hufflepuff-gold dark:bg-hufflepuff-yellow border-hufflepuff-black scale-105"
          : "bg-white dark:bg-hufflepuff-gray border-hufflepuff-gold dark:border-hufflepuff-yellow hover:scale-105"
        }
        ${isToday ? "ring-2 ring-hufflepuff-gold dark:ring-hufflepuff-yellow ring-offset-1 sm:ring-offset-2" : ""}
      `}
    >
      {/* 요일 (Mon, Tue, ...) */}
      <span className={`
        text-[10px] sm:text-xs font-semibold
        ${isSelected ? "text-hufflepuff-black" : "text-hufflepuff-gray dark:text-badger-cream"}
      `}>
        {dayjs(date).format("ddd")}
      </span>
      
      {/* 날짜 숫자 */}
      <span className={`text-sm sm:text-lg font-bold ${dateColorClass}`}>
        {dayjs(date).format("DD")}
      </span>
      
      {/* 공휴일 이름 */}
      {holidayName && (
        <span className={`
          text-[8px] sm:text-[10px] leading-tight
          ${isSelected ? "text-hufflepuff-black" : "text-red-500 dark:text-red-400"}
        `}>
          {holidayName}
        </span>
      )}
      
      {/* Today 표시 */}
      {isToday && (
        <span className="text-[8px] sm:text-[10px] text-hufflepuff-gold dark:text-hufflepuff-yellow font-semibold">
          Today
        </span>
      )}
      
      {/* 할 일 개수 뱃지 */}
      <span className="badger-badge mt-0.5 sm:mt-1 text-[10px] sm:text-xs">
        {todoCount}
      </span>
    </button>
  );
}
