"use client";

import * as React from "react";

interface TabItem {
  label: string;
  content: React.ReactNode;
}

interface CodeTabsProps {
  items: TabItem[];
}

export function CodeTabs({ items }: CodeTabsProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);

  if (!items || items.length === 0) return null;

  return (
    <div className="my-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm">
      {/* Tab Header Bar */}
      <div className="flex items-center gap-1 px-3 pt-2 border-b border-[var(--border)] bg-[var(--surface-hover)] overflow-x-auto">
        {items.map((tab, idx) => {
          const isActive = activeIndex === idx;
          return (
            <button
              key={tab.label}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-t-lg transition-all border-b-2 cursor-pointer ${
                isActive
                  ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--surface)]"
                  : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]/50"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Active Tab Panel */}
      <div className="p-4 text-xs sm:text-sm font-mono overflow-x-auto">
        {items[activeIndex]?.content}
      </div>
    </div>
  );
}
