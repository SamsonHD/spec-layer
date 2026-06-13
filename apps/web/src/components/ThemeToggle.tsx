"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function current(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

/**
 * Light/dark toggle. The initial theme is set before paint by an inline script
 * in layout.tsx (system preference + localStorage), so this only flips and
 * persists the choice — no flash on load.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  // Sync from the DOM after mount (the inline script ran before React).
  useEffect(() => setTheme(current()), []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* ignore storage failures (private mode) */
    }
    setTheme(next);
  }

  const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button className="theme-toggle" onClick={toggle} aria-label={label} title={label}>
      {theme === "dark" ? (
        // sun
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        // moon
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  );
}
