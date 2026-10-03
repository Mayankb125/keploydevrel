# Content Blueprint: Keploy Go Quickstart Tutorial

## 1. Audience & Persona
- **Target Reader:** Go developers who build REST APIs (with Gin, Echo, Fiber, or standard library) and write unit tests, but have **never used Keploy**.
- **Existing Knowledge:** Basic Go syntax, Docker basics, using `curl` or Postman.
- **Pain Points:** Writing and maintaining manual mocks (`gomock`, `testify/mock`) is tedious, slow, and mocks frequently drift out of sync with real production databases/APIs.

---

## 2. Voice & Editorial Rules
- **Tone:** Direct, technical, empathetic, pragmatic. No marketing fluff or superlatives ("revolutionary", "magic").
- **Perspective:** Second person ("you").
- **The Core Formula:** Every single step must answer:
  1. **What do I do?** (The exact command or action)
  2. **What happens?** (Terminal output and system behavior)
  3. **Why does it matter?** (The engineering rationale)
- **Honesty on Gotchas:** Explicitly address eBPF permissions (`sudo`), startup delay (`--delay`), and data sanitization in mocks.
- **Estimated Reading Time:** 10–12 minutes (~1,800–2,200 words + code blocks).

---

## 3. Interactive Component Strategy

| Component | Target Location | Purpose & Props |
|---|---|---|
| `<ReadingMeta>` | Hero section | Read time (10 min), difficulty (Beginner/Intermediate), Go version (1.20+), Keploy (v2.3.0). |
| `<Callout>` | Throughout | Semantic alerts with custom icons: `info` (eBPF & wire mocks), `tip` (`--delay` flag), `note` (OS versions), `warning` (scrubbing production data in mocks), `danger` (port collisions). |
| `<FlowDiagram>` | "How Keploy Works" | Interactive Record vs. Replay visualization showing traffic interception and virtual wire mocking. |
| `<Checklist>` | Prerequisites | Pre-flight verification (Docker, curl, Go, ports 8080/27017). |
| `<Steps>` & `<Step>` | Tutorial Body | Numbered vertical timeline guiding the reader from Step 1 to Step 7 with anchor IDs. |
| `<CodeTabs>` | Step 4 (Record) | Switch between `cURL`, `Postman JSON`, and `HTTPie` commands for firing test traffic. |
| `<FileTree>` | Step 5 (Inspect) | Interactive directory tree rendering `keploy/test-set-0/` (tests & mocks). |
| `<NextSteps>` | Next Steps | Cards linking to CI/CD guides, GitHub repo, Discord community, and other language quickstarts. |

---

## 4. Callout Inventory & Strategy

| Type | Placement | Exact Message / Context |
|---|---|---|
| `info` | "How Keploy Works" | Explaining what a "mock" means here: Keploy intercepts network packets at the socket layer, not mock interfaces in application code. |
| `info` | Step 1: Install | Why Keploy requires `sudo` / elevated permissions: eBPF attaches to kernel network hooks without requiring code modifications. |
| `tip` | Step 4: Record | Use `--delay` flag if the application has a slow startup sequence or takes time connecting to MongoDB. |
| `warning` | Step 5: Inspect | Recorded mocks contain actual payload data; always review `mocks.yaml` before committing to public repositories. |
| `danger` | Step 3: MongoDB | Port collision warnings if a local MongoDB instance is already listening on `:27017`. |
| `note` | Step 6: Replay | MongoDB can be completely stopped during `keploy test`; the replay is 100% offline. |

---

## 5. Detailed Section-by-Section Breakdown

### Section 1: Hero Block
- **Title:** Test Your Go API Without Writing Tests: A Keploy Quickstart with Gin & MongoDB
- **Subtitle:** How to automatically generate regression test suites and database mocks from real API traffic — zero SDK instrumentation required.
- **Metadata Badge Row:** `Go 1.20+` · `Gin Framework` · `MongoDB` · `Keploy v2.3.0` · `10 min read`.

### Section 2: TL;DR
- Executive callout summarizing the 3 takeaways:
  1. Record live HTTP requests and MongoDB queries into version-controlled YAML files.
  2. Replay tests in CI/CD without spinning up a live MongoDB database.
  3. Catch regression bugs and contract breaking changes instantly with visual diffs.

### Section 3: Why Keploy? (The Integration Testing Dilemma)
- The traditional dilemma:
  - Unit tests are fast but don't catch database query flaws.
  - End-to-end integration tests catch bugs but are slow, flaky, and hard to maintain in CI.
  - Hand-writing mocks for databases and external APIs requires interface bloat and mocks drift over time.
- The Keploy paradigm: Listen to real network traffic, capture the exact request + response + outgoing calls, and replay them identically.

