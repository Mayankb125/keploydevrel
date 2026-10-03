# Keploy Run Notes — Gin + MongoDB Quickstart

## 1. What I Ran
- **OS / Environment:** Linux / WSL2 / Docker Desktop
- **Language / Framework:** Go 1.20+, Gin v1.9.1
- **Database:** MongoDB 6.0+ (Containerized on `:27017`)
- **Testing Engine:** Keploy CLI v2.3.0
- **Sample:** URL Shortener API (`gin-mongo`)

### Exact Execution Sequence
1. **Start Database Dependency:**
   ```bash
   docker compose up -d mongoDb
   ```
2. **Start Keploy in Record Mode:**
   ```bash
   sudo keploy record -c "go run main.go handler.go"
   ```
3. **Fire Diverse API Calls:**
   - Create shortened URL:
     ```bash
     curl -i -X POST http://localhost:8080/url \
       -H 'Content-Type: application/json' \
       -d '{"url":"https://google.com"}'
     ```
   - Follow redirect for generated slug:
     ```bash
     curl -i -X GET http://localhost:8080/Lhr4BWAi
     ```
   - Trigger 400 Bad Request (missing payload):
     ```bash
     curl -i -X POST http://localhost:8080/url \
       -H 'Content-Type: application/json' \
       -d '{}'
     ```
   - Trigger 404 Not Found:
     ```bash
     curl -i -X GET http://localhost:8080/nonexistentId
     ```
   - Verify Email format:
     ```bash
     curl -i -X GET 'http://localhost:8080/verify-email?email=test%40keploy.io'
     ```
4. **Stop Recording:** `Ctrl + C`
5. **Replay Tests (MongoDB container stopped or mocked):**
   ```bash
   sudo keploy test -c "go run main.go handler.go" --delay 5
   ```
6. **Break Contract on Purpose (Change `"url"` to `"short_url"` in `putURL`):**
   ```bash
   sudo keploy test -c "go run main.go handler.go" --delay 5
   ```
   *(Observed immediate diff in terminal, then reverted code back to green).*

---

## 2. Confusing Moments & Gotchas (Incorporated as Tutorial Callouts)

1. **eBPF & Elevated Privileges:**
   - *Why `sudo`?* Keploy doesn't require modifying application source code with middleware or SDK hooks. Instead, it hooks into Linux kernel network socket calls via eBPF. On Linux/WSL2, this requires root permissions (`sudo`).
2. **Application Startup Latency (`--delay` flag):**
   - In Go apps with database ping handshakes, the HTTP server might take 1–2 seconds to become fully ready. Adding `--delay 5` prevents Keploy from firing test requests before the server socket is open.
3. **Dynamic Fields & Noise Handling:**
   - Real APIs return changing timestamps (`ts: 1718943885198315028`) and `Date` headers. Keploy automatically recognizes noisy fields and places them in `assertions.noise`, comparing structure without failing on timestamp changes.
4. **Virtual Wire Mocking:**
   - The developer does not need to spin up MongoDB during test replay! Keploy mocks MongoDB protocol packets at the socket level.

---

## 3. Real Errors Hit & How They Were Fixed

| Error | Root Cause | Resolution |
|---|---|---|
| `connection refused to 27017` | MongoDB container was not started before recording | Run `docker compose up -d mongoDb` and wait for MongoDB healthcheck |
| `connection refused to :8080 during test` | Keploy fired tests before Gin completed server startup | Added `--delay 5` to `keploy test` command |
| `permission denied (eBPF map create)` | Running Keploy without administrative privileges | Prefix CLI command with `sudo` or run Docker with `--cap-add=SYS_ADMIN` |

---

## 4. "A-ha!" Moments

1. **Zero-Code Instrumentation:**
   Not a single line of Keploy SDK code was imported into `main.go` or `handler.go`. The Go code remained 100% standard Gin.
2. **Automatic Wire Mocking:**
   The MongoDB queries (`FindOne`, `UpdateOne`) were automatically serialized into `mocks.yaml`. When running `keploy test`, tests executed completely offline in under 8 seconds.
3. **Instant Visual Regression Diff:**
   When we changed the JSON key in `putURL`, Keploy immediately pinpointed the exact line and key that deviated from the contract.

---

## 5. What Keploy Generated
- `backend/keploy/test-set-0/tests/test-1.yaml` to `test-5.yaml`: Human-readable YAML test specs documenting request headers, body, cURL commands, status codes, and response payloads.
- `backend/keploy/test-set-0/mocks.yaml`: Serialized MongoDB BSON packets captured from the live wire.
