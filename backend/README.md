# Backend: Gin + MongoDB Quickstart with Keploy

This directory contains the Go sample application (Gin + MongoDB URL Shortener) used to demonstrate Keploy's zero-code test generation and database auto-mocking capabilities.

---

## Attribution

The sample application source code is derived from [Keploy's Open-Source Go Samples (`samples-go/gin-mongo`)](https://github.com/keploy/samples-go).

---

## Directory Structure

```text
backend/
├── main.go                     # Gin HTTP server setup and route mapping
├── handler.go                  # MongoDB CRUD logic and URL shortener algorithm
├── go.mod                      # Module definitions and pinned dependencies
├── docker-compose.yaml         # Containerized MongoDB 6.0 service
├── Dockerfile                  # Container build instructions
└── keploy/                     # GENERATED TEST SUITE (Proof of Work)
    └── test-set-0/
        ├── tests/              # Recorded YAML test cases (HTTP requests/responses)
        └── mocks.yaml          # Recorded MongoDB wire packets (BSON)
```

---

## How to Run & Verify Locally

### 1. Start MongoDB Dependency
```bash
docker compose up -d mongoDb
```
Check that the container is healthy:
```bash
docker ps --filter "name=mongoDb"
```

### 2. Record Test Cases with Keploy
```bash
sudo keploy record -c "go run main.go handler.go"
```
Send sample requests from another terminal:
```bash
# 1. Create a shortened URL (200 OK)
curl -i -X POST http://localhost:8080/url \
  -H 'Content-Type: application/json' \
  -d '{"url":"https://google.com"}'

# 2. Access the shortened slug (303 Redirect)
curl -i -X GET http://localhost:8080/Lhr4BWAi

# 3. Invalid payload test (400 Bad Request)
curl -i -X POST http://localhost:8080/url \
  -H 'Content-Type: application/json' \
  -d '{}'

# 4. Non-existent slug lookup (404 Not Found)
curl -i -X GET http://localhost:8080/nonexistentId

# 5. Verify email endpoint (200 OK)
curl -i -X GET 'http://localhost:8080/verify-email?email=test%40keploy.io'
```
Stop recording by pressing `Ctrl + C`. Keploy will write the generated test suite into `keploy/test-set-0/`.

### 3. Replay Tests Offline (Zero Database)
Stop MongoDB to prove that Keploy replays without live dependencies:
```bash
docker compose down
```
Run `keploy test`:
```bash
sudo keploy test -c "go run main.go handler.go" --delay 5
```
You should see all 5 tests passing in under 8 seconds.

### 4. Test Breaking Change Detection
In `handler.go`, change `"url"` to `"short_url"` in `putURL`, re-run `keploy test`, and observe the visual failure diff. Revert the file to restore green test status.
