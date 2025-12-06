/**
 * MonthlyCalendar 컴포넌트
 * 
 * 월간 캘린더 뷰를 렌더링합니다.
 * 한 달의 모든 날짜를 그리드 형태로 표시합니다.
 * 
 * @param {Object} props
 * @param {dayjs.Dayjs} props.currentMonth - 현재 표시 중인 월
 * @param {dayjs.Dayjs} props.today - 오늘 날짜
 * @param {string} props.selectedDate - 선택된 날짜
 * @param {Function} props.onDateSelect - 날짜 선택 핸들러
 * @param {Function} props.getTodoCountForDate - 날짜별 할 일 개수 조회 함수
 */

import dayjs from "dayjs";
import { isHoliday, getHolidayName } from "../../utils/holidays";

export default function MonthlyCalendar({ 
  currentMonth, 
  today, 
  selectedDate, 
  onDateSelect, 
  getTodoCountForDate 
}) {
  // ============================================
  // 월간 날짜 배열 생성
  // - 해당 월의 첫 날이 속한 주의 일요일부터 시작
  // - 6주(42일) 표시
  // ============================================
  const getMonthDays = () => {
    if (!currentMonth) return [];
    
    const startOfMonth = currentMonth.startOf("month");
    const startDay = startOfMonth.day(); // 0 = 일요일
    const firstDayToShow = startOfMonth.subtract(startDay, "day");
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      days.push(firstDayToShow.add(i, "day"));
    }
    return days;
  };

  const monthDays = getMonthDays();

  // ============================================
  // 렌더링
  // ============================================
  return (
    <div>
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1 sm:mb-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
          <div 
            key={`${day}-${idx}`} 
            className={`
              text-center text-[10px] sm:text-xs font-semibold py-0.5 sm:py-1
              ${idx === 0 ? "text-red-500" : idx === 6 ? "text-blue-500" : "text-hufflepuff-gray dark:text-badger-cream"}
            `}
          >
            {/* 데스크톱: 전체 요일명, 모바일: 약어 */}
            <span className="hidden sm:inline">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][idx]}
            </span>
            <span className="sm:hidden">{day}</span>
          </div>
        ))}
      </div>
      
      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
        {monthDays.map((day) => {
          const isCurrentMonth = day.month() === currentMonth.month();
          const isToday = today && today.isSame(day, "day");
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
                relative p-0.5 sm:p-1 rounded-md sm:rounded-lg text-center 
                transition-all min-h-[40px] sm:min-h-[60px] 
                flex flex-col items-center justify-start
                ${isSelected 
                  ? "bg-hufflepuff-gold dark:bg-hufflepuff-yellow text-hufflepuff-black scale-105" 
                  : isCurrentMonth 
                    ? "bg-white dark:bg-hufflepuff-gray hover:bg-hufflepuff-light dark:hover:bg-badger-brown" 
                    : "bg-gray-100 dark:bg-gray-700 opacity-40"
                }
                ${isToday && !isSelected ? "ring-1 sm:ring-2 ring-hufflepuff-gold dark:ring-hufflepuff-yellow" : ""}
              `}
            >
              {/* 날짜 숫자 */}
              <span className={`
                text-xs sm:text-sm font-bold
                ${isSelected 
                  ? "text-hufflepuff-black" 
                  : (isSunday || isHolidayDate)
                    ? "text-red-500 dark:text-red-400" 
                    : isSaturday 
                      ? "text-blue-500 dark:text-blue-400" 
                      : "text-hufflepuff-black dark:text-hufflepuff-light"
                }
              `}>
                {day.format("D")}
              </span>
              
              {/* 공휴일 이름 */}
              {holidayName && (
                <span className={`
                  text-[6px] sm:text-[9px] leading-tight truncate max-w-full
                  ${isSelected ? "text-hufflepuff-black" : "text-red-500 dark:text-red-400"}
                `}>
                  {holidayName}
                </span>
              )}
              
              {/* 할 일 개수 뱃지 */}
              {todoCount > 0 && (
                <span className="
                  absolute bottom-0 right-0 sm:bottom-0.5 sm:right-0.5 
                  text-[8px] sm:text-[10px] 
                  bg-hufflepuff-gold dark:bg-hufflepuff-yellow text-hufflepuff-black 
                  rounded-full w-3 h-3 sm:w-4 sm:h-4 
                  flex items-center justify-center
                ">
                  {todoCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

