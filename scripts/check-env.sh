#!/usr/bin/env bash
set -uo pipefail
echo "node: $(node -v 2>/dev/null || echo 'not installed')"
echo "npm:  $(npm -v 2>/dev/null || echo 'not installed')"
echo "--- global npm packages (should list only npm/corepack) ---"
npm ls -g --depth=0 2>/dev/null || true
if command -v go >/dev/null 2>&1; then
  echo "go: $(go version)"
  echo "GOPATH=$(go env GOPATH)"
  echo "GOBIN=$(go env GOBIN)"
else
  echo "go: not on PATH"
fi
echo "--- Keploy ---"
command -v keploy && keploy --version || echo "keploy not on PATH"
