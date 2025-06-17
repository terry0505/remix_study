import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);
  return (
    <button
      onClick={() => setDark((prev) => !prev)}
      style={{
        border: "none",
        background: "none",
        fontSize: "0.9rem",
        cursor: "pointer",
        color: dark ? "#fff" : "#222",
        transition: "color 0.3s ease"
      }}
    >
      {dark ? "☀️ 라이트 모드" : "🌙 다크 모드"}
    </button>
  );
}
