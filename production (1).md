# production.md — Keploy DevRel Assignment: Build Plan (v2)

> **Goal:** Ship a single-page, static documentation site (**Next.js + MDX**) containing an original, beginner-friendly tutorial based on running a **Keploy Go quickstart**. Source goes to a public GitHub repo; the site is deployed on Vercel.
>
> **Deliverables (reply with exactly these two):**
> 1. Public GitHub repository URL
> 2. Live Vercel deployment URL
>
> **What changed in v2:** one monorepo with separate `backend/` (the Go + Keploy sample) and `frontend/` (the Next.js + MDX site); every dependency is installed **locally inside the project**, never globally; a setup/verification script keeps the environment isolated and reproducible.

---

## 0. Assignment Decoded

| Requirement | What it means in practice |
|---|---|
| Next.js | App Router, TypeScript, statically rendered page |
| MDX content | Tutorial lives in a `.mdx` file; React components used *inside* the markdown |
| UI library | Tailwind CSS + shadcn/ui |
| Doc-like tutorial | Step-by-step, syntax-highlighted code, callouts, a diagram |
| Own voice | **Do not copy-paste Keploy docs.** Crisp, to the point, explain the *why* |
| Run Keploy for real | `keploy record` + `keploy test` must actually be run; outputs and screenshots come from *your* run |
| Bonus | Polished UI, dark/light toggle, good use of UI-library components |

**Evaluation lens (design every decision around it):**
1. Content quality — clear, accurate, helpful *(highest weight)*
2. Technical implementation — Next.js + MDX, static
3. UI/UX — clean, professional, readable
4. Attention to detail — code works, no typos, clean GitHub repo

---

## 1. Tech Stack (strictly what the assignment asks for)

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js** (App Router) + TypeScript | Required |
| Content | **MDX** via `@next/mdx` | Required |
| UI library | **Tailwind CSS + shadcn/ui** (+ `lucide-react` icons) | Assignment allows any UI library |
| Code highlighting | `rehype-pretty-code` + `shiki` | Build-time, zero client JS |
| Theme | `next-themes` | Dark/light/system, no flash |
| Fonts | `next/font` → Inter + JetBrains Mono | |
| Motion (optional) | `framer-motion` | Subtle only |
| **Backend** | **Go + Gin + MongoDB** (Keploy `samples-go/gin-mongo`) | The app Keploy records & replays against |
| Testing tool | **Keploy CLI** | The subject of the tutorial |
| Hosting | **Vercel** (frontend only) + **GitHub** | Required |

> **Important:** the "backend" is **not** a server for the website. The website is fully static. The backend is the Go sample app you run locally so Keploy can record and replay tests. It is never deployed — only its source and your recorded `keploy/` folder live in the repo as proof of your run.

**Chosen quickstart:** Gin + MongoDB (User Profile CRUD). **Fallback:** Echo + SQL (URL Shortener).

> ✅ Always confirm commands/flags against the **live Keploy docs** and your own terminal. Keploy's CLI and sample layout change between versions.

---

## 2. Environment Isolation — "nothing installed globally"

### 2.1 Reality check about `venv`
`venv` is a **Python** tool. This stack is Node (frontend) + Go (backend), so the equivalents are:

| Ecosystem | Isolation mechanism (replaces `venv`) | Where it lives |
|---|---|---|
| Node / Next.js | Local `node_modules` + `package-lock.json` + pinned Node via `.nvmrc` | `frontend/` |
| Go | `go.mod`/`go.sum` + project-local `GOPATH`, `GOMODCACHE`, `GOBIN` | `backend/.gopath`, `backend/.bin` |
| Python (only if you ever add a helper script) | `python3 -m venv .venv` | `tools/.venv` (optional, see 2.5) |
| Everything (strongest isolation, optional) | Run backend + MongoDB entirely in Docker | `backend/docker-compose.yml` |

### 2.2 Rules
- ❌ **Never** run `npm install -g …`, `go install …` without `GOBIN` set, or `sudo pip install …`.
- ✅ Every npm package is a **local** dependency (`npm i …` run inside `frontend/`).
- ✅ One-off CLIs run through `npx` (e.g., `npx shadcn@latest add button`) — nothing is installed globally.
- ✅ Pin versions: `.nvmrc`, `engines` in `package.json`, `save-exact=true` in `.npmrc`, committed lockfile.
- ✅ Go modules are managed by `go.mod`; env script redirects Go's caches into `backend/`.
- ✅ Prefer running the Go app + MongoDB **in Docker** so Go itself isn't needed globally.

