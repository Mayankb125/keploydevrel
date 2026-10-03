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
