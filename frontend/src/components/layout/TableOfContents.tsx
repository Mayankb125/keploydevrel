"use client";

import * as React from "react";
import { List, ChevronDown } from "lucide-react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  mode?: "mobile" | "desktop" | "all";
}

export function TableOfContents({ mode = "all" }: TableOfContentsProps) {
  const [headings, setHeadings] = React.useState<TocItem[]>([]);
  const [activeId, setActiveId] = React.useState<string>("");
  const [isOpenMobile, setIsOpenMobile] = React.useState(false);

  React.useEffect(() => {
    // Scan for all h2 and h3 in article
    const article = document.querySelector("article");
    if (!article) return;

    const elements = Array.from(article.querySelectorAll("h2, h3"));
    const items: TocItem[] = elements
      .filter((el) => el.id)
      .map((el) => ({
        id: el.id,
        text: el.textContent?.replace(/#/g, "").trim() || "",
        level: el.tagName === "H2" ? 2 : 3,
      }));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "0px 0px -65% 0px",
        threshold: 0.1,
      }
    );

    const rafId = requestAnimationFrame(() => {
      setHeadings(items);
      if (items.length > 0) {
        setActiveId(items[0].id);
      }
      elements.forEach((el) => observer.observe(el));
    });

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  if (headings.length === 0) return null;

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActiveId(id);
      setIsOpenMobile(false);
      window.history.pushState(null, "", `#${id}`);
    }
  };

  const renderMobile = mode === "mobile" || mode === "all";
  const renderDesktop = mode === "desktop" || mode === "all";

  return (
    <>
      {/* Mobile Collapsible TOC */}
      {renderMobile && (
        <div className="lg:hidden mb-8 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
          <button
            type="button"
            onClick={() => setIsOpenMobile(!isOpenMobile)}
            className="flex items-center justify-between w-full text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]"
          >
            <span className="flex items-center gap-2">
              <List className="w-4 h-4 text-[var(--accent)]" />
              <span>On This Page ({headings.length} sections)</span>
            </span>
            <ChevronDown
              className={`w-4 h-4 text-[var(--muted)] transition-transform duration-200 ${
                isOpenMobile ? "rotate-180" : ""
              }`}
            />
          </button>

          {isOpenMobile && (
            <nav className="mt-3 pt-3 border-t border-[var(--border)] max-h-60 overflow-y-auto space-y-1">
              {headings.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToHeading(item.id)}
                  className={`block w-full text-left py-1 text-xs transition-colors ${
                    item.level === 3 ? "pl-4 text-[11px]" : "pl-1 font-medium"
                  } ${
                    activeId === item.id
                      ? "text-[var(--accent)] font-semibold"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {item.text}
                </button>
              ))}
            </nav>
          )}
        </div>
      )}

      {/* Desktop Sticky Sidebar TOC */}
      {renderDesktop && (
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2 pb-8">
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-[var(--border)] text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              <List className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>On This Page</span>
            </div>

            <nav className="space-y-0.5 text-xs">
              {headings.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToHeading(item.id)}
                    className={`group flex items-start w-full text-left py-1.5 transition-all rounded-md relative cursor-pointer ${
                      item.level === 3 ? "pl-5 text-[11.5px]" : "pl-3 font-medium"
                    } ${
                      isActive
                        ? "text-[var(--accent)] font-semibold bg-[var(--accent-light)]"
                        : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
                    }`}
                  >
                    {/* Left Active Indicator Bar */}
                    {isActive && (
                      <span className="absolute left-0 top-1 bottom-1 w-1 bg-[var(--accent)] rounded-r" />
                    )}
                    <span className="line-clamp-1 leading-snug">{item.text}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>
      )}
    </>
  );
}