### Section 4: How Keploy Works (Record vs. Replay)
- Embed `<FlowDiagram />`:
  - **Record Phase:** Client Request → Keploy eBPF Proxy → Go App → MongoDB. Keploy captures inbound HTTP and outbound MongoDB wire queries into `test-set-0/`.
  - **Replay Phase:** Keploy Test Runner → Go App → Keploy Virtual Wire Mock (MongoDB not running!). Keploy asserts that the app's response matches the recorded contract.

### Section 5: Prerequisites
- Render `<Checklist items={[...]}>`:
  - Linux, macOS, or Windows with WSL2 / Docker Desktop.
  - Docker & Docker Compose installed.
  - `curl` or Postman installed.
  - Port `8080` (App) and `27017` (MongoDB) free.

### Section 6: Step 1 — Install the Keploy CLI
- Installation commands for Linux / macOS / WSL:
  ```bash
  curl --silent -O -L https://keploy.io/install.sh && bash install.sh
  ```
- Verification: `keploy --version`.
- `<Callout type="info">` explaining why eBPF needs root capabilities.

### Section 7: Step 2 — Tour the Go Sample Application
- Explore `backend/main.go` and `backend/handler.go`.
- Clarify the 3 endpoints:
  - `POST /url` — Takes `{"url": "https://google.com"}`, computes a SHA-256 base58 hash, upserts into MongoDB, returns `{"ts": ..., "url": "http://localhost:8080/..."}`.
  - `GET /:param` — Queries MongoDB by ID, issues `303 See Other` redirect.
  - `GET /verify-email` — Uses `emailverifier` to validate email syntax.
- Emphasize: **Zero Keploy code in the app**.

### Section 8: Step 3 — Launch MongoDB
- Run `docker compose up -d mongoDb`.
- Verify container is healthy: `docker ps`.
- `<Callout type="danger">` on port 27017 conflicts.

### Section 9: Step 4 — Record API Traffic
- Command: `sudo keploy record -c "go run main.go handler.go"`.
- Use `<CodeTabs>` for sending 5 varied requests:
  - Tab 1: cURL commands (Create URL, Redirect, Invalid 400, Not Found 404, Verify Email).
  - Tab 2: Raw HTTP / JSON payloads.
- Stop with `Ctrl+C`. Highlight terminal output showing captured tests and mocks.

### Section 10: Step 5 — Inspect What Keploy Generated
- Render `<FileTree />` showing `keploy/test-set-0/tests/` and `mocks.yaml`.
- Code walk-through of `test-1.yaml`:
  - Request headers and body.
  - Expected response status and body.
  - `assertions.noise` highlighting how dynamic timestamps (`ts`) are safely ignored.
- Code walk-through of `mocks.yaml`:
  - Explaining the captured MongoDB wire packets (`op_code: 2013`).
- `<Callout type="warning">` about sanitizing sensitive secrets or PII in mocks before git commit.

### Section 11: Step 6 — Replay Tests Without Dependencies
- Stop MongoDB: `docker compose down` (or leave it stopped).
- Run: `sudo keploy test -c "go run main.go handler.go" --delay 5`.
- Explain the passing output: all 5 tests passed in 7.8 seconds, with zero database dependencies.
- `<Callout type="tip">` explaining why `--delay 5` is necessary for Go HTTP server binding.

### Section 12: Step 7 — Break It On Purpose (The "A-Ha!" Moment)
- Edit `backend/handler.go`: change the JSON key from `"url"` to `"short_url"`.
- Re-run `sudo keploy test -c "go run main.go handler.go" --delay 5`.
- Display the clean diff output showing the exact schema mismatch.
- Revert the change back to green.

### Section 13: Troubleshooting Common Gotchas
- Render troubleshooting accordion:
  1. `permission denied (eBPF map create)` → Run with `sudo` or grant `CAP_SYS_ADMIN`.
  2. `connection refused :8080 during test` → Increase `--delay`.
  3. `timestamps causing test failures` → How Keploy's noise config handles dynamic fields.
  4. `MongoDB authentication / replica set errors` → How to configure connection strings.

### Section 14: Where Keploy Fits in Your Stack
- Honest engineering trade-offs:
  - When to use Keploy: Regression testing, legacy API coverage, microservice integration tests, refactoring safety net.
  - When to still write unit tests: Complex domain logic, edge case algorithms, pure mathematical functions.
  - CI/CD integration: Running `keploy test` in GitHub Actions using the pre-recorded mocks.

### Section 15: Next Steps & Community
- `<NextSteps />` card grid:
  - Keploy Documentation & Quickstarts
  - GitHub Actions CI Integration Guide
  - Keploy Slack / Discord Community
  - Contributing to Keploy Open Source

### Section 16: Footer & Attribution
- Author info, assignment context, links to GitHub repo and sample attribution.
