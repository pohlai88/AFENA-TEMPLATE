# Type-Check and Lint Performance

This document records the Type-Check and Lint Performance Optimization Plan implementation and verification results.

## Implemented Optimizations

### P1: Turborepo Cache for lint:ci

`turbo.json` — `lint:ci` now uses `cache: true` and `outputs: [".eslintcache"]` so CI benefits from cache hits on unchanged packages.

### P2: ESLint --cache Everywhere

All packages with `lint` or `lint:ci` scripts use `--cache` for content-keyed ESLint caching.

### P3: Turbo Concurrency

Root `package.json`:
- `type-check`: `turbo run type-check --continue --concurrency=100%`
- `lint:ci`: `turbo run lint:ci --continue --concurrency=100%`

### P4: tsconfig Include Patterns

Audit complete. All packages use explicit narrow includes (`src/**/*`, `src/**/*.ts`, or app-specific scopes). No package uses problematic `**/*` or missing `include`.

### P5: NODE_OPTIONS for Heavy Runs

Documented in:
- `.env.example` (Build & Performance section)
- `README.md` (Troubleshooting: Slow type-check or lint)

Example:
```bash
NODE_OPTIONS=--max-semi-space-size=256 pnpm type-check
NODE_OPTIONS=--max-semi-space-size=256 pnpm lint:ci
```

---

## P7: Affected-Only Verification (Dry-Run)

### Full Run (no filter)

```bash
pnpm exec turbo run type-check lint:ci --dry-run
```

- **Packages in scope:** 55
- **Tasks:** 110 (type-check + lint:ci per package) plus build dependencies
- **Behavior:** Runs type-check and lint:ci for all packages in the monorepo

### Affected-Only Run

```bash
pnpm exec turbo run type-check lint:ci --filter='...[origin/main...HEAD]' --dry-run
```

- **When HEAD = origin/main (no local changes):** 0 packages in scope, 0 tasks
- **When HEAD has changes (typical PR):** Only packages affected by changes since base run type-check and lint:ci

The affected filter `...[origin/main...HEAD]` correctly restricts scope to changed packages and their dependents. CI (`.github/workflows/ci.yml`) uses equivalent logic when base SHA exists.
