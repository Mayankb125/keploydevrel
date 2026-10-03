import { ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";

export function Footer() {
  return (
    <footer className="w-full border-t border-[var(--border)] bg-[var(--surface)] transition-colors mt-20">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-[var(--muted)]">
        {/* Left: Info */}
        <div className="flex flex-col items-center md:items-start gap-1.5 text-center md:text-left">
          <div className="flex items-center gap-2 font-medium text-[var(--foreground)]">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
            <span>Keploy Go Quickstart — DevRel Candidate Assignment</span>
          </div>
          <p className="text-xs text-[var(--muted)] max-w-md">
            An original, beginner-friendly walkthrough for recording and replaying API regression tests
            using Gin and MongoDB.
          </p>
        </div>

        {/* Right: Links & Tech */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs">
          <a
            href="https://keploy.io/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-[var(--accent)] transition-colors"
          >
            <span>Keploy Docs</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://github.com/keploy/samples-go"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-[var(--accent)] transition-colors"
          >
            <span>Go Samples</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-[var(--accent)] transition-colors"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>Source Code</span>
          </a>
        </div>
      </div>

      <div className="border-t border-[var(--border)] py-4 text-center text-[11px] text-[var(--muted)]">
        Built with Next.js 15, MDX, Shiki, and Tailwind CSS.
      </div>
    </footer>
  );
}
