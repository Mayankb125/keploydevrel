import * as React from "react";
import { Database, Server, Smartphone, CheckCircle } from "lucide-react";

export function FlowDiagram() {
  return (
    <div className="my-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-sm overflow-hidden">
      <div className="mb-4 text-center sm:text-left">
        <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--accent)] mb-1">
          Architecture: Record Mode vs. Replay Mode
        </h4>
        <p className="text-xs text-[var(--muted)]">
          How Keploy captures production-grade regression tests without modifying your application source code.
        </p>
      </div>

      {/* Grid: Record Lane vs Replay Lane */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        {/* Lane 1: Record Mode */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 sm:p-5 relative flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[var(--border)]">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-500 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              1. Record Mode
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              keploy record
            </span>
          </div>

          <div className="space-y-3 my-2">
            {/* Step A */}
            <div className="flex items-center gap-3 p-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs">
              <Smartphone className="w-4 h-4 text-blue-500 shrink-0" />
              <div>
                <span className="font-semibold block text-[var(--foreground)]">Client Traffic</span>
                <span className="text-[11px] text-[var(--muted)]">Real HTTP requests sent via curl or browser</span>
              </div>
            </div>

            <div className="flex justify-center text-[var(--muted)]">
              <span className="text-[11px] font-mono font-bold text-blue-500">↓ Intercepted by eBPF</span>
            </div>

            {/* Step B */}
            <div className="flex items-center gap-3 p-2.5 rounded-lg border-2 border-blue-500/40 bg-blue-500/5 text-xs">
              <Server className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <div>
                <span className="font-semibold block text-[var(--foreground)]">Your Go Gin Application</span>
                <span className="text-[11px] text-[var(--muted)]">Processes business logic, unchanged code</span>
              </div>
            </div>

            <div className="flex justify-center text-[var(--muted)]">
              <span className="text-[11px] font-mono font-bold text-blue-500">↓ Captures MongoDB call</span>
            </div>

            {/* Step C */}
            <div className="flex items-center gap-3 p-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs">
              <Database className="w-4 h-4 text-emerald-500 shrink-0" />
              <div>
                <span className="font-semibold block text-[var(--foreground)]">Live MongoDB Database</span>
                <span className="text-[11px] text-[var(--muted)]">Records wire queries and live responses</span>
              </div>
            </div>
          </div>

          {/* Result Output */}
          <div className="mt-4 pt-3 border-t border-[var(--border)] text-[11px] text-[var(--muted)] bg-[var(--surface)] -mx-4 -mb-4 sm:-mx-5 sm:-mb-5 p-3 rounded-b-xl flex items-center justify-between">
            <span className="font-medium text-[var(--foreground)]">Output:</span>
            <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">
              keploy/test-set-0/ (tests + mocks)
            </span>
          </div>
        </div>

        {/* Lane 2: Replay Mode */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 sm:p-5 relative flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[var(--border)]">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
              2. Replay Mode (Zero DB)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--accent)]/20">
              keploy test
            </span>
          </div>

          <div className="space-y-3 my-2">
            {/* Step A */}
            <div className="flex items-center gap-3 p-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs">
              <div className="w-4 h-4 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                K
              </div>
              <div>
                <span className="font-semibold block text-[var(--foreground)]">Keploy Test Runner</span>
                <span className="text-[11px] text-[var(--muted)]">Simulates inbound client requests from YAML</span>
              </div>
            </div>

            <div className="flex justify-center text-[var(--muted)]">
              <span className="text-[11px] font-mono font-bold text-[var(--accent)]">↓ Fired against app</span>
            </div>

            {/* Step B */}
            <div className="flex items-center gap-3 p-2.5 rounded-lg border-2 border-[var(--accent)]/40 bg-[var(--accent-light)] text-xs">
              <Server className="w-4 h-4 text-[var(--accent)] shrink-0" />
              <div>
                <span className="font-semibold block text-[var(--foreground)]">Your Go Gin Application</span>
                <span className="text-[11px] text-[var(--muted)]">Executes current code under test</span>
              </div>
            </div>

            <div className="flex justify-center text-[var(--muted)]">
              <span className="text-[11px] font-mono font-bold text-purple-500">↓ Intercepted & Mocked</span>
            </div>

            {/* Step C: Mocked DB */}
            <div className="flex items-center gap-3 p-2.5 rounded-lg border border-purple-500/30 bg-purple-500/5 text-xs">
              <Database className="w-4 h-4 text-purple-500 shrink-0" />
              <div>
                <span className="font-semibold block text-purple-600 dark:text-purple-400">
                  Virtual Wire Mock (No MongoDB!)
                </span>
                <span className="text-[11px] text-[var(--muted)]">Replays exact recorded BSON responses</span>
              </div>
            </div>
          </div>

          {/* Result Output */}
          <div className="mt-4 pt-3 border-t border-[var(--border)] text-[11px] text-[var(--muted)] bg-[var(--surface)] -mx-4 -mb-4 sm:-mx-5 sm:-mb-5 p-3 rounded-b-xl flex items-center justify-between">
            <span className="font-medium text-[var(--foreground)]">Assertion:</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 inline" />
              Passed / Diff Report
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
