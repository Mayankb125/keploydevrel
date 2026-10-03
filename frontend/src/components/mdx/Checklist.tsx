"use client";

import * as React from "react";
import { Check, CheckSquare } from "lucide-react";

interface ChecklistItem {
  id: string;
  label: string;
  detail?: string;
  defaultChecked?: boolean;
}

interface ChecklistProps {
  items: ChecklistItem[];
}

export function Checklist({ items }: ChecklistProps) {
  const [checkedState, setCheckedState] = React.useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    items.forEach((item) => {
      initial[item.id] = item.defaultChecked ?? false;
    });
    return initial;
  });

  const toggle = (id: string) => {
    setCheckedState((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="my-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[var(--border)] text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
        <CheckSquare className="w-4 h-4" />
        <span>Pre-flight Checklist</span>
      </div>

      <div className="space-y-2.5">
        {items.map((item) => {
          const isChecked = checkedState[item.id];
          return (
            <label
              key={item.id}
              onClick={() => toggle(item.id)}
              className={`flex items-start gap-3 p-2.5 rounded-lg border transition-all cursor-pointer ${
                isChecked
                  ? "border-emerald-500/30 bg-emerald-500/5 text-[var(--foreground)]"
                  : "border-[var(--border)] hover:bg-[var(--surface-hover)] text-[var(--foreground)]"
              }`}
            >
              <div
                className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border transition-colors shrink-0 ${
                  isChecked
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : "border-[var(--muted)] bg-[var(--background)]"
                }`}
              >
                {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <div className="text-xs sm:text-sm">
                <span className={`font-semibold block ${isChecked ? "line-through opacity-80" : ""}`}>
                  {item.label}
                </span>
                {item.detail && (
                  <span className="text-xs text-[var(--muted)] block mt-0.5">{item.detail}</span>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
