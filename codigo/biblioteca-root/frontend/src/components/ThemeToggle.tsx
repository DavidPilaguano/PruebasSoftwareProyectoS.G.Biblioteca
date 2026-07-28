"use client";

import { useEffect, useState } from "react";

const THEME_KEY = "biblioteca-theme";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const enabled = savedTheme ? savedTheme === "dark" : prefersDark;

    document.documentElement.classList.toggle("dark", enabled);
    setDarkMode(enabled);
  }, []);

  const toggleTheme = () => {
    const nextMode = !darkMode;
    document.documentElement.classList.toggle("dark", nextMode);
    window.localStorage.setItem(THEME_KEY, nextMode ? "dark" : "light");
    setDarkMode(nextMode);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={darkMode ? "Cambiar a modo claro" : "Cambiar a modo noche"}
      aria-label={darkMode ? "Cambiar a modo claro" : "Cambiar a modo noche"}
      className={`theme-toggle ${darkMode ? "theme-toggle-dark" : ""}`}
    >
      <span className="theme-toggle-track">
        <span className="theme-toggle-thumb" />
      </span>
      <span className="theme-toggle-label">
        {darkMode ? "Modo claro" : "Modo noche"}
      </span>
    </button>
  );
}
