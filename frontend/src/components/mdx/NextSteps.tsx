import * as React from "react";
import { ArrowRight, BookOpen, GitBranch, MessageSquare, Terminal } from "lucide-react";

interface ResourceLink {
  title: string;
  description: string;
  href: string;
  badge?: string;
  icon?: "docs" | "git" | "community" | "cli";
}

interface NextStepsProps {
  links?: ResourceLink[];
}

const defaultLinks: ResourceLink[] = [
  {
    title: "CI/CD Pipeline Integration",
    description: "Run Keploy regression test suites inside GitHub Actions without provisioning live databases.",
    href: "https://keploy.io/docs/ci-cd/github-actions/",
    badge: "Automation",
    icon: "git",
  },
  {
    title: "Official Keploy Go Documentation",
    description: "Explore advanced configuration flags, noise filters, and test set customization.",
    href: "https://keploy.io/docs/quickstart/samples-go/",
    badge: "Official Docs",
    icon: "docs",
  },
  {
    title: "Keploy Developer Community",
    description: "Join fellow engineers on Slack and Discord to ask questions, report issues, and collaborate.",
    href: "https://keploy.io/community",
    badge: "Support",
    icon: "community",
  },
  {
    title: "More Go Quickstarts",
    description: "Try Keploy with Echo + PostgreSQL, Fiber + MySQL, or gRPC microservices.",
    href: "https://github.com/keploy/samples-go",
    badge: "Examples",
    icon: "cli",
  },
];

export function NextSteps({ links = defaultLinks }: NextStepsProps) {
  const getIcon = (type?: string) => {
    switch (type) {
      case "git":
        return <GitBranch className="w-5 h-5 text-[var(--accent)]" />;
      case "community":
        return <MessageSquare className="w-5 h-5 text-purple-500" />;
      case "cli":
        return <Terminal className="w-5 h-5 text-emerald-500" />;
      default:
        return <BookOpen className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
      {links.map((link) => (
        <a
          key={link.title}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col justify-between p-4.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] hover:border-[var(--accent)] transition-all duration-200 shadow-sm"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="p-2 rounded-lg bg-[var(--background)] border border-[var(--border)]">
                {getIcon(link.icon)}
              </div>
              {link.badge && (
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--accent)]/20">
                  {link.badge}
                </span>
              )}
            </div>

            <h4 className="text-sm font-bold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
              {link.title}
            </h4>

            <p className="text-xs text-[var(--muted)] leading-relaxed mt-1.5">
              {link.description}
            </p>
          </div>

          <div className="flex items-center gap-1 text-xs font-semibold text-[var(--accent)] mt-4">
            <span>Explore resource</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </a>
      ))}
    </div>
  );
}
