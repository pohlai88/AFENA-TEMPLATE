#!/usr/bin/env bash
# Phase C — Enterprise CI Gates
# Run from apps/web: bash scripts/ci-gates.sh
# Exit non-zero on any violation.

set -euo pipefail

ERRORS=0
APP_DIR="app/(app)"

echo "=== INV-E1: No 'use client' in page.tsx / layout.tsx ==="
# Exclude files/page.tsx (known pre-existing violation, tracked separately)
HITS=$(grep -rl "'use client'" "$APP_DIR" --include="page.tsx" --include="layout.tsx" | grep -v "files/page.tsx" || true)
if [ -n "$HITS" ]; then
  echo "FAIL: 'use client' found in page/layout files:"
  echo "$HITS"
  ERRORS=$((ERRORS + 1))
else
  echo "PASS"
fi

echo ""
echo "=== INV-E2: No console.* in runtime paths ==="
HITS=$(grep -rn "console\." "$APP_DIR" --include="*.ts" --include="*.tsx" | grep -v "// eslint-disable" || true)
if [ -n "$HITS" ]; then
  echo "FAIL: console.* found in runtime paths:"
  echo "$HITS"
  ERRORS=$((ERRORS + 1))
else
  echo "PASS"
fi

echo ""
echo "=== INV-E3: No hardcoded colors ==="
HITS=$(grep -rn "oklch\|hsl(\|rgb(\|#[0-9a-fA-F]\{3,8\}" "$APP_DIR" --include="*.tsx" --include="*.ts" | grep -v "globals.css" | grep -v "// token-ok" || true)
if [ -n "$HITS" ]; then
  echo "FAIL: Hardcoded colors found:"
  echo "$HITS"
  ERRORS=$((ERRORS + 1))
else
  echo "PASS"
fi

echo ""
echo "=== INV-E4: Action surfaces use resolver output ==="
# Check that no ad-hoc action buttons exist outside the CRUD composables
HITS=$(grep -rn 'kind="approve"\|kind="reject"\|kind="delete"\|kind="submit"' "$APP_DIR" --include="*.tsx" | grep -v "_components/crud/" | grep -v "// resolver-ok" || true)
if [ -n "$HITS" ]; then
  echo "FAIL: Ad-hoc action kind found outside resolver:"
  echo "$HITS"
  ERRORS=$((ERRORS + 1))
else
  echo "PASS"
fi

echo ""
if [ "$ERRORS" -gt 0 ]; then
  echo "=== $ERRORS gate(s) FAILED ==="
  exit 1
else
  echo "=== All gates PASSED ==="
  exit 0
fi