### 2.3 The only unavoidable system-level installs
These are tools, not project dependencies. Install once, per their official docs:
- **Node version manager** (`nvm` / `fnm`) — to get the Node version in `.nvmrc`
- **Docker** — to run MongoDB (and optionally the Go app)
- **Git**
- **Keploy CLI** — the official installer typically places a single binary on your `PATH` (commonly `/usr/local/bin`). Check the install docs: if it lets you choose a location, use `backend/.bin`; otherwise it is one binary that you can delete after the assignment. Keploy's recording also needs elevated/eBPF privileges on Linux, so a project-local binary may still be run with `sudo` — follow the docs for your OS.
- **Go** — only if you run the backend outside Docker.

### 2.4 Isolation scripts

**`scripts/env.sh`** — `source` this before working on the backend
```bash
#!/usr/bin/env bash
# Usage: source scripts/env.sh
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Keep Go's caches and installed tools inside the repo (git-ignored)
export GOPATH="$ROOT/backend/.gopath"
export GOMODCACHE="$GOPATH/pkg/mod"
export GOBIN="$ROOT/backend/.bin"

# Project-local binaries first (Go tools, node_modules/.bin)
export PATH="$GOBIN:$ROOT/frontend/node_modules/.bin:$PATH"

mkdir -p "$GOBIN"
echo "✔ Project-local env active (GOPATH=$GOPATH)"
```

**`scripts/setup.sh`** — one-command bootstrap
```bash
#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
source "$ROOT/scripts/env.sh"

# Frontend: exact Node version + clean, lockfile-based install (local only)
cd "$ROOT/frontend"
if command -v nvm >/dev/null 2>&1; then nvm install && nvm use; fi
npm ci

# Backend: download Go modules into the project-local cache (skip if using Docker only)
if command -v go >/dev/null 2>&1; then
  cd "$ROOT/backend" && go mod download
fi
echo "✔ Setup complete"
```

**`scripts/check-env.sh`** — prove nothing leaked globally
```bash
#!/usr/bin/env bash
set -uo pipefail
echo "node: $(node -v)   npm: $(npm -v)"
echo "--- global npm packages (should list only npm/corepack) ---"
npm ls -g --depth=0 || true
if command -v go >/dev/null 2>&1; then
  echo "go: $(go version)"; echo "GOPATH=$(go env GOPATH)"; echo "GOBIN=$(go env GOBIN)"
fi
echo "--- Keploy ---"; command -v keploy && keploy --version || echo "keploy not on PATH"
```

### 2.5 Optional: Python `.venv` (only if you add a Python helper)
Nothing in this assignment needs Python. If you choose to add one (e.g., an image-optimisation script for screenshots):
```bash
mkdir -p tools && cd tools
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install pillow
pip freeze > requirements.txt
deactivate
```
`.venv/` is git-ignored; `requirements.txt` is committed.

---

## 3. Monorepo Folder Structure

```
keploy-go-quickstart/                 # ← the single public GitHub repo
├─ README.md                          # project overview, live link, how to run
├─ production.md                      # this plan (optional to keep in repo)
├─ LICENSE
├─ .gitignore
├─ .editorconfig
├─ Makefile                           # shortcuts: make setup / dev / build / record / test
│
├─ scripts/
│  ├─ env.sh                          # project-local Go/PATH env
│  ├─ setup.sh                        # one-command bootstrap
│  └─ check-env.sh                    # verify nothing is global
│
├─ docs/                              # NOT published; your working material
│  ├─ run-notes.md                    # notes template from Phase 1
│  ├─ raw-output/                     # pasted terminal output (record/test/diff)
│  └─ screenshots-raw/                # un-optimised originals
│
├─ backend/                           # Keploy Go sample (Gin + MongoDB) — never deployed
│  ├─ README.md                       # attribution to keploy/samples-go + how I ran it
│  ├─ go.mod
│  ├─ go.sum
│  ├─ main.go                         # sample source (names may differ per sample version)
│  ├─ (handlers / models / db files)  # exactly as in the sample — don't restructure
│  ├─ Dockerfile
│  ├─ docker-compose.yml
│  ├─ keploy.yml                      # generated by `keploy config --generate`
│  ├─ keploy/                         # GENERATED by your run (your proof of work)
│  │  └─ test-set-0/
│  │     ├─ tests/                    #   recorded test cases (YAML)
│  │     └─ mocks.yml                 #   recorded dependency mocks (YAML)
│  ├─ .env.example
│  ├─ .gopath/                        # git-ignored (project-local Go cache)
│  └─ .bin/                           # git-ignored (project-local Go tools)
│
└─ frontend/                          # Next.js + MDX documentation site — deployed to Vercel
   ├─ package.json                    # exact versions + "engines"
   ├─ package-lock.json               # committed
   ├─ .nvmrc                          # pinned Node (LTS)
   ├─ .npmrc                          # save-exact=true, engine-strict=true
   ├─ next.config.mjs                 # withMDX + remark/rehype plugins
   ├─ tsconfig.json
   ├─ postcss.config.mjs
   ├─ components.json                 # shadcn/ui config
   ├─ eslint.config.mjs
   ├─ mdx-components.tsx              # maps Markdown elements → custom components
   ├─ public/
   │  ├─ images/                      # optimised screenshots (WebP/PNG)
   │  └─ favicon.ico
   └─ src/
      ├─ app/
      │  ├─ layout.tsx                # fonts, ThemeProvider, metadata
      │  ├─ page.tsx                  # imports content/tutorial.mdx inside page shell
      │  ├─ globals.css               # design tokens (CSS variables), prose styles
      │  └─ opengraph-image.tsx       # optional social card
      ├─ content/
      │  └─ tutorial.mdx              # ← THE TUTORIAL
      ├─ components/
      │  ├─ ui/                       # shadcn: button, tabs, badge, tooltip, accordion, sheet, separator
      │  ├─ layout/
      │  │  ├─ Header.tsx
      │  │  ├─ Footer.tsx
      │  │  ├─ ThemeProvider.tsx
      │  │  ├─ ThemeToggle.tsx
      │  │  ├─ ReadingProgress.tsx
      │  │  ├─ TableOfContents.tsx
      │  │  └─ BackToTop.tsx
      │  └─ mdx/
      │     ├─ Callout.tsx
      │     ├─ Steps.tsx              # <Steps> + <Step>
      │     ├─ CodeBlock.tsx          # <pre> override with copy button
      │     ├─ CodeTabs.tsx
      │     ├─ FlowDiagram.tsx        # Record → Replay SVG diagram
      │     ├─ Checklist.tsx
      │     ├─ FileTree.tsx
      │     ├─ NextSteps.tsx
      │     └─ ReadingMeta.tsx
      ├─ lib/
      │  └─ utils.ts                  # cn() helper
      └─ types/
         └─ mdx.d.ts
```

