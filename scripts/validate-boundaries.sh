#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
INTERNAL_DOCS_DIR="/Users/home/projects/docs/DeroDocs"

PUBLIC_DOC_DIRS=(
  "$REPO_ROOT/derod-main"
  "$REPO_ROOT/tela-main"
  "$REPO_ROOT/deropay-main"
  "$REPO_ROOT/hologram-main"
)

echo "==> Validating internal/public doc boundaries"
echo "Repo: $REPO_ROOT"

FAIL=0

if command -v rg >/dev/null 2>&1; then
  SEARCH_TOOL="rg"
else
  SEARCH_TOOL="grep"
fi

echo
echo "1) Checking public docs for forbidden internal references..."
PUBLIC_PATTERN='(/Users/home/projects/docs/DeroDocs|docs/DeroDocs|DeroDocs/|UNDERDOCUMENTED_FEATURES\.md)'

for dir in "${PUBLIC_DOC_DIRS[@]}"; do
  if [[ -d "$dir" ]]; then
    if [[ "$SEARCH_TOOL" == "rg" ]]; then
      if rg -n --hidden --glob '!**/.next/**' --glob '!**/*.json' --glob '!**/node_modules/**' "$PUBLIC_PATTERN" "$dir"; then
        echo "ERROR: Forbidden internal reference found in public docs under $dir"
        FAIL=1
      fi
    else
      if grep -RInE --exclude-dir=node_modules --exclude-dir=.next "$PUBLIC_PATTERN" "$dir"; then
        echo "ERROR: Forbidden internal reference found in public docs under $dir"
        FAIL=1
      fi
    fi
  fi
done

echo
echo "2) Checking internal docs for forbidden derod.org links..."
if [[ -d "$INTERNAL_DOCS_DIR" ]]; then
  if [[ "$SEARCH_TOOL" == "rg" ]]; then
    if rg -n 'https?://(www\.)?derod\.org' "$INTERNAL_DOCS_DIR"; then
      echo "ERROR: Internal docs must not link to derod.org"
      FAIL=1
    fi
  else
    if grep -RInE 'https?://(www\.)?derod\.org' "$INTERNAL_DOCS_DIR"; then
      echo "ERROR: Internal docs must not link to derod.org"
      FAIL=1
    fi
  fi
else
  echo "NOTE: Internal docs directory not present at $INTERNAL_DOCS_DIR (skipping this check)."
fi

echo
if [[ "$FAIL" -ne 0 ]]; then
  echo "Boundary validation FAILED."
  exit 1
fi

echo "Boundary validation PASSED."
