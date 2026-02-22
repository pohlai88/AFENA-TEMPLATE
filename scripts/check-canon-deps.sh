#!/bin/bash
# Canon Dependency Guard
# Ensures Canon has zero workspace dependencies (only zod allowed)
# Part of CI Guardrails (Canon Architecture §20)

set -e

echo "🔍 Checking Canon dependencies..."

# Check for workspace dependencies in package.json
WORKSPACE_DEPS=$(jq -r '.dependencies // {} | keys[] | select(startswith("afenda-"))' packages/canon/package.json 2>/dev/null || echo "")

if [ -n "$WORKSPACE_DEPS" ]; then
  echo "❌ ERROR: Canon must not depend on workspace packages."
  echo "Found workspace dependencies:"
  echo "$WORKSPACE_DEPS"
  echo ""
  echo "Canon is Layer 1 Foundation. It can only depend on 'zod'."
  exit 1
fi

# Check that only zod is in runtime dependencies
RUNTIME_DEPS=$(jq -r '.dependencies // {} | keys[] | select(. != "zod")' packages/canon/package.json 2>/dev/null || echo "")

if [ -n "$RUNTIME_DEPS" ]; then
  echo "❌ ERROR: Canon can only have 'zod' as runtime dependency."
  echo "Found additional runtime dependencies:"
  echo "$RUNTIME_DEPS"
  echo ""
  echo "Remove these dependencies or move them to devDependencies."
  exit 1
fi

# Verify zod is present
ZOD_DEP=$(jq -r '.dependencies.zod // empty' packages/canon/package.json)

if [ -z "$ZOD_DEP" ]; then
  echo "⚠️  WARNING: Canon should have 'zod' as a dependency."
fi

echo "✅ Canon dependency check passed!"
echo "   - Zero workspace dependencies"
echo "   - Only 'zod' as runtime dependency"