> **Attribution:** the backend code comes from Keploy's open-source `samples-go`. Copy only the chosen sample folder into `backend/`, delete its nested `.git` if any, keep its license notice, and say so in `backend/README.md`. Your own contribution is the generated `keploy/` folder and the tutorial.

### 3.1 `.gitignore`
```gitignore
# Node / Next.js
frontend/node_modules/
frontend/.next/
frontend/out/
frontend/.vercel/
frontend/*.tsbuildinfo
npm-debug.log*

# Go (project-local env)
backend/.gopath/
backend/.bin/
backend/*.exe
backend/*.test
backend/*.out

# Env & secrets
.env
.env.*
!.env.example

# Optional Python helper env
tools/.venv/
__pycache__/

# OS / editor
.DS_Store
.idea/
.vscode/*
!.vscode/extensions.json

# Raw working material (keep notes, drop heavy originals)
docs/screenshots-raw/
```

### 3.2 `Makefile`
```makefile
setup:      ; bash scripts/setup.sh
check:      ; bash scripts/check-env.sh
dev:        ; cd frontend && npm run dev
build:      ; cd frontend && npm run build
lint:       ; cd frontend && npm run lint
db-up:      ; cd backend && docker compose up -d mongo   # service name per the sample
db-down:    ; cd backend && docker compose down
# record / test targets: fill in with the exact Keploy commands you verified in Phase 1
```

---

## 4. Phase Overview

| Phase | Name | Output |
|---|---|---|
| 0 | Environment & repo setup | Isolated tooling, repo skeleton, scripts |
| 1 | Run Keploy (backend) | Working record/replay, notes, outputs, screenshots |
| 2 | Content blueprint | Final outline + voice guide |
| 3 | Frontend scaffolding | Next.js + MDX + Tailwind + shadcn in `frontend/` |
| 4 | Design system | Tokens, typography, layout, dark mode |
| 5 | Custom MDX components | Callout, Steps, CodeBlock, Tabs, Diagram, TOC… |
| 6 | Write the MDX tutorial | `frontend/src/content/tutorial.mdx` |
| 7 | Polish & UX | Responsive, a11y, motion, SEO, performance |
| 8 | QA & repo hygiene | Lint, typos, links, Lighthouse, README |
| 9 | Deploy & submit | GitHub + Vercel + submission email |

Suggested time: **P0 (30m) · P1 (2–3h) · P2 (45m) · P3–5 (3–4h) · P6 (2h) · P7–9 (2h)**.

---

## Phase 0 — Environment & Repo Setup

