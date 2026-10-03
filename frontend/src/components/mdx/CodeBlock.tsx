"use client";

import * as React from "react";
import { Check, Copy, Terminal } from "lucide-react";

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  title?: string;
  language?: string;
  raw?: string;
}

export function CodeBlock({
  title,
  language,
  raw,
  children,
  className,
  ...props
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);
  const preRef = React.useRef<HTMLPreElement>(null);

  const handleCopy = async () => {
    let textToCopy = raw || "";

    if (!textToCopy && preRef.current) {
      // Extract text content from pre element
      textToCopy = preRef.current.innerText || "";
    }

    if (textToCopy) {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative my-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm transition-colors group">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border)] bg-[var(--surface-hover)] text-xs text-[var(--muted)]">
        <div className="flex items-center gap-2 font-mono">
          <Terminal className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span className="font-semibold text-[var(--foreground)]">{title || language || "code"}</span>
        </div>

        {/* Copy Button */}
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Copied code" : "Copy code"}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--accent)] transition-all text-[11px] focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-500" />
              <span className="text-emerald-500 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Pre code content */}
      <pre
        ref={preRef}
        className={`!m-0 !p-4 !bg-transparent !border-0 text-xs sm:text-sm font-mono overflow-x-auto ${className || ""}`}
        {...props}
      >
        {children}
      </pre>
    </div>
  );
}
