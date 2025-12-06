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

// ============================================
// 한국 공휴일 데이터 (2025-2026년)
// - 키: 날짜 (YYYY-MM-DD 형식)
// - 값: 공휴일 이름
// ============================================
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

/**
 * 주어진 날짜가 공휴일인지 확인
 * @param {dayjs.Dayjs} date - 확인할 날짜
 * @returns {boolean} - 공휴일 여부
 */
const isHoliday = (date) => {
  const dateStr = dayjs(date).format("YYYY-MM-DD");
  return dateStr in KOREAN_HOLIDAYS;
};

/**
 * 주어진 날짜의 공휴일 이름 반환
 * @param {dayjs.Dayjs} date - 확인할 날짜
 * @returns {string|null} - 공휴일 이름 또는 null
 */
const getHolidayName = (date) => {
  const dateStr = dayjs(date).format("YYYY-MM-DD");
  return KOREAN_HOLIDAYS[dateStr] || null;
};

export default function CalendarDay({ date, today, todoCount, isSelected, onClick }) {
  // ============================================
  // 날짜 속성 계산
  // ============================================
  const isToday = today ? today.isSame(date, "day") : false;
  const dayOfWeek = dayjs(date).day(); // 0: 일요일, 6: 토요일
  const isSunday = dayOfWeek === 0;
  const isSaturday = dayOfWeek === 6;
  const isHolidayDate = isHoliday(date);
  const holidayName = getHolidayName(date);

  /**
   * 날짜 숫자 색상 결정
   * - 선택됨: 검정색
   * - 일요일/공휴일: 빨간색
   * - 토요일: 파란색
   * - 평일: 기본 색상
   */
  const getDateColor = () => {
    if (isSelected) return "text-hufflepuff-black";
    if (isSunday || isHolidayDate) return "text-red-500 dark:text-red-400";
    if (isSaturday) return "text-blue-500 dark:text-blue-400";
    return "text-hufflepuff-black dark:text-hufflepuff-yellow";
  };

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
      <span className={`text-sm sm:text-lg font-bold ${getDateColor()}`}>
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