```bash
mkdir keploy-go-quickstart && cd keploy-go-quickstart
git init -b main
mkdir -p backend frontend docs/raw-output docs/screenshots-raw scripts
touch README.md LICENSE .gitignore .editorconfig Makefile
# create scripts/env.sh, setup.sh, check-env.sh from section 2.4
chmod +x scripts/*.sh
git add . && git commit -m "chore: initialise monorepo skeleton"
```
- [ ] `.gitignore` from §3.1 in place **before** the first install
- [ ] `source scripts/env.sh` works
- [ ] Node pinned (`frontend/.nvmrc` — LTS, e.g. `20` or `22`)

**Exit criteria:** repo skeleton committed; isolation scripts present.

---

## Phase 1 — Run Keploy (work in `backend/`)

### 1.1 Steps
1. Open Keploy docs → Quickstart → filter **Go** → pick **Gin + Mongo**.
2. Install Keploy per the docs (see §2.3 note).
3. Clone `keploy/samples-go` **outside** the repo (e.g., `/tmp`), copy the `gin-mongo` folder contents into `backend/`, remove any nested `.git`.
4. `cd backend` → start MongoDB (Docker) as the sample's README says.
5. Run `keploy record` with the sample's start command (Docker-based or native, per live docs).
6. Fire **5–6 varied API calls** — create, read, update, delete, plus one invalid input — using `curl`/Postman.
7. Stop recording; inspect `backend/keploy/` (test cases + mocks).
8. Run `keploy test`; capture the passing report.
9. **Break something on purpose** (change a response field) → `keploy test` → capture the failing diff → revert. This is your best "a-ha" section.
10. Save terminal output into `docs/raw-output/` and screenshots into `docs/screenshots-raw/`.
11. Commit: `feat(backend): add gin-mongo sample and recorded keploy tests`.

### 1.2 Notes template → `docs/run-notes.md`
```md
## What I ran
- OS / versions (Keploy, Go, Docker):
- Sample chosen:
- Exact commands that worked, in order:

## Confusing moments (each becomes a callout)
1.
2.

## Errors + fixes
| Error | Cause | Fix |
|---|---|---|

## "A-ha!" moments
-

## What Keploy generated (structure of tests/ and mocks)
-

## Why a Go developer would care
-

## Screenshots / outputs to capture
- [ ] keploy record running
- [ ] API calls sent
- [ ] generated test YAML + mock YAML
- [ ] keploy test passing
- [ ] keploy test failing diff
```

**Exit criteria:** record + test succeeded; notes, outputs, screenshots saved; `backend/keploy/` committed.

---

## Phase 2 — Content Blueprint

### 2.1 Target reader
A Go developer who writes REST APIs and some unit tests, **has never heard of Keploy**, knows Docker basics.

### 2.2 Voice
Short sentences · active voice · second person · one idea per paragraph · every step answers **What do I do → What happens → Why it matters** · honest about gotchas · never copy Keploy docs. Target **8–12 min read** (~1,500–2,200 words + code).

### 2.3 Final outline
1. **Hero** — title, subtitle, meta (read time, difficulty, updated, author, tags)
2. **TL;DR** callout
3. **Why Keploy?** — hand-written mocks are slow and drift; Keploy turns real traffic into tests
4. **How it works** — `<FlowDiagram />` (record vs replay) + short explanation of "mock"
5. **Prerequisites** — `<Checklist />`
6. **Step 1** Install Keploy
7. **Step 2** Get the sample app (+ quick tour of its routes)
8. **Step 3** Start MongoDB
9. **Step 4** Record test cases (`<CodeTabs>` for curl / Postman)
10. **Step 5** Inspect generated tests & mocks (`<FileTree />` + annotated YAML)
11. **Step 6** Replay with `keploy test`
12. **Step 7** Break it on purpose
13. **Troubleshooting** — accordion of real errors you hit
14. **Where it fits** — CI, regression safety net, and honest limits vs unit tests
15. **Next steps** — `<NextSteps />`
16. **Footer**

### 2.4 Callout map
| Type | Use for |
|---|---|
| `info` | What a mock is; why Keploy needs elevated privileges / eBPF |
| `tip` | Build/start delay flags if the app starts slowly |
| `note` | Versions you tested on |
| `warning` | Recorded mocks may contain real data — review before sharing |
| `danger` | Port conflicts, Mongo unreachable |

---

## Phase 3 — Frontend Scaffolding (work in `frontend/`)

All commands run **from the repo root or `frontend/`** — no global installs.

```bash
# from repo root (folder `frontend` already exists and is empty → remove it first so the CLI can create it)
rmdir frontend
npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
cd frontend

# pin Node + exact versions (local config only)
node -v | cut -d. -f1 | sed 's/^v//' > .nvmrc
printf "save-exact=true\nengine-strict=true\n" > .npmrc

# MDX + content plugins (local deps)
npm i @next/mdx @mdx-js/loader @mdx-js/react
npm i -D @types/mdx

# Highlighting & markdown plugins
npm i rehype-pretty-code shiki rehype-slug rehype-autolink-headings remark-gfm

# UI (shadcn runs via npx — nothing global)
npx shadcn@latest init
npx shadcn@latest add button tabs badge tooltip separator sheet accordion

# Theme, icons, motion, helpers
npm i next-themes lucide-react framer-motion clsx tailwind-merge
```

