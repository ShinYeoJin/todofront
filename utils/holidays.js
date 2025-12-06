/**
 * 한국 공휴일 데이터 모듈
 * 
 * 캘린더 컴포넌트들에서 공통으로 사용하는 공휴일 데이터와 유틸리티 함수를 제공합니다.
 */

import dayjs from "dayjs";

// ============================================
// 한국 공휴일 데이터 (2025-2026년)
// - 키: 날짜 (YYYY-MM-DD 형식)
// - 값: 공휴일 이름
// ============================================
export const KOREAN_HOLIDAYS = {
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
 * @param {dayjs.Dayjs|string|Date} date - 확인할 날짜
 * @returns {boolean} - 공휴일 여부
 */
export const isHoliday = (date) => {
  const dateStr = dayjs(date).format("YYYY-MM-DD");
  return dateStr in KOREAN_HOLIDAYS;
};

/**
 * 주어진 날짜의 공휴일 이름 반환
 * @param {dayjs.Dayjs|string|Date} date - 확인할 날짜
 * @returns {string|null} - 공휴일 이름 또는 null
 */
export const getHolidayName = (date) => {
  const dateStr = dayjs(date).format("YYYY-MM-DD");
  return KOREAN_HOLIDAYS[dateStr] || null;
};

/**
 * 날짜의 색상 클래스 반환
 * @param {dayjs.Dayjs} date - 날짜
 * @param {boolean} isSelected - 선택 여부
 * @returns {string} - Tailwind CSS 클래스
 */
export const getDateColorClass = (date, isSelected = false) => {
  if (isSelected) return "text-hufflepuff-black";
  
  const dayOfWeek = dayjs(date).day();
  const isSunday = dayOfWeek === 0;
  const isSaturday = dayOfWeek === 6;
  const isHolidayDate = isHoliday(date);
  
  if (isSunday || isHolidayDate) return "text-red-500 dark:text-red-400";
  if (isSaturday) return "text-blue-500 dark:text-blue-400";
  return "text-hufflepuff-black dark:text-hufflepuff-light";
};

