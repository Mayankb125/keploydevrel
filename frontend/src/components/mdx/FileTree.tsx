import * as React from "react";
import { Folder, FolderOpen, FileCode } from "lucide-react";

interface FileNode {
  name: string;
  type: "folder" | "file";
  annotation?: string;
  children?: FileNode[];
}

interface FileTreeProps {
  tree: FileNode[];
}

export function FileTree({ tree }: FileTreeProps) {
  const renderNodes = (nodes: FileNode[], depth = 0) => {
    return nodes.map((node, i) => (
      <div key={`${node.name}-${i}`} className="text-xs sm:text-sm font-mono">
        <div
          className={`flex items-center gap-2 py-1.5 px-2 rounded hover:bg-[var(--surface-hover)] transition-colors ${
            depth > 0 ? "ml-4 sm:ml-5 border-l border-[var(--border)] pl-3" : ""
          }`}
        >
          {node.type === "folder" ? (
            <FolderOpen className="w-4 h-4 text-amber-500 shrink-0" />
          ) : (
            <FileCode className="w-4 h-4 text-blue-500 shrink-0" />
          )}

          <span className="font-semibold text-[var(--foreground)]">{node.name}</span>

          {node.annotation && (
            <span className="text-xs text-[var(--muted)] font-sans italic ml-auto pl-2">
              — {node.annotation}
            </span>
          )}
        </div>

        {node.children && <div>{renderNodes(node.children, depth + 1)}</div>}
      </div>
    ));
  };

  return (
    <div className="my-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm overflow-x-auto">
      <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] mb-3 pb-2 border-b border-[var(--border)] flex items-center gap-2">
        <Folder className="w-3.5 h-3.5 text-[var(--accent)]" />
        <span>Generated Test Directory Structure</span>
      </div>
      <div className="space-y-0.5">{renderNodes(tree)}</div>
    </div>
  );
}