Add to `package.json`:
```json
"engines": { "node": ">=20" }
```

### `next.config.mjs` requirements
- `pageExtensions: ['js','jsx','md','mdx','ts','tsx']`
- `createMDX` with `remarkPlugins: [remarkGfm]`
- `rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }], [rehypePrettyCode, { theme: { dark: 'github-dark-dimmed', light: 'github-light' }, keepBackground: false }]]`
- Optional `output: 'export'` for a pure static export; otherwise Vercel serves the page statically anyway.
- Note: with Turbopack, plugin options must be serialisable (use string plugin names) — if the build complains, use the webpack build or follow the current Next.js MDX guide.

Commit: `feat(frontend): scaffold Next.js + MDX + Tailwind + shadcn`.

**Exit criteria:** `npm run dev` renders an MDX page with a highlighted code block and an embedded React component. `bash scripts/check-env.sh` shows no stray global packages.

---

## Phase 4 — Design System

### 4.1 Direction
**Calm, technical, trustworthy** — Stripe Docs × Vercel Docs, with a Keploy-orange accent. Whitespace, strong hierarchy, 1px borders over heavy shadows.

### 4.2 Tokens (define as CSS variables in `src/app/globals.css` for `:root` and `.dark`)

| Token | Light | Dark |
|---|---|---|
| Background | `#FFFFFF` | `#0B0D12` |
| Surface | `#F8F9FB` | `#12151C` |
| Border | `#E5E7EB` | `#232733` |
| Text | `#0F172A` | `#E6E8EE` |
| Muted | `#64748B` | `#94A3B8` |
| **Accent** | `#F97316` | `#FB923C` |
| Info | `#2563EB` | `#60A5FA` |
| Success | `#16A34A` | `#4ADE80` |
| Warning | `#D97706` | `#FBBF24` |
| Danger | `#DC2626` | `#F87171` |

Radius `0.75rem` (cards) / `0.5rem` (buttons) · prose `72ch` · page max `1200px` · body `17px/1.75` · code JetBrains Mono `14px/1.7` · H1 `clamp(2rem,4vw,3rem)`.

### 4.3 Layout (desktop ≥ 1024px)
```
┌──────────────────────────────────────────────────────────┐
│ Header: title · GitHub link · theme toggle                │
│ ▔▔▔ 2px reading-progress bar ▔▔▔                          │
├──────────────────────────────────┬───────────────────────┤
│ Article (72ch)                   │ Sticky "On this page" │
│ Hero → TL;DR → Steps → …         │ TOC with scroll-spy   │
├──────────────────────────────────┴───────────────────────┤
│ Footer                                                    │
└──────────────────────────────────────────────────────────┘
```
Tablet: TOC becomes an "On this page" dropdown. Mobile: single column, TOC in a shadcn `Sheet`, code blocks scroll horizontally.

### 4.4 Master design prompt → output goes to `frontend/src/app/*` and `frontend/src/components/layout/*`
```text
You are a senior frontend engineer and product designer. Build the UI shell for a single-page
developer documentation site using Next.js (App Router, TypeScript), Tailwind CSS, shadcn/ui,
lucide-react, next-themes and framer-motion. Content comes from an MDX file at
src/content/tutorial.mdx. Work only inside the frontend/ directory and add NO global installs —
all packages are local dependencies.

DESIGN GOALS
- Calm, technical, trustworthy — in the spirit of Stripe Docs and Vercel Docs.
- Accent is Keploy orange (#F97316 light / #FB923C dark), used sparingly: link hover, active TOC
  item, progress bar, primary buttons, step numbers.
- Generous whitespace, 1px borders instead of heavy shadows, rounded-xl cards.
- Fully responsive 320px → 1440px, no horizontal page scroll. WCAG AA contrast in both themes,
  visible focus rings, semantic HTML, keyboard navigable, skip-to-content link.

LAYOUT
- Sticky translucent header (backdrop-blur): site title left; GitHub icon link and theme toggle
  (sun/moon, light/dark/system) right. 2px reading-progress bar pinned under the header.
- Desktop: centred article column (max 72ch) + sticky right TOC that scroll-spies H2/H3 and
  highlights the active item with the accent colour. Tablet/mobile: TOC in a collapsible control
  (shadcn Sheet on mobile).
- Hero: eyebrow badge ("Go · Gin · MongoDB"), H1, one-line subtitle, meta row (read time,
  difficulty, last updated, author), subtle radial-gradient/grid background.
- Footer: author, GitHub repo link, "Built with Next.js + MDX".

TYPOGRAPHY
- Inter for text, JetBrains Mono for code via next/font (display: swap). Body 17px/1.75, tight
  heading tracking (-0.02em); H2 has a subtle top border and an anchor icon on hover; headings
  use scroll-margin-top so the sticky header never covers them.

THEMING
- next-themes, attribute="class", defaultTheme="system", no flash. Colours as CSS variables in
  globals.css for :root and .dark.

MOTION
- Subtle fade/slide-up on section entry (once), 150ms hover transitions, honour
  prefers-reduced-motion.

OUTPUT FILES
- app/layout.tsx, app/page.tsx, app/globals.css, components/layout/{Header,Footer,ThemeProvider,
  ThemeToggle,ReadingProgress,TableOfContents,BackToTop}.tsx
- Clean, commented, production-ready TypeScript. No lorem ipsum, no unused dependencies.
```

