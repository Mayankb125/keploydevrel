"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg border border-[var(--border)] bg-[var(--surface)] opacity-50" />
    );
  }

  const cycleTheme = () => {
    if (theme === "dark") setTheme("light");
    else if (theme === "light") setTheme("system");
    else setTheme("dark");
  };

  return (
    <button
      type="button"
      onClick={cycleTheme}
      aria-label={`Current theme: ${theme}. Click to switch theme.`}
      title={`Current: ${theme} (click to toggle light/dark/system)`}
      className="relative flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--foreground)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] cursor-pointer"
    >
      {theme === "dark" ? (
        <Moon className="w-4 h-4 text-[var(--accent)] transition-transform duration-200 rotate-0 scale-100" />
      ) : theme === "light" ? (
        <Sun className="w-4 h-4 text-[var(--accent)] transition-transform duration-200 rotate-0 scale-100" />
      ) : (
        <Laptop className="w-4 h-4 text-[var(--accent)] transition-transform duration-200" />
      )}
    </button>
  );
}
