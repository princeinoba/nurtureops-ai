"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const THEME_EVENT = "nurtureops:theme";
const SERVER_THEME: Theme = "light";

function readTheme(): Theme {
  const saved = window.localStorage.getItem("nurtureops-theme");
  if (saved === "dark" || saved === "light") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function subscribeToTheme(onStoreChange: () => void): () => void {
  window.addEventListener(THEME_EVENT, onStoreChange);
  return () => window.removeEventListener(THEME_EVENT, onStoreChange);
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeToTheme, readTheme, () => SERVER_THEME);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function toggle(): void {
    const next = theme === "light" ? "dark" : "light";
    window.localStorage.setItem("nurtureops-theme", next);
    document.documentElement.dataset.theme = next;
    window.dispatchEvent(new Event(THEME_EVENT));
  }

  return (
    <button
      className="icon-button"
      type="button"
      onClick={toggle}
      aria-label={`Use ${theme === "light" ? "dark" : "light"} theme`}
    >
      {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