---

## Phase 5 — Custom MDX Components (`frontend/src/components/mdx/`)

Register all of them in `frontend/mdx-components.tsx` so they work in MDX **without imports**.

| Component | Purpose | Key props |
|---|---|---|
| `Callout` | info / tip / note / warning / danger | `type`, `title` |
| `Steps` + `Step` | numbered vertical timeline | `title` |
| `CodeBlock` (`pre` override) | filename/lang header, copy button, line highlight, `$` prompt not copied | `title` |
| `CodeTabs` | curl vs Postman etc. (shadcn Tabs) | `items` |
| `FlowDiagram` | animated Record → Replay SVG | — |
| `Checklist` | prerequisites | `items` |
| `FileTree` | show `keploy/` output structure | `tree` |
| `NextSteps` | card grid of links | `links` |
| `ReadingMeta` | read time / difficulty / updated | — |

### Component prompts

**Callout**
```text
Create a React + Tailwind <Callout> for MDX in frontend/src/components/mdx/Callout.tsx. Props:
type "info"|"tip"|"note"|"warning"|"danger", optional title. Each type has its own lucide icon
(Info, Lightbulb, StickyNote, AlertTriangle, OctagonAlert), a 4px left border in the semantic
colour, tinted background (~8% light / ~12% dark), rounded-lg, readable in both themes. Children may
contain paragraphs, inline code and links — style inline <code>. role="note" (role="alert" for
danger). Default title per type. Fully typed.
```

**CodeBlock**
```text
Override MDX <pre> with a CodeBlock designed for rehype-pretty-code output. Header bar with
filename/title and language badge; copy button (Copy → Check, 2s feedback, aria-live
announcement); optional line numbers; highlighted lines/words in low-opacity accent; horizontal
scroll; dual themes via shiki CSS variables; for bash/sh blocks show a muted "$" prompt that is NOT
copied. Keep the client component tiny — highlighting happens at build time.
```

**Steps**
```text
Create <Steps> and <Step title="..."> for MDX: vertical timeline with accent-coloured numbered
circles (CSS counters), a 2px connector line, the title rendered as an H3 with an id so the TOC
picks it up, content indented beside it. Smaller on mobile. Must work with code blocks and
callouts inside.
```

**FlowDiagram**
```text
Build an inline-SVG + Tailwind <FlowDiagram> showing Keploy's two modes. RECORD lane: Client →
Your Go App → MongoDB, with dashed arrows from the app and DB to a "Keploy" box labelled
"captures requests, responses & DB calls". REPLAY lane: Keploy → Your Go App → "Mocked MongoDB
(from recorded mocks)", ending in a "Compare responses ✔/✘" chip. Use theme CSS variables
(light/dark), subtle stroke-dashoffset animation (disabled for reduced motion), accessible
<title>/<desc>, lanes stacked vertically on mobile.
```

**TableOfContents**
```text
Client <TableOfContents>: after mount collect h2/h3 in the article, render nested links, highlight
the active heading using IntersectionObserver (rootMargin "0px 0px -70% 0px") with a left accent
bar, smooth-scroll on click, update the URL hash, keyboard accessible, hidden below 1024px (a
Sheet reuses the same data on mobile).
```

**Exit criteria:** a throwaway MDX page renders every component in both themes and on mobile.

---

## Phase 6 — Write the Tutorial (`frontend/src/content/tutorial.mdx`)

### 6.1 Metadata
```mdx
export const metadata = {
  title: "Test your Go API without writing tests — Keploy + Gin + MongoDB",
  description: "A beginner-friendly walkthrough of recording and replaying API tests with Keploy.",
}
```

