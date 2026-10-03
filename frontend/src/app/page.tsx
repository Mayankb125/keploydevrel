import Tutorial from "@/content/tutorial.mdx";
import { TableOfContents } from "@/components/layout/TableOfContents";
import { Clock, BarChart, Calendar, User, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      {/* Hero Section */}
      <div className="max-w-[760px] mx-auto lg:mx-0 mb-12">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--accent)]/20 mb-5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Go · Gin · MongoDB · Zero Code Instrumentation</span>
        </div>

        {/* H1 Heading */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--foreground)] leading-[1.15] mb-4">
          Test Your Go API Without Writing Tests
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[var(--muted)] leading-relaxed mb-6">
          A beginner-friendly walkthrough of recording real API traffic, auto-mocking MongoDB
          dependencies, and running regression tests with Keploy — without touching a single line of your application code.
        </p>

        {/* Meta Bar */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-4 border-t border-[var(--border)] text-xs text-[var(--muted)]">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[var(--accent)]" />
            <span>10 min read</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BarChart className="w-4 h-4 text-[var(--accent)]" />
            <span>Beginner to Intermediate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[var(--accent)]" />
            <span>October 2026</span>
          </div>
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4 text-[var(--accent)]" />
            <span>Keploy DevRel Candidate</span>
          </div>
        </div>
      </div>

      {/* Main Content + Sticky TOC Layout */}
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
        {/* Article Column (ergonomic 72ch width) */}
        <article className="flex-1 w-full max-w-[72ch] mx-auto lg:mx-0 min-w-0">
          <TableOfContents mode="mobile" />
          <div className="prose-content">
            <Tutorial />
          </div>
        </article>

        {/* Desktop Sticky Table of Contents */}
        <div className="hidden lg:block">
          <TableOfContents mode="desktop" />
        </div>
      </div>
    </div>
  );
}
