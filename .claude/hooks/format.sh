#!/usr/bin/env bash
set -euo pipefail

payload="$(cat || true)"

# Formatting is deliberately best-effort: hooks should not hide an edit merely
# because a tool is unavailable in the current shell.

if command -v dotnet >/dev/null 2>&1 && [ -f "*.sln" ] 2>/dev/null; then
  dotnet format --no-restore >/dev/null 2>&1 || true
fi

if [ -d "src/web" ] && [ -f "src/web/package.json" ] && command -v npm >/dev/null 2>&1; then
  (
    cd src/web
    if npm run 2>/dev/null | grep -qE '(^|[[:space:]])format'; then
      npm run format -- --write >/dev/null 2>&1 || true
    fi
  )
fi

exit 0