### 6.2 Drafting prompt (AI is an *editor only* — rewrite in your own voice)
```text
Act as a DevRel editor. Turn my raw notes from running the Keploy Gin + MongoDB Go quickstart into
a crisp, beginner-friendly tutorial in MDX.

AUDIENCE: Go developers who write REST APIs but have never used Keploy.
VOICE: friendly, direct, second person, short sentences, zero fluff. Explain the WHY before the HOW.
LENGTH: 1,500–2,200 words excluding code.

STRUCTURE (exactly): TL;DR → Why Keploy → How it works (<FlowDiagram />) → Prerequisites
(<Checklist />) → Step 1 Install → Step 2 Get the sample → Step 3 Start MongoDB → Step 4 Record →
Step 5 Inspect generated tests & mocks → Step 6 Replay → Step 7 Break it on purpose →
Troubleshooting → Where it fits in your workflow → Next steps.

RULES
- Wrap steps in <Steps><Step title="…">…</Step></Steps>.
- Use <Callout type="info|tip|note|warning|danger"> for gotchas, explanations, warnings.
- Every command in a fenced block with a language (and title="…" where useful).
- After each command, one sentence on what happened and why it matters.
- Use real terminal output from my notes; do not invent output.
- Do NOT copy sentences from Keploy's docs — paraphrase and add original insight.
- Be honest about limitations. No marketing superlatives. No emojis in headings.
- Output valid MDX only (no unclosed JSX tags).

MY NOTES:
<paste docs/run-notes.md here>
```
> ⚠️ Re-run every command in the final text. Never ship a command or output you did not actually run.

### 6.3 Section guidance

| Section | Must contain |
|---|---|
| TL;DR | what you'll do, learn, and how long it takes |
| Why Keploy | pain of hand-written mocks; tests from real traffic; max 3 benefits |
| How it works | diagram + 4-sentence record/replay explanation; define "mock" |
| Record | command, each flag explained, API calls in `CodeTabs`, what appears in the terminal |
| Inspect | `FileTree` of `keploy/` + one annotated test YAML + one annotated mock YAML (~15 lines each) |
| Replay | passing report; what "pass" means |
| Break it | change handler → failing diff → fix → green |
| Troubleshooting | 3–5 real issues from *your* run with cause + fix |
| Workflow fit | where Keploy shines, where unit tests are still needed, CI hint |

### 6.4 Content checklist
- [ ] Every command run by me, in the written order
- [ ] Versions stated (Keploy, Go, Docker, OS)
- [ ] Each step explains the *why*
- [ ] Nothing copied from Keploy docs
- [ ] Consistent naming: **Keploy**, **MongoDB**, **Gin**
- [ ] Links work; external links use `rel="noopener noreferrer"`
- [ ] Images have meaningful `alt` text

Commit per section: `docs: write step 4 record`, etc.

---

## Phase 7 — Polish & UX

### 7.1 Polish prompt
```text
Review my Next.js + MDX docs page in frontend/ and improve it WITHOUT adding new dependencies or any
global installs:
1. Accessibility: heading order, landmarks (header/main/aside/footer), aria-labels on icon buttons,
   focus-visible rings, AA contrast in both themes, skip-to-content link.
2. Responsiveness: test 320/375/768/1024/1440px; fix overflow; tap targets ≥ 44px.
3. Performance: next/image for screenshots (width/height + blur), no layout shift, fonts via
   next/font, minimal client JS (copy button, TOC, theme toggle, progress bar only).
4. SEO/share: metadata, canonical, Open Graph + Twitter card (generated OG image), favicon.
5. Micro-interactions: hover states, copy feedback, smooth anchors with scroll-margin-top,
   reduced-motion support.
6. Print stylesheet: hide header/TOC, expand code blocks.
Return a prioritised list of changes with diffs.
```

### 7.2 Bonus checklist
- [ ] Dark/light/system toggle, no flash
- [ ] Copy button on every code block
- [ ] Scroll-spy TOC + reading progress
- [ ] Animated record/replay diagram
- [ ] Tabs for curl/Postman
- [ ] Step timeline
- [ ] Back-to-top button
- [ ] OG image + favicon in Keploy orange
- [ ] Lighthouse ≥ 95 (Performance, Accessibility, Best Practices, SEO)

---

## Phase 8 — QA & Repo Hygiene

```bash
cd frontend
npm run lint
npm run build     # zero errors/warnings
npm run start     # smoke-test the production build
cd .. && bash scripts/check-env.sh
```
- [ ] No console errors or hydration warnings
- [ ] No unused imports/components/dependencies (`npm ls` clean, no extraneous)
- [ ] Theme persists across reload; deep links like `/#step-4-record` work
- [ ] Clean-clone test: clone the repo to a new folder → `bash scripts/setup.sh` → `make dev` works
- [ ] Spell-check (e.g., `npx cspell "src/content/**/*.mdx"`)
- [ ] Ask a friend (or a fresh chat) to follow the tutorial and report where they got stuck
- [ ] No secrets, no `node_modules`, no `.gopath`, no giant images in git
- [ ] Meaningful commit history (not one giant "final" commit)

