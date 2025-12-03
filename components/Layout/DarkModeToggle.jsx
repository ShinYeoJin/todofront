import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // LocalStorage에서 테마 불러오기
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-hufflepuff-gold dark:bg-hufflepuff-yellow text-hufflepuff-black hover:opacity-80 transition-opacity"
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <>
          <Sun size={20} />
          <span className="font-semibold">Light Mode</span>
        </>
      ) : (
        <>
          <Moon size={20} />
          <span className="font-semibold">Dark Mode</span>
        </>
      )}
    </button>
  );
}
