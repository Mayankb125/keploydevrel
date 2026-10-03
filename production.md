# production.md — Keploy DevRel Assignment: Build Plan

> **Goal:** Ship a single-page, static documentation site (Next.js + MDX) containing an original, beginner-friendly tutorial based on running a **Keploy Go quickstart**, deployed on Vercel with source on public GitHub.
>
> **Deliverables (reply with exactly these two):**
> 1. Public GitHub repo URL
> 2. Live Vercel URL

---

## 0. Assignment Decoded

| Requirement | What it means in practice |
|---|---|
| Next.js | Use App Router, static output (no server-only features needed) |
| MDX content | Tutorial lives in a `.mdx` file; React components used *inside* the markdown |
| UI library | Tailwind CSS + shadcn/ui (recommended) |
| Doc-like tutorial | Step-by-step, code blocks with syntax highlighting, callouts, diagrams |
| Own voice | **Do not copy-paste Keploy docs.** Crisp, to the point, explain the *why* |
| Run Keploy for real | `keploy record` + `keploy test` must actually be run; screenshots/terminal output come from *your* run |
| Bonus | Polished UI, dark/light toggle, good use of UI-library components |

**Evaluation lens (design every decision around this):**
1. Content quality (clear, accurate, helpful) — **highest weight**
2. Technical implementation (Next.js + MDX, static)
3. UI/UX (clean, professional, readable)
4. Attention to detail (no typos, working code, clean repo)

---

## 1. Chosen Stack & Decisions

| Area | Choice | Reason |
|---|---|---|
| Framework | Next.js 15 (App Router) + TypeScript | Required; best Vercel fit |
| MDX | `@next/mdx` (+ `mdx-components.tsx`) | Official, simple, static |
| Styling | Tailwind CSS | Fast, clean, dark mode via class strategy |
| Components | shadcn/ui (Button, Tabs, Badge, Tooltip, Separator, Sheet) | Professional, accessible |
| Icons | `lucide-react` | Consistent iconography |
| Syntax highlighting | `rehype-pretty-code` + `shiki` (build-time) | Zero client JS, beautiful themes, supports line highlighting |
| Theme | `next-themes` | Dark/light/system toggle with no flash |
| Fonts | `next/font` — **Inter** (body) + **JetBrains Mono** (code) | Readable, free, optimized |
| Diagram | Inline SVG or Mermaid pre-rendered / hand-made React component | Show Keploy record/replay flow |
| Deploy | Vercel | Required |

**Chosen quickstart (recommended):** **Gin + MongoDB (User Profile CRUD)** from the Keploy Go samples.
- Why: CRUD gives a rich set of API calls to record (POST/GET/PUT/DELETE), and Mongo is a *real dependency* so the "Keploy auto-mocks your DB" story is strong.
- Fallback: **Echo + SQL (URL Shortener)** — fewer moving parts if Mongo/Docker networking causes trouble.

> ✅ Before writing anything, open the live Keploy Go quickstart page and confirm the current install command, flags, and repo path. Keploy's CLI flags and quickstart structure change between versions — **always trust the live docs + your own terminal output over this plan.**

---

## 2. Phase Overview

| Phase | Name | Output |
|---|---|---|
| 1 | Learn & Run Keploy locally | Notes, terminal outputs, screenshots, working test-suite |
| 2 | Content blueprint | Final tutorial outline + voice guide |
| 3 | Project scaffolding | Next.js app with MDX, Tailwind, shadcn, themes |
| 4 | Design system | Tokens, typography, layout, dark mode |
| 5 | Custom MDX components | Callout, Steps, CodeBlock, Tabs, Diagram, TOC, etc. |
| 6 | Write the MDX tutorial | `content/tutorial.mdx` fully written |
| 7 | Polish & UX | Responsiveness, a11y, animations, SEO, performance |
| 8 | QA & repo hygiene | Lint, typos, links, Lighthouse, README |
| 9 | Deploy & submit | GitHub repo + Vercel link + submission email |

Suggested time budget: **Phase 1 (2–3h) · Phase 2 (45m) · Phase 3–5 (3–4h) · Phase 6 (2h) · Phase 7–9 (2h)**.

---

## Phase 1 — Learn & Run Keploy Locally

