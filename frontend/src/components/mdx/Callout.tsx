import * as React from "react";
import { Info, Lightbulb, FileText, AlertTriangle, AlertCircle } from "lucide-react";

type CalloutType = "info" | "tip" | "note" | "warning" | "danger";

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}

const calloutConfig: Record<
  CalloutType,
  {
    icon: React.ComponentType<{ className?: string }>;
    defaultTitle: string;
    borderClass: string;
    bgClass: string;
    textClass: string;
    iconClass: string;
  }
> = {
  info: {
    icon: Info,
    defaultTitle: "Note",
    borderClass: "border-l-blue-500 border-blue-500/20",
    bgClass: "bg-blue-500/8 dark:bg-blue-500/12",
    textClass: "text-blue-900 dark:text-blue-200",
    iconClass: "text-blue-500",
  },
  tip: {
    icon: Lightbulb,
    defaultTitle: "Pro Tip",
    borderClass: "border-l-emerald-500 border-emerald-500/20",
    bgClass: "bg-emerald-500/8 dark:bg-emerald-500/12",
    textClass: "text-emerald-900 dark:text-emerald-200",
    iconClass: "text-emerald-500",
  },
  note: {
    icon: FileText,
    defaultTitle: "Notice",
    borderClass: "border-l-amber-500 border-amber-500/20",
    bgClass: "bg-amber-500/8 dark:bg-amber-500/12",
    textClass: "text-amber-900 dark:text-amber-200",
    iconClass: "text-amber-500",
  },
  warning: {
    icon: AlertTriangle,
    defaultTitle: "Caution",
    borderClass: "border-l-orange-500 border-orange-500/20",
    bgClass: "bg-orange-500/8 dark:bg-orange-500/12",
    textClass: "text-orange-900 dark:text-orange-200",
    iconClass: "text-orange-500",
  },
  danger: {
    icon: AlertCircle,
    defaultTitle: "Critical",
    borderClass: "border-l-red-500 border-red-500/20",
    bgClass: "bg-red-500/8 dark:bg-red-500/12",
    textClass: "text-red-900 dark:text-red-200",
    iconClass: "text-red-500",
  },
};

export function Callout({ type = "info", title, children }: CalloutProps) {
  const config = calloutConfig[type] || calloutConfig.info;
  const Icon = config.icon;
  const displayTitle = title || config.defaultTitle;

  return (
    <div
      role={type === "danger" ? "alert" : "note"}
      className={`my-6 rounded-xl border border-l-4 p-4.5 transition-colors ${config.borderClass} ${config.bgClass}`}
    >
      <div className="flex items-center gap-2.5 mb-2 font-semibold text-sm">
        <Icon className={`w-4 h-4 shrink-0 ${config.iconClass}`} />
        <span className={config.textClass}>{displayTitle}</span>
      </div>
      <div className="text-sm leading-relaxed text-[var(--foreground)] opacity-95 [&>p]:my-1.5 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0 [&_code]:border-black/10 [&_code]:dark:border-white/10">
        {children}
      </div>
    </div>
  );
}
