/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import DarkModeToggle from "./DarkModeToggle";

// 해리포터/후플푸프 명언 + 동기부여 명언 30개
const QUOTES = [
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

export default function Header() {
  // 클라이언트에서만 시간 초기화 (SSR 시점과의 차이로 인한 Hydration 오류 방지)
  const [currentTime, setCurrentTime] = useState(null);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    // 초기 마운트 및 1초 간격 시간 갱신을 위해 effect 내부에서만 state를 업데이트
    const now = dayjs();
    setCurrentTime(now);

    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 2초마다 명언 변경
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setFadeIn(false); // 페이드 아웃
      
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
        setFadeIn(true); // 페이드 인
      }, 300); // 0.3초 후 텍스트 변경
    }, 2000);

    return () => clearInterval(quoteInterval);
  }, []);

  const currentQuote = QUOTES[quoteIndex];

  return (
    <header className="hufflepuff-header">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-['Cinzel_Decorative'] font-bold text-yellow-500 dark:text-yellow-400 mb-2">💫 Todo List 💫</h1>
          <p 
            className={`text-sm text-hufflepuff-gray dark:text-badger-cream italic transition-opacity duration-300 ${
              fadeIn ? "opacity-100" : "opacity-0"
            }`}
          >
            &quot;{currentQuote.text}&quot; - {currentQuote.author}
          </p>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="font-mono text-2xl font-bold text-hufflepuff-black dark:text-hufflepuff-yellow">
            {currentTime ? currentTime.format("HH:mm:ss") : null}
          </div>
          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
}
