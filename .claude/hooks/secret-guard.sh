#!/usr/bin/env bash
set -euo pipefail

payload="$(cat || true)"

# Heuristic only. This does not replace repository secret scanning.
if printf '%s' "$payload" | grep -Eqi \
  '(sk-[A-Za-z0-9_-]{20,}|api[_-]?key[[:space:]]*[:=][[:space:]]*["'\''][^"'\'']{12,}|AccountKey=|SharedAccessKey=|DefaultEndpointsProtocol=.*AccountName=)'; then
  echo "Blocked: edit appears to contain a credential-shaped value. Use configuration/secret storage instead." >&2
  exit 2
fi

exit 0
