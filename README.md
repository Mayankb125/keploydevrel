# Keploy Go Quickstart — Next.js + MDX Tutorial

A beginner-friendly tutorial on recording and replaying API regression tests with Keploy, using the Gin + MongoDB Go sample. Built with **Next.js 15**, **MDX**, **Tailwind CSS**, and **Shiki** build-time syntax highlighting.

---

## Deliverables
- **Live Documentation Website:** *(Deploying on Vercel)*
- **Public GitHub Repository:** [https://github.com/Mayankb125/keploydevrel](https://github.com/Mayankb125/keploydevrel)

---

## Key Features

- **Zero-Code Instrumentation:** Demonstrates recording real HTTP traffic and auto-mocking MongoDB wire calls with Keploy's Linux eBPF engine—zero SDK imports in application code.
- **Interactive MDX Documentation:** Built using Next.js App Router and `@next/mdx`, featuring custom React components:
  - **Architecture Diagram (`<FlowDiagram />`):** Visual comparison between Record Mode (eBPF interception) and Replay Mode (virtual wire mocking).
  - **Pre-flight Checklist (`<Checklist />`):** Interactive toggle for prerequisite verification.
  - **Timeline Steps (`<Steps>` & `<Step>`):** Vertical timeline with CSS counter badges and Table of Contents anchor sync.
  - **Command Switcher (`<CodeTabs />`):** Seamless switching between cURL commands and HTTP JSON payloads.
  - **Directory Tree (`<FileTree />`):** Annotated view of the recorded `keploy/test-set-0/` test cases and mocks.
  - **Build-time Syntax Highlighting (`<CodeBlock />`):** Powered by `rehype-pretty-code` and `shiki`, complete with an animated clipboard copy button.
  - **Dark / Light / System Mode:** Smooth theme transitions with zero hydration flash via `next-themes`.
  - **Scroll-Spy Table of Contents:** Dynamic sidebar that tracks headings via `IntersectionObserver` with an active indicator.
  - **Reading Progress Bar:** 2px Keploy-orange indicator pinned under the translucent header.
  - **Accessibility & Print Support:** Skip-to-content keyboard link, WCAG AA contrast, and a dedicated `@media print` stylesheet.

---

## Monorepo Architecture

```text
keploy-go-quickstart/                 # Public GitHub repository root
├── README.md                          # Project overview and quickstart guide
├── LICENSE                            # MIT License
├── Makefile                           # Developer CLI shortcuts
│
├── backend/                           # Go + Gin + MongoDB sample (for test recording)
│   ├── README.md                      # Attribution and execution instructions
│   ├── main.go                        # Gin server and route registration
│   ├── handler.go                     # Database CRUD and URL shortener handlers
│   ├── docker-compose.yaml            # MongoDB container definition
│   ├── Dockerfile                     # Multi-stage container build
│   └── keploy/                        # GENERATED Keploy test suite (Proof of Work)
│       └── test-set-0/
│           ├── tests/                 # Recorded test cases (YAML)
│           └── mocks.yaml             # Recorded MongoDB wire packets (BSON)
│
├── frontend/                          # Next.js + MDX documentation site (deployed to Vercel)
│   ├── package.json                   # Pinned dependencies (Next.js 16, React 19, Shiki)
│   ├── next.config.mjs                # MDX and Rehype plugin configuration
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx             # Root layout with fonts, header, footer, SEO metadata
│   │   │   ├── page.tsx               # Main page rendering the MDX tutorial
│   │   │   ├── globals.css            # Keploy design tokens, Shiki styles, print stylesheet
│   │   │   └── icon.svg               # Keploy orange brand favicon
│   │   ├── content/
│   │   │   └── tutorial.mdx           # The complete MDX tutorial (~2,000 words)
│   │   ├── components/
│   │   │   ├── layout/                # Header, Footer, TableOfContents, ReadingProgress, ThemeToggle
│   │   │   ├── mdx/                   # Callout, Steps, CodeBlock, CodeTabs, FlowDiagram, Checklist
│   │   │   └── ui/                    # Icons and UI primitives
│   │   └── lib/                       # Utility helpers (cn)
│
├── docs/                              # Project artifacts and research notes
│   ├── content-blueprint.md           # Tutorial editorial strategy, persona, and section outlines
│   ├── run-notes.md                   # Real execution notes, gotchas, and error mitigation tables
│   └── raw-output/                    # Terminal logs (record, test passing, test failing diff)
│
└── scripts/                           # Environment isolation and auditing scripts
    ├── env.sh                         # Local Go and Node environment configuration
    ├── setup.sh                       # One-command project bootstrapper
    └── check-env.sh                   # Tooling leakage audit script
```

---

## Running the Documentation Site Locally

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   npm run start
   ```

---

## Running the Backend & Keploy Tests

See [`backend/README.md`](./backend/README.md) for complete details.

1. **Start MongoDB:**
   ```bash
   cd backend
   docker compose up -d mongoDb
   ```

2. **Record API Test Cases:**
   ```bash
   sudo keploy record -c "go run main.go handler.go"
   ```
   Fire HTTP traffic to `http://localhost:8080/url` using cURL or Postman, then stop recording (`Ctrl + C`).

3. **Replay Tests (Offline / Zero Database):**
   ```bash
   docker compose down
   sudo keploy test -c "go run main.go handler.go" --delay 5
   ```

---

## What I Learned (DevRel Takeaways)

1. **eBPF-Driven Developer Adoption:** Keploy's ability to intercept network packets directly at the Linux kernel level eliminates the biggest friction point in developer tooling—requiring zero code modifications or proprietary SDK imports.
2. **Virtual Wire Mocking:** Traditional integration testing requires fragile database container management in CI pipelines. By serving recorded BSON wire packets directly to the database driver, test suites run with unit-test speed while preserving end-to-end integration confidence.
3. **Noise Management:** Automated test generation often struggles with dynamic fields (timestamps, UUIDs, dates). Keploy's automated `assertions.noise` configuration solves false-positive test failures cleanly without requiring developer intervention.

---

## License

MIT License — Copyright (c) 2026 Keploy DevRel Candidate
