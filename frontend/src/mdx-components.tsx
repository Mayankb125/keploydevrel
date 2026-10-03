import type { MDXComponents } from "mdx/types";
import { Callout } from "@/components/mdx/Callout";
import { Steps, Step } from "@/components/mdx/Steps";
import { CodeBlock } from "@/components/mdx/CodeBlock";
import { CodeTabs } from "@/components/mdx/CodeTabs";
import { FlowDiagram } from "@/components/mdx/FlowDiagram";
import { Checklist } from "@/components/mdx/Checklist";
import { FileTree } from "@/components/mdx/FileTree";
import { NextSteps } from "@/components/mdx/NextSteps";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    // Custom MDX Interactive Components
    Callout,
    Steps,
    Step,
    CodeBlock,
    CodeTabs,
    FlowDiagram,
    Checklist,
    FileTree,
    NextSteps,

    // HTML tag overrides
    pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
      <CodeBlock {...props} />
    ),
    table: (props: React.TableHTMLAttributes<HTMLTableElement>) => (
      <div className="my-6 w-full overflow-x-auto rounded-xl border border-[var(--border)]">
        <table {...props} className="w-full text-left text-sm" />
      </div>
    ),
  };
}
