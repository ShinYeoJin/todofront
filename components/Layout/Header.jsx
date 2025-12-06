/**
 * Header 컴포넌트
 * 
 * 앱 상단에 표시되는 헤더로 다음 요소들을 포함합니다:
 * - 앱 타이틀 (Todo List)
 * - 명언 슬라이더 (5초마다 30개의 명언이 순환)
 * - 실시간 시계
 * - 다크모드 토글 버튼
 */

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import DarkModeToggle from "./DarkModeToggle";

// ============================================
// 명언 데이터
// - 해리포터/후플푸프 관련 명언
// - 동기부여 명언
// - 총 30개, 5초마다 순환 표시
// ============================================
const QUOTES = [
  // 후플푸프 & 해리포터 명언
  { text: "Hard work and dedication", author: "Helga Hufflepuff" },
  { text: "It does not do to dwell on dreams and forget to live", author: "Albus Dumbledore" },
  { text: "Happiness can be found even in the darkest of times", author: "Albus Dumbledore" },
  { text: "It is our choices that show what we truly are", author: "Albus Dumbledore" },
  { text: "We've all got both light and dark inside us", author: "Sirius Black" },
  { text: "Words are our most inexhaustible source of magic", author: "Albus Dumbledore" },
  { text: "It takes a great deal of bravery to stand up to our enemies", author: "Albus Dumbledore" },
  { text: "Help will always be given at Hogwarts to those who ask", author: "Albus Dumbledore" },
  { text: "The ones who love us never really leave us", author: "Sirius Black" },
  { text: "You're just as sane as I am", author: "Luna Lovegood" },
  { text: "I'll take the lot!", author: "Harry Potter" },
  { text: "After all this time? Always.", author: "Severus Snape" },
  { text: "Wit beyond measure is man's greatest treasure", author: "Rowena Ravenclaw" },
  { text: "Do not pity the dead, pity the living", author: "Albus Dumbledore" },
  { text: "We are only as strong as we are united", author: "Albus Dumbledore" },
  { text: "The best of us must sometimes eat our words", author: "Albus Dumbledore" },
  { text: "Of course it is happening inside your head, but why should that mean it is not real?", author: "Albus Dumbledore" },
  { text: "Things we lose have a way of coming back to us in the end", author: "Luna Lovegood" },
  { text: "Hufflepuffs are particularly good finders", author: "Hogwarts Legacy" },
  { text: "Where your treasure is, there will your heart be also", author: "Albus Dumbledore" },
  
  // 동기부여 명언
  { text: "Every day is a new opportunity to grow", author: "Motivation" },
  { text: "Small steps lead to big achievements", author: "Motivation" },
  { text: "Believe in yourself and all that you are", author: "Motivation" },
  { text: "Your only limit is your mind", author: "Motivation" },
  { text: "Dream big, work hard, stay focused", author: "Motivation" },
  { text: "Progress, not perfection", author: "Motivation" },
  { text: "The secret of getting ahead is getting started", author: "Mark Twain" },
  { text: "Success is the sum of small efforts repeated daily", author: "Robert Collier" },
  { text: "Don't watch the clock; do what it does. Keep going", author: "Sam Levenson" },
  { text: "The future depends on what you do today", author: "Mahatma Gandhi" },
];

// 명언 변경 간격 (밀리초)
const QUOTE_INTERVAL = 5000; // 5초
const ANIMATION_DURATION = 500; // 0.5초

export default function Header() {
  // ============================================
  // State 관리
  // ============================================
  const [currentTime, setCurrentTime] = useState(null);      // 현재 시간
  const [quoteIndex, setQuoteIndex] = useState(0);           // 현재 명언 인덱스
  const [isAnimating, setIsAnimating] = useState(false);     // 애니메이션 상태

  // ============================================
  // 실시간 시계 업데이트
  // - 1초마다 현재 시간을 갱신
  // - SSR 시점과의 차이로 인한 Hydration 오류 방지를 위해
  //   클라이언트에서만 시간 초기화
  // ============================================
  useEffect(() => {
    setCurrentTime(dayjs());

    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ============================================
  // 명언 슬라이더
  // - 5초마다 다음 명언으로 변경
  // - 위로 슬라이드하는 애니메이션 적용
  // ============================================
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      // 애니메이션 시작 (위로 슬라이드 아웃)
      setIsAnimating(true);
      
      // 애니메이션 완료 후 다음 명언으로 변경
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
        setIsAnimating(false); // 애니메이션 종료 (아래에서 슬라이드 인)
      }, ANIMATION_DURATION);
    }, QUOTE_INTERVAL);

    return () => clearInterval(quoteInterval);
  }, []);

  // 현재 표시할 명언
  const currentQuote = QUOTES[quoteIndex];

  // ============================================
  // 렌더링
  // ============================================
  return (
    <header className="hufflepuff-header">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
        
        {/* 좌측: 타이틀 & 명언 */}
        <div className="text-center sm:text-left w-full sm:w-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-['Cinzel_Decorative'] font-bold text-yellow-500 dark:text-yellow-400 mb-2">
            💫 Todo List 💫
          </h1>
          
          {/* 명언 슬라이더 (위로 슬라이드 애니메이션) */}
          <div className="h-5 sm:h-6 overflow-hidden">
            <p 
              className={`
                text-xs sm:text-sm text-hufflepuff-gray dark:text-badger-cream italic 
                transition-all duration-500 ease-in-out
                ${isAnimating ? "opacity-0 -translate-y-full" : "opacity-100 translate-y-0"}
              `}
            >
              &quot;{currentQuote.text}&quot; - {currentQuote.author}
            </p>
          </div>
        </div>

        {/* 우측: 시계 & 다크모드 토글 */}
        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3">
          <div className="font-mono text-xl sm:text-2xl font-bold text-hufflepuff-black dark:text-hufflepuff-yellow">
            {currentTime ? currentTime.format("HH:mm:ss") : null}
          </div>
          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
}
