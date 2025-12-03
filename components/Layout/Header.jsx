import { useState, useEffect } from "react";
import dayjs from "dayjs";
import DarkModeToggle from "./DarkModeToggle";

export default function Header() {
  const [currentTime, setCurrentTime] = useState(dayjs());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <header className="hufflepuff-card p-6 mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-['Cinzel_Decorative'] font-bold text-yellow-500 dark:text-yellow-400 mb-2">💫 Todo List 💫</h1>
          <p className="text-sm text-hufflepuff-gray dark:text-badger-cream italic">"Hard work and dedication" - Helga Hufflepuff</p>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="font-mono text-2xl font-bold text-hufflepuff-black dark:text-hufflepuff-yellow">{currentTime.format("HH:mm:ss")}</div>
          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
}