### README template (repo root)
````md
# Keploy Go Quickstart — Next.js + MDX Tutorial

A beginner-friendly tutorial on recording and replaying API tests with Keploy, using the
Gin + MongoDB Go sample. Built with Next.js, MDX, Tailwind CSS and shadcn/ui.

🔗 **Live:** <vercel-url>

![Screenshot](./frontend/public/images/screenshot.png)

## Repo layout
- `frontend/` — Next.js + MDX documentation site (deployed to Vercel)
- `backend/`  — Keploy's Gin + MongoDB Go sample (from keploy/samples-go) + my recorded `keploy/` tests
- `scripts/`  — isolated-environment helpers
- `docs/`     — working notes

## Features
MDX with custom components (Callout, Steps, CodeTabs…), build-time syntax highlighting with copy
buttons, dark/light mode, scroll-spy table of contents, fully responsive and accessible.

## Run the site
```bash
git clone <repo-url> && cd keploy-go-quickstart
bash scripts/setup.sh
make dev        # http://localhost:3000
```

## Run the backend + Keploy
See `backend/README.md`.

## What I learned
(2–3 honest sentences.)
````

---

## Phase 9 — Deploy & Submit

### 9.1 GitHub
```bash
git remote add origin https://github.com/<username>/keploy-go-quickstart.git
git push -u origin main
```
Repo visibility: **Public**.

### 9.2 Vercel — ⚠️ set the Root Directory
Because the Next.js app is in a subfolder:
1. vercel.com → **Add New → Project** → import the repo.
2. **Root Directory → `frontend`** (this is the step people forget — without it the build fails).
3. Framework preset: **Next.js** (auto-detected). Install command `npm ci`, build `npm run build`. No env vars needed.
4. Deploy → open in an incognito window on desktop **and** phone.
5. Optional: rename the project for a clean URL.

### 9.3 Final checklist
- [ ] Repo is public; README renders; layout is clean (`backend/`, `frontend/`, `scripts/`, `docs/`)
- [ ] Vercel URL loads fast; images load; dark/light works; deep links work
- [ ] Tutorial commands re-verified one last time; all links resolve

### 9.4 Submission email
```text
Subject: Keploy DevRel Assignment — <Your Name>

Hi <Name / Keploy team>,

Thanks for the assignment — I enjoyed it. Here are my deliverables:

1. GitHub repository: <github-url>
2. Live deployment (Vercel): <vercel-url>

Quick summary: I ran the Gin + MongoDB Go quickstart end-to-end, recorded API test cases with
Keploy, replayed them, and wrote an original beginner-friendly tutorial in MDX. The site is built
with Next.js, Tailwind and shadcn/ui, with a dark/light toggle, scroll-spy table of contents and
custom MDX components. The repo is a monorepo: backend/ holds the Go sample with my recorded
Keploy tests; frontend/ holds the site.

Most interesting for me: <your genuine a-ha moment>.

Happy to walk through any decision.

Best,
<Your Name>
```

---

## Appendix A — Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Keploy doesn't capture traffic on your OS | Use WSL2/Linux or Docker mode per live docs; document it in Troubleshooting |
| Commands differ from this plan | Trust live docs + your terminal; update the tutorial |
| MDX + shiki config errors | Start minimal; add plugins one at a time; check Next.js MDX guide |
| Vercel build fails | Root Directory must be `frontend`; Node version matches `.nvmrc` |
| Over-polishing UI, thin content | **Finish the tutorial before visual polish** |
| Copying docs verbatim | Write from notes; AI only edits, then rewrite in your voice |
| Time overrun | Cut order: animations → FileTree → OG image → extra tabs. Never cut: working tutorial, dark mode, copy button, clean repo |

## Appendix B — Priority Ladder
1. **Must:** Keploy run done, MDX tutorial, deployed, public repo, README
2. **Should:** callouts, highlighting, responsive layout, dark mode
3. **Nice:** scroll-spy TOC, copy buttons, tabs, Steps timeline
4. **Delight:** animated diagram, OG image, progress bar, Lighthouse 95+

## Appendix C — Links
- Keploy docs (Quickstart → Go): https://keploy.io/docs
- Keploy samples: https://github.com/keploy/samples-go
- Next.js MDX guide: https://nextjs.org/docs/app/guides/mdx
- shadcn/ui: https://ui.shadcn.com
- rehype-pretty-code: https://rehype-pretty-code.netlify.app
- next-themes: https://github.com/pacocoursey/next-themes
- Vercel docs: https://vercel.com/docs
