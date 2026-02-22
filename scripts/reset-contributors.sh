#!/bin/bash
# Reset repository history to remove inherited contributors.
# See docs/CONTRIBUTORS-RESET.md for root cause and manual steps.
#
# Usage: ./scripts/reset-contributors.sh [--dry-run] [--yes]
#   --dry-run  Show what would be done, no changes
#   --yes      Skip confirmation prompts (for automation)
# Run from repo root. Uses Git Bash on Windows.

set -e

DRY_RUN=false
AUTO_YES=false
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=true ;;
    --yes)     AUTO_YES=true ;;
  esac
done

if [ "$AUTO_YES" = false ] && [ "$DRY_RUN" = false ]; then
  echo "⚠️  WARNING: This will REPLACE all git history with a single commit."
  echo "   Contributors will reset to only the commit author."
  echo "   Anyone with a clone will need to re-clone or reset."
  echo ""
  read -p "Continue? [y/N] " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
  fi
fi

if [ "$1" = "--dry-run" ]; then
  echo "🔍 DRY RUN — no commits or pushes will be made"
fi

# Ensure we're on a clean state from current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "Current branch: $CURRENT_BRANCH"
git status --short
echo ""

if [ "$DRY_RUN" = true ]; then
  echo "Would run:"
  echo "  git checkout --orphan fresh-main"
  echo "  git add -A"
  echo "  git commit -m 'Initial commit: AFENDA-NEXUS monorepo'"
  echo "  git branch -D main"
  echo "  git branch -m fresh-main main"
  echo "  git push -f origin main"
  exit 0
fi

git checkout --orphan fresh-main
git add -A
git commit -m "Initial commit: AFENDA-NEXUS monorepo"

git branch -D main
git branch -m fresh-main main

echo ""
echo "✅ New main branch created. Force push with:"
echo "   git push -f origin main"
echo ""
echo "To recreate erp branch:"
echo "   git checkout -b erp"
echo "   git push -f origin erp"
echo ""
if [ "$AUTO_YES" = true ]; then
  git push -f origin main
  echo "✅ Pushed. Contributors list will update shortly."
else
  read -p "Push now? [y/N] " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    git push -f origin main
    echo "✅ Pushed. Contributors list will update shortly."
  fi
fi
