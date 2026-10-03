#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
source "$ROOT/scripts/env.sh"

# Frontend: exact Node version + clean, lockfile-based install (local only)
cd "$ROOT/frontend"
if command -v nvm >/dev/null 2>&1; then nvm install && nvm use; fi
if [ -f package-lock.json ]; then
  npm ci
elif [ -f package.json ]; then
  npm install
fi

# Backend: download Go modules into the project-local cache (skip if using Docker only)
if command -v go >/dev/null 2>&1; then
  if [ -f "$ROOT/backend/go.mod" ]; then
    cd "$ROOT/backend" && go mod download
  fi
fi
echo "✔ Setup complete"
