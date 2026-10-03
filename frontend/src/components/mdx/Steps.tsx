import * as React from "react";

export function Steps({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative my-8 pl-6 sm:pl-8 border-l-2 border-[var(--border)] space-y-10 [counter-reset:step-counter]">
      {children}
    </div>
  );
}

interface StepProps {
  title: string;
  id?: string;
  children: React.ReactNode;
}

export function Step({ title, id, children }: StepProps) {
  // Generate an id from title if none provided
  const headingId = id || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  return (
    <div className="relative [counter-increment:step-counter]">
      {/* Numbered Accent Badge on connector line */}
      <div className="absolute -left-[35px] sm:-left-[43px] top-0 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--accent)] text-white text-xs sm:text-sm font-bold shadow-sm ring-4 ring-[var(--background)]">
        <span className="before:content-[counter(step-counter)]" />
      </div>

      {/* Step Title as H3 for Table of Contents spy */}
      <h3 id={headingId} className="text-lg sm:text-xl font-bold tracking-tight text-[var(--foreground)] !mt-0 !mb-3">
        {title}
      </h3>

      {/* Step Content */}
      <div className="text-sm sm:text-base leading-relaxed text-[var(--foreground)] space-y-4">
        {children}
      </div>
    </div>
  );
}