### 1.1 Prerequisites checklist
- [ ] Linux / macOS / WSL2 (Keploy's eBPF-based capture works natively on Linux; on macOS/Windows it typically runs through Docker — check the docs for your OS)
- [ ] Go (version required by the sample)
- [ ] Docker + Docker Compose
- [ ] Git, curl
- [ ] Postman / curl / Hoppscotch to fire API requests

### 1.2 Steps to execute
1. Open the Keploy docs → Quickstart → filter **Go** → pick **Gin + Mongo**.
2. Install Keploy (follow the live docs).
3. Clone the `samples-go` repo and `cd` into the chosen sample.
4. Start dependencies (Mongo) as instructed.
5. Run `keploy record` with the sample app command.
6. Hit **at least 5–6 varied API calls**: create, read, update, delete, one invalid/edge input.
7. Stop recording → inspect the generated `keploy/` folder (test cases + mocks, YAML).
8. Run `keploy test` → observe pass/fail report.
9. **Break something on purpose** (change a response field in the handler) → run `keploy test` again → capture the failing diff. This is a great "a-ha" section for the tutorial.
10. (Optional) Run with `--coverage` / `go test` integration if supported in your version and note the coverage figure.

### 1.3 Notes template — fill this while you work
Copy this into a scratch file and fill it in. **This is the raw material for your own voice.**

```md
## What I ran
- OS / versions:
- Keploy version:
- Sample chosen:
- Exact commands that worked:

## Confusing moments (each is a tutorial callout!)
1.
2.

## Errors I hit + how I fixed them
| Error | Cause | Fix |
|---|---|---|

## "A-ha!" moments
-

## What Keploy actually generated
- Test case file structure:
- Mock file structure:
- Things that surprised me:

## Why a Go dev would care
-

## Screenshots / terminal outputs to capture
- [ ] keploy record running
- [ ] API calls being sent
- [ ] Generated YAML (test + mock)
- [ ] keploy test passing report
- [ ] keploy test failing diff
```

### 1.4 Artifacts to save
- Terminal output blocks (copy as text — they become code blocks)
- 3–5 clean screenshots (PNG/WebP, < 200 KB each) → `public/images/`
- A short sample of a generated test YAML and mock YAML (trim to the essential ~15 lines each for the tutorial)

**Exit criteria:** `keploy record` and `keploy test` both succeeded on your machine; you have notes, outputs, and screenshots.

---

## Phase 2 — Content Blueprint

### 2.1 Target reader
A Go developer who has written REST APIs (maybe with Gin) and some unit tests, but **has never heard of Keploy**. Knows Docker basics.

### 2.2 Voice & style guide
- Short sentences. Active voice. Second person ("you").
- One idea per paragraph. No filler ("In this tutorial we will be going to…").
- Every step answers: **What do I do → What happens → Why it matters.**
- Honest: include the gotchas you actually hit.
- No copy-paste from Keploy docs; paraphrase and add your own insight.
- Target length: **8–12 minute read**; ~1,500–2,200 words plus code.

### 2.3 Tutorial outline (final structure)

1. **Hero / Title block** — "Test your Go API without writing tests: a Keploy quickstart with Gin + MongoDB". Meta: read time, difficulty, last updated, author, tags (Go, Gin, MongoDB, Testing).
2. **TL;DR** (callout) — 3 bullets of what you'll achieve.
3. **Why Keploy? (the problem)** — Writing mocks and integration tests by hand is slow; mocks drift; Keploy records real traffic + dependency calls and replays them.
4. **How Keploy works** — diagram: *Record: Client → App → Mongo (Keploy captures both) ⇢ Replay: Keploy → App (mocked Mongo)*.
5. **What you'll build / prerequisites** — checklist component.
6. **Step 1 — Install Keploy** (with OS tabs if relevant)
7. **Step 2 — Get the sample app** (clone + quick tour of routes)
8. **Step 3 — Start MongoDB**
9. **Step 4 — Record test cases** (`keploy record`) + fire API calls (tabbed curl examples)
10. **Step 5 — Peek inside what Keploy generated** (YAML test + mock, annotated)
11. **Step 6 — Replay with `keploy test`** (passing output)
12. **Step 7 — Break it on purpose** (failing diff — the "a-ha")
13. **Troubleshooting** (accordion of real errors you hit)
14. **Where this fits in your workflow** — CI, regression safety net, vs unit tests (honest trade-offs)
15. **Next steps** — links to Keploy docs, GitHub, Discord, other Go quickstarts
16. **Footer** — author, repo link, "Built with Next.js + MDX".

### 2.4 Callout inventory (plan where each goes)
| Type | Placement |
|---|---|
| `info` | Why Keploy uses eBPF / what "mock" means here |
| `tip` | Use `--delay` / build-delay if the app is slow to start |
| `warning` | Don't commit secrets; mocks may contain data — review before sharing |
| `note` | Versions tested on |
| `danger` | Port conflicts / Mongo not reachable error |

---

## Phase 3 — Project Scaffolding

### 3.1 Commands
```bash
npx create-next-app@latest keploy-go-quickstart --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd keploy-go-quickstart

# MDX
npm i @next/mdx @mdx-js/loader @mdx-js/react @types/mdx

# Highlighting + MDX plugins
npm i rehype-pretty-code shiki rehype-slug rehype-autolink-headings remark-gfm

# UI
npx shadcn@latest init
npx shadcn@latest add button tabs badge tooltip separator sheet accordion
npm i next-themes lucide-react framer-motion clsx tailwind-merge
```

### 3.2 Folder structure
```
keploy-go-quickstart/
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx          # fonts, ThemeProvider, metadata
│  │  ├─ page.mdx            # (or page.tsx importing content/tutorial.mdx)
│  │  ├─ globals.css         # design tokens, prose styles
│  │  └─ opengraph-image.tsx # optional OG image
│  ├─ components/
│  │  ├─ mdx/                # Callout, Steps, CodeBlock, Diagram, Tabs, etc.
│  │  ├─ layout/             # Header, Footer, TOC, ThemeToggle, ReadingProgress
│  │  └─ ui/                 # shadcn components
│  ├─ content/
│  │  └─ tutorial.mdx
│  └─ lib/utils.ts
├─ mdx-components.tsx        # maps MD elements → custom components
├─ next.config.mjs           # withMDX + rehype/remark plugins
├─ public/images/
├─ README.md
└─ production.md
```

### 3.3 `next.config.mjs` requirements
- `pageExtensions: ['js','jsx','md','mdx','ts','tsx']`
- `createMDX({ options: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, {behavior:'wrap'}], [rehypePrettyCode, { theme: { dark: 'github-dark-dimmed', light: 'github-light' }, keepBackground: false }]] } })`
- `output: 'export'` is optional — a plain Vercel deploy is already static for this page; keep default unless you want pure static export.

### 3.4 Exit criteria
`npm run dev` shows a rendered MDX page with a code block highlighted and a React component embedded inside MDX.

---

## Phase 4 — Design System

### 4.1 Visual direction
**"Calm, technical, trustworthy."** Think Stripe Docs × Vercel Docs × Keploy's brand (orange accent). Generous whitespace, strong typographic hierarchy, subtle borders instead of heavy shadows.

### 4.2 Design tokens

| Token | Light | Dark |
|---|---|---|
| Background | `#FFFFFF` | `#0B0D12` |
| Surface / cards | `#F8F9FB` | `#12151C` |
| Border | `#E5E7EB` | `#232733` |
| Text primary | `#0F172A` | `#E6E8EE` |
| Text muted | `#64748B` | `#94A3B8` |
| **Accent (Keploy orange)** | `#F97316` | `#FB923C` |
| Info | `#2563EB` | `#60A5FA` |
| Success | `#16A34A` | `#4ADE80` |
| Warning | `#D97706` | `#FBBF24` |
| Danger | `#DC2626` | `#F87171` |

- Radius: `0.75rem` cards, `0.5rem` buttons.
- Content max width: **72ch** prose; page max width **1200px**.
- Type scale: H1 `clamp(2rem, 4vw, 3rem)` · H2 `1.75rem` · H3 `1.25rem` · body `1.0625rem / 1.75`.
- Code font: JetBrains Mono 14px, line-height 1.7.

### 4.3 Layout spec (desktop ≥1024px)
```
┌──────────────────────────────────────────────────────────┐
│ Header: logo/title · GitHub link · theme toggle           │
├──────────────┬─────────────────────────────┬─────────────┤
│ Left rail    │ Article (72ch)              │ Right TOC   │
│ (optional    │ Hero → TL;DR → Steps …      │ sticky,     │
│  step nav)   │                             │ scrollspy   │
├──────────────┴─────────────────────────────┴─────────────┤
│ Footer                                                    │
└──────────────────────────────────────────────────────────┘
```
- **Tablet:** TOC collapses to a "On this page" dropdown at top of article.
- **Mobile:** single column; sticky header with a Sheet-based TOC button; code blocks scroll horizontally.
- Thin **reading progress bar** (accent color) under the header.

### 4.4 Master design prompt (use with an AI coding assistant / v0 / Claude)

```text
You are a senior frontend engineer and product designer. Build the UI shell for a single-page
developer documentation site using Next.js 15 (App Router, TypeScript), Tailwind CSS, shadcn/ui,
lucide-react, next-themes, and framer-motion. The content comes from an MDX file.

DESIGN GOALS
- Calm, technical, trustworthy — in the spirit of Stripe Docs and Vercel Docs.
- Brand accent is Keploy orange (#F97316 light / #FB923C dark). Use it sparingly: links on hover,
  active TOC item, progress bar, primary buttons, step numbers.
- Generous whitespace, subtle 1px borders instead of heavy shadows, rounded-xl cards.
- Fully responsive (320px → 1440px). No horizontal page scroll at any width.
- WCAG AA contrast in both themes; visible focus rings; semantic HTML; keyboard navigable.

LAYOUT
- Sticky translucent header (backdrop-blur) with: site title on the left, a GitHub icon link and a
  theme toggle (sun/moon, supports light/dark/system) on the right.
- A 2px reading-progress bar pinned directly under the header.
- Desktop: centered article column (max 72ch) with a sticky right-hand "On this page" table of
  contents that scroll-spies the current H2/H3 and highlights it with the accent color.
- Tablet/mobile: TOC becomes a collapsible "On this page" control (shadcn Sheet on mobile).
- Hero section: eyebrow badge ("Go · Gin · MongoDB"), H1, one-sentence subtitle, meta row
  (read time, difficulty, last updated, author) and a subtle radial-gradient / grid background.
- Footer: author, GitHub repo link, "Built with Next.js + MDX".

TYPOGRAPHY
- Inter for text, JetBrains Mono for code, loaded via next/font with display: swap.
- Body 17px / 1.75, headings tight (-0.02em tracking), H2 has a subtle top border + anchor link icon
  that appears on hover.

THEMING
- next-themes with attribute="class", defaultTheme="system", no flash on load.
- Define colors as CSS variables in globals.css for both :root and .dark.

MOTION
- Subtle only: fade/slide-up on section entry (framer-motion, once: true), 150ms hover
  transitions. Respect prefers-reduced-motion.

OUTPUT
- layout.tsx, globals.css, Header, Footer, ThemeToggle, ReadingProgress, TableOfContents (auto-built
  from headings with IntersectionObserver), and the page wrapper.
- Clean, commented, production-ready code. No placeholder lorem ipsum. No unused dependencies.
```

---

## Phase 5 — Custom MDX Components

Map these in `mdx-components.tsx` so they're usable in MDX **without imports**.

### 5.1 Component list

| Component | Purpose | Key props |
|---|---|---|
| `<Callout>` | info / tip / note / warning / danger boxes | `type`, `title` |
| `<Steps>` + `<Step>` | Numbered vertical timeline for the tutorial steps | `title` |
| `<CodeBlock>` (pre override) | Language label, filename tab, copy button, line highlight, optional terminal prompt styling | `title`, `lang` |
| `<CodeTabs>` | OS / client tabs (e.g., curl vs Postman) using shadcn Tabs | `items` |
| `<FlowDiagram>` | Animated Record → Replay diagram | — |
| `<Checklist>` | Prerequisites with checkable items | `items` |
| `<FileTree>` | Show project/generated folder structure | `tree` |
| `<Accordion>` wrappers | Troubleshooting FAQs | — |
| `<ReadingMeta>` | Read time, difficulty, last updated badges | — |
| `<NextSteps>` | Card grid of links | `links` |

### 5.2 Component prompts

**Callout**
```text
Create a React + Tailwind <Callout> component for MDX with props type: "info" | "tip" | "note" |
"warning" | "danger" and optional title. Each type has its own lucide icon (Info, Lightbulb,
StickyNote, AlertTriangle, OctagonAlert), a 4px left border in the semantic color, a tinted
background (≈8% opacity light, ≈12% dark), rounded-lg, and readable text in both themes. Children
may contain markdown paragraphs, inline code and links; style inline <code> inside it. Add
role="note" (or role="alert" for danger). Provide TypeScript types and a default title per type.
```

**CodeBlock**
```text
Override MDX <pre> to render a CodeBlock designed for rehype-pretty-code output. Features: header
bar with filename/title (from data-title or meta) and language badge; one-click copy button
(lucide Copy → Check, 2s feedback, aria-live announcement); line numbers optional; highlighted
lines and highlighted words styled with the accent color at low opacity; horizontal scroll on
overflow; dual themes (light/dark via CSS variables from shiki); terminal blocks (lang=bash/sh)
show a muted "$" prompt that is NOT copied. Keep it a small client component; the highlighting
itself happens at build time.
```

**Steps**
```text
Create <Steps> and <Step title="..."> for MDX. Render a vertical timeline: a numbered circle
(accent color, auto-incremented via CSS counters), a 2px connecting line, the step title as an
H3 (so the TOC picks it up and it has an id/anchor), and the step content indented beside it.
On mobile, shrink the circle and reduce indentation. Must work when Step children contain
code blocks and callouts.
```

**FlowDiagram**
```text
Build an inline-SVG + Tailwind <FlowDiagram> explaining Keploy's two modes side by side.
RECORD lane: Client → Your Go App → MongoDB, with dashed arrows from the app and the DB to a
"Keploy" box labelled "captures requests, responses & DB calls". REPLAY lane: Keploy → Your Go App
→ "Mocked MongoDB (from recorded mocks)", with a "Compare responses ✔/✘" result chip.
Use theme CSS variables so it works in light/dark, subtle animated dashed lines (stroke-dashoffset,
disabled for reduced motion), rounded nodes, and accessible <title>/<desc>. Stack lanes vertically
on mobile.
```

**TableOfContents**
```text
Create a client <TableOfContents> that collects h2/h3 elements inside the article after mount,
renders nested links, and uses IntersectionObserver (rootMargin "0px 0px -70% 0px") to highlight
the active heading with a left accent bar. Smooth-scroll on click, update the URL hash, support
keyboard navigation, and hide on screens < 1024px (a separate mobile Sheet reuses the same data).
```

### 5.3 Exit criteria
A throwaway test MDX file renders every component correctly in both themes and on mobile.

---

## Phase 6 — Write the MDX Tutorial

### 6.1 Frontmatter / metadata
```mdx
export const metadata = {
  title: "Test your Go API without writing tests — Keploy + Gin + MongoDB",
  description: "A beginner-friendly walkthrough of recording and replaying API tests with Keploy.",
}
```

### 6.2 Writing prompt (use with an AI assistant as a *drafting aid only* — rewrite in your voice)

```text
Act as a DevRel editor. I will give you my raw notes from running the Keploy Gin + MongoDB Go
quickstart. Turn them into a crisp, beginner-friendly tutorial in MDX.

AUDIENCE: Go developers who write REST APIs but have never used Keploy.
VOICE: Friendly, direct, second person, short sentences, zero fluff. Explain the WHY before the HOW.
LENGTH: 1,500–2,200 words excluding code.

STRUCTURE (use exactly): TL;DR → Why Keploy → How it works (use <FlowDiagram />) → Prerequisites
(<Checklist />) → Step 1 Install → Step 2 Get the sample → Step 3 Start MongoDB → Step 4 Record →
Step 5 Inspect generated tests & mocks → Step 6 Replay → Step 7 Break it on purpose →
Troubleshooting → Where it fits in your workflow → Next steps.

RULES
- Wrap steps in <Steps><Step title="…">…</Step></Steps>.
- Use <Callout type="info|tip|note|warning|danger"> for gotchas, explanations and warnings.
- Every command goes in a fenced code block with a language and, where useful, title="…".
- After every command, say in one sentence what just happened and why it matters.
- Include real terminal output from my notes (trim noise; don't invent output).
- Do NOT copy sentences from Keploy's official docs. Paraphrase and add original insight.
- Be honest about limitations and trade-offs.
- No marketing superlatives. No emojis in headings.
- Output valid MDX only (no unclosed JSX tags).

MY NOTES:
<paste the filled notes template here>
```

> ⚠️ Never let the draft contain commands or output you didn't actually run. Re-run every command against your final text.

### 6.3 Section-by-section content guidance

| Section | Must contain |
|---|---|
| TL;DR | What you'll do, what you'll learn, time needed |
| Why Keploy | The pain of hand-written mocks; "tests from real traffic"; 3 benefits max |
| How it works | Diagram + 4-sentence explanation of record vs replay and what a "mock" is |
| Step 4 Record | The command, explanation of each flag, the API calls (CodeTabs), what appears in the terminal |
| Step 5 Inspect | FileTree of `keploy/` + one annotated test YAML + one annotated mock YAML |
| Step 6 Replay | Passing report output; explain pass criteria |
| Step 7 Break it | Change a handler → failing diff → fix → green again |
| Troubleshooting | 3–5 real issues from *your* run, each with cause + fix |
| Workflow fit | When Keploy shines, when to still write unit tests, CI hint |

### 6.4 Quality checklist for the content
- [ ] Every command was run by me, in the order written
- [ ] Versions stated (Keploy, Go, Docker, OS)
- [ ] Each step explains the *why*
- [ ] No sentence copied from Keploy docs
- [ ] Spell-checked; consistent capitalization (**Keploy**, **MongoDB**, **Gin**)
- [ ] All links work and open appropriately (external → new tab with `rel="noopener noreferrer"`)
- [ ] Images have meaningful `alt` text

---

## Phase 7 — Polish & UX

### 7.1 Polish prompt
```text
Review my Next.js + MDX documentation page and improve it WITHOUT adding new dependencies:
1. Accessibility: heading order, landmarks (header/main/aside/footer), aria-labels for icon buttons,
   focus-visible rings, color contrast AA in both themes, skip-to-content link.
2. Responsiveness: test 320, 375, 768, 1024, 1440px; fix overflow, tap targets ≥ 44px.
3. Performance: next/image for screenshots with width/height + blur placeholder, no layout shift,
   fonts via next/font, minimal client JS (only copy button, TOC, theme toggle, progress bar).
4. SEO/share: metadata, canonical, Open Graph + Twitter card (generated OG image), favicon.
5. Micro-interactions: hover states, copy-button feedback, smooth anchor scroll with scroll-margin-top
   so headings aren't hidden under the sticky header, reduced-motion support.
6. Print stylesheet: hide header/TOC, expand code blocks.
Return a prioritized list of changes with code diffs.
```

### 7.2 Bonus-point checklist
- [ ] Dark / light / system toggle with no flash
- [ ] Copy-to-clipboard on all code blocks
- [ ] Scroll-spy TOC + reading progress bar
- [ ] Animated Record/Replay diagram
- [ ] Tabs for curl/Postman examples
- [ ] Step timeline component
- [ ] "Back to top" button
- [ ] Keyboard shortcut hint for theme toggle (optional)
- [ ] Custom OG image + favicon (Keploy-orange)
- [ ] Lighthouse ≥ 95 in Performance, Accessibility, Best Practices, SEO

---

## Phase 8 — QA & Repo Hygiene

### 8.1 Technical QA
```bash
npm run lint
npm run build      # must succeed with zero errors/warnings
npm run start      # smoke test the production build
```
- [ ] No console errors / hydration warnings
- [ ] No unused imports/components/dependencies
- [ ] Works in Chrome, Firefox, Safari (or at least Chrome + Firefox)
- [ ] Theme persists across reload; no flash
- [ ] Anchors/TOC links work, including direct deep-links (`/#step-4-record`)

### 8.2 Content QA
- [ ] Read the whole tutorial aloud once — cut anything wordy
- [ ] Ask a friend (or fresh Claude chat) to follow it step-by-step and report where they got stuck
- [ ] Re-run all commands from a clean directory to confirm reproducibility
- [ ] Spell-check with a tool (e.g., `cspell`) — typos are an explicit evaluation criterion

### 8.3 Repo hygiene
- [ ] `.gitignore` includes `node_modules`, `.next`, `.env*`, `.vercel`
- [ ] No secrets, no stray files, no giant images
- [ ] Meaningful commits (e.g., `feat: add Callout component`, `docs: write step 4 record`) — avoid one giant "final" commit
- [ ] MIT license (optional)
- [ ] **README.md** with: project title, live link, screenshot, tech stack, features, local setup, project structure, and a short "what I learned" note

### 8.4 README template
```md
# Keploy Go Quickstart — Next.js + MDX Tutorial

A beginner-friendly tutorial for recording and replaying API tests with Keploy,
using the Gin + MongoDB Go sample. Built with Next.js, MDX, Tailwind CSS and shadcn/ui.

🔗 **Live:** <vercel-url>

![Screenshot](./public/images/screenshot.png)

## Features
- MDX-powered tutorial with custom React components (Callout, Steps, CodeTabs…)
- Build-time syntax highlighting with copy buttons
- Dark / light mode, scroll-spy table of contents, reading progress
- Fully responsive, accessible, static

## Tech stack
Next.js (App Router) · TypeScript · MDX · Tailwind CSS · shadcn/ui · rehype-pretty-code · next-themes

## Run locally
```bash
git clone <repo-url>
cd keploy-go-quickstart
npm install
npm run dev
```

## Structure
`src/content/tutorial.mdx` → the tutorial · `src/components/mdx/` → MDX components

## What I learned
(2–3 honest sentences about Keploy and building with MDX)
```

---

## Phase 9 — Deploy & Submit

### 9.1 GitHub
```bash
git init
git add .
git commit -m "feat: initial Next.js + MDX Keploy tutorial"
git branch -M main
git remote add origin https://github.com/<username>/keploy-go-quickstart.git
git push -u origin main
```
Make sure the repo is **Public**.

### 9.2 Vercel
1. Go to vercel.com → **Add New → Project** → import the GitHub repo.
2. Framework preset: **Next.js** (auto-detected). No env vars needed.
3. Deploy → open the URL → verify in an incognito window on desktop **and** a phone.
4. Optional: set a clean project name so the URL looks professional (e.g., `keploy-go-quickstart.vercel.app`).

### 9.3 Final pre-submission checklist
- [ ] GitHub repo is public and README renders correctly
- [ ] Vercel URL loads fast, no 404s, images load
- [ ] Dark/light toggle works on the live site
- [ ] Deep links work on the live site
- [ ] Tutorial commands re-verified one last time
- [ ] Links in the tutorial all resolve

### 9.4 Submission email (reply to the assignment thread)
```text
Subject: Keploy DevRel Assignment — <Your Name>

Hi <Name / Keploy team>,

Thanks for the assignment — I enjoyed it. Here are my deliverables:

1. GitHub repository: <github-url>
2. Live deployment (Vercel): <vercel-url>

Quick summary: I ran the Gin + MongoDB Go quickstart end-to-end, recorded API test cases with
Keploy, replayed them, and wrote an original beginner-friendly tutorial in MDX. The site is built
with Next.js, Tailwind and shadcn/ui, with a dark/light toggle, scroll-spy table of contents and
custom MDX components (callouts, step timeline, tabbed code, animated record/replay diagram).

One thing I found most interesting: <your genuine a-ha moment>.

Happy to walk through any decision or answer questions.

Best,
<Your Name>
```

---

## Appendix A — Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Keploy doesn't capture traffic on your OS | Use WSL2/Linux VM or Docker mode as per docs; note it in Troubleshooting |
| Quickstart commands changed vs this plan | Trust live docs and your terminal; update the tutorial accordingly |
| MDX + shiki config errors | Start with a minimal config, add plugins one at a time |
| Over-engineering UI, under-investing in content | Content quality is the top criterion — **finish the tutorial before polishing visuals** |
| Copying docs verbatim | Write from your notes; use the AI only as an editor, then rewrite in your voice |
| Time overrun | Cut order: animations → FileTree → OG image → extra tabs. Never cut: working tutorial, dark mode, copy button, clean repo |

## Appendix B — Priority Ladder (if time is short)

1. **Must:** Keploy run completed, tutorial in MDX, deployed, public repo, README
2. **Should:** Callouts, syntax highlighting, responsive layout, dark mode
3. **Nice:** Scroll-spy TOC, copy buttons, tabs, Steps timeline
4. **Delight:** Animated diagram, OG image, reading progress, Lighthouse 95+

## Appendix C — Useful Links
- Keploy docs (Quickstart → Go filter): https://keploy.io/docs
- Keploy samples-go repo: https://github.com/keploy/samples-go
- Next.js MDX guide: https://nextjs.org/docs/app/guides/mdx
- shadcn/ui: https://ui.shadcn.com
- rehype-pretty-code: https://rehype-pretty-code.netlify.app
- next-themes: https://github.com/pacocoursey/next-themes
- Vercel deploy docs: https://vercel.com/docs
