"use client";

import * as React from "react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { ReadingProgress } from "./ReadingProgress";
import { BookOpen, Clock } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/85 backdrop-blur-md transition-colors">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand & Title */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-semibold text-sm tracking-tight text-[var(--foreground)] hover:opacity-85 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
          >
            {/* Keploy Logo Icon */}
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center text-white shadow-sm font-bold text-sm tracking-wider">
              K
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-[var(--foreground)]">
                  Keploy
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--accent)]/20">
                  Go · MongoDB
                </span>
              </div>
              <span className="text-xs text-[var(--muted)] hidden sm:inline">
                Developer Quickstart & Tutorial
              </span>
            </div>
          </Link>
        </div>

        {/* Right: Meta, Links & Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Read time badge */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-[var(--muted)] px-2.5 py-1 rounded-full border border-[var(--border)] bg-[var(--surface)]">
            <Clock className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>10 min read</span>
          </div>

          {/* Keploy Docs Link */}
          <a
            href="https://keploy.io/docs"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Keploy Official Documentation"
            title="Keploy Docs"
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] transition-colors border border-transparent hover:border-[var(--border)]"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Docs</span>
          </a>

          {/* GitHub Repository Link */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View Source on GitHub"
            title="GitHub Repository"
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--foreground)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] cursor-pointer"
          >
            <GithubIcon className="w-4 h-4" />
          </a>

          {/* Dark / Light Mode Toggle */}
          <ThemeToggle />
        </div>
      </div>

      {/* Pinned 2px Reading Progress */}
      <ReadingProgress />
    </header>
  );
}
