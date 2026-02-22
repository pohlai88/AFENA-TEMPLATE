---
name: ts-tsup-config
description: Diagnose and govern TypeScript (tsconfig.json) and tsup (tsup.config.ts) configuration in the AFENDA-NEXUS monorepo. Use when creating packages, debugging tsc/tsup errors, reviewing composite/noEmit/outDir settings, or when asked about tsconfig, tsup, project references, or build configuration.
---

# TypeScript & tsup Configuration (AFENDA-NEXUS)

Authoritative reference for all `tsconfig.json` and `tsup.config.ts` decisions in this monorepo. Every rule here was derived from real breakage — do not deviate without updating this skill.

---

## Package Categories & Decision Table

| Category | Example | `composite` | `noEmit` | `tsconfig.build.json` | Root `references` | tsup |
|---|---|---|---|---|---|---|
| **Library package** | `packages/ui`, `packages/canon` | `true` | `false` | **Yes** | **Yes** | Yes |
| **Source-first domain** | `business-domain/finance/*` | `false` | `true` (default) | **No** | **No** | **No** |
| **Leaf app** | `apps/web` | `false` | `false` | No | **No** | No |
| **Tool (ESM)** | `tools/afenda-cli` | `false` | `false` | **Yes** (for tsup) | No | Yes |
| **Config package** | `packages/eslint-config`, `packages/typescript-config` | N/A | N/A | No | No | No |

**Rule of thumb:** If a package is consumed by other packages via `workspace:*` AND emits `.d.ts`, it is a Library package. Everything else is source-first.

---

## 1. Source-First Domain Packages (`business-domain/*/*`)

These packages point directly to TypeScript source. No build step. No dist output.

### `package.json`

```json
{
  "name": "afenda-<name>",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    }
  },
  "scripts": {
    "type-check": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint src --ext .ts --cache",
    "lint:fix": "eslint src --ext .ts --cache --fix",
    "lint:ci": "eslint src --ext .ts --rule 'import/no-cycle: error'"
  },
  "dependencies": {
    "afenda-canon": "workspace:*",
    "afenda-database": "workspace:*",
    "afenda-logger": "workspace:*"
  },
  "devDependencies": {
    "afenda-eslint-config": "workspace:*",
    "afenda-typescript-config": "workspace:*",
    "drizzle-orm": "catalog:",
    "typescript": "catalog:",
    "vitest": "catalog:"
  }
}
```

**❌ NEVER add:** `tsup`, `tsconfig.build.json`, `"main": "./dist/..."`, `"build": "tsup"` to source-first packages.

### `tsconfig.json`

```jsonc
{
  "extends": "afenda-typescript-config/react-library.json",
  "compilerOptions": {
    "tsBuildInfoFile": "./dist/.tsbuildinfo"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "build", "**/*.test.*", "**/*.spec.*"]
}
```

**❌ NEVER set:** `composite: true`, `noEmit: false`, `outDir`, `declaration`, `declarationMap` on source-first packages.

**❌ NEVER add** source-first packages to root `tsconfig.json` → `references`.

### `vitest.config.ts`

```typescript
import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      // Required: afenda-canon/afenda-database exports point to dist/
      // Vite cannot resolve them without explicit source alias
      'afenda-canon': resolve(__dirname, '../../../packages/canon/src/index.ts'),
      'afenda-database': resolve(__dirname, '../../../packages/database/src/index.ts'),
    },
  },
  test: {
    name: 'afenda-<package-name>',
    globals: true,
    pool: 'threads',
    include: ['src/**/__tests__/**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
    testTimeout: 5000,
    passWithNoTests: true,
  },
});
```

**Why `resolve.alias`?** `afenda-canon` and `afenda-database` have `exports` fields pointing to `dist/`. Vite (used by Vitest) resolves via `exports` first, so without the alias it fails with `Failed to resolve entry for package`. The alias redirects to source, bypassing the missing dist.

**❌ NEVER use:** `env.DATABASE_URL` stub — use `vi.mock('afenda-database')` in test files instead.

### Test files — mock pattern

```typescript
// ✅ Correct: vi.mock hoisted by Vitest, prevents db.ts from executing
import type { DbSession } from 'afenda-database';
import { vi } from 'vitest';

vi.mock('afenda-database', () => ({
  db: {},
  taxRates: {},
}));

// Cast mock objects to avoid type mismatch
function mockDb(): DbSession {
  return {
    read: vi.fn().mockResolvedValue([...]),
    rw: vi.fn() as DbSession['rw'],
  } as unknown as DbSession;
}
```

---

## 2. Library Packages (`packages/*` that emit `.d.ts`)

These packages are built with tsup and consumed via their `dist/` output.

### `tsconfig.json`

```jsonc
{
  "extends": "afenda-typescript-config/react-library.json",
  "compilerOptions": {
    "composite": true,       // REQUIRED — enables project references
    "noEmit": false,         // REQUIRED — composite forbids noEmit: true
    "declaration": true,     // REQUIRED — composite requires declaration
    "declarationMap": true,
    "outDir": "./dist",
    "tsBuildInfoFile": "./dist/.tsbuildinfo"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "build", "**/*.test.*", "**/*.spec.*"]
}
```

**Invariants:**
- `composite: true` requires `declaration: true` — always paired
- `composite: true` forbids `incremental: false` — never set both
- `composite: true` forbids `noEmit: true` — never set both

### `tsconfig.build.json` (tsup escape hatch)

tsup's DTS generation is **incompatible** with `composite: true`. Every library package using tsup MUST have this file:

```jsonc
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "composite": false,
    "incremental": false,
    "tsBuildInfoFile": null
  }
}
```

### `tsup.config.ts`

```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  tsconfig: './tsconfig.build.json', // ALWAYS — never ./tsconfig.json
  external: [
    'afenda-canon',
    'afenda-database',
    'afenda-logger',
    'drizzle-orm',
    'react',
    'react-dom',
  ],
});
```

**Critical rule:** `tsconfig` MUST be `./tsconfig.build.json`. If you point tsup at `tsconfig.json` with `composite: true`, the DTS build fails with `error TS5055: Cannot write file ... because it would overwrite input file`.

### Root `tsconfig.json` references

Library packages MUST appear here. Source-first packages MUST NOT:

```jsonc
{
  "references": [
    { "path": "./packages/canon" },
    { "path": "./packages/crud" },
    { "path": "./packages/database" },
    { "path": "./packages/logger" },
    { "path": "./packages/ui" },
    { "path": "./packages/workflow" },
    { "path": "./packages/migration" },
    { "path": "./packages/search" }
    // ❌ NEVER: { "path": "./business-domain/finance/accounting" }
    // ❌ NEVER: { "path": "./apps/web" }
  ]
}
```

---

## 3. Leaf Apps (`apps/web`)

```jsonc
{
  "compilerOptions": {
    "composite": false,    // Leaf apps are NOT referenced by others
    "incremental": true,   // OK for build caching
    "declaration": false,  // No .d.ts needed
    "noEmit": false
  },
  "exclude": [
    "node_modules", "dist", "build",
    "**/*.test.*", "**/*.spec.*",
    "*.config.*"           // Prevents tsc from emitting config files
  ]
}
```

---

## 4. Tools (`tools/afenda-cli`)

```jsonc
{
  "compilerOptions": {
    "composite": false,
    "module": "esnext",
    "moduleResolution": "bundler",
    "noUncheckedIndexedAccess": false,
    "exactOptionalPropertyTypes": false
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist", "bin"]
}
```

**tsup for tools:**

```typescript
export default defineConfig({
  entry: { index: 'src/cli.ts' },
  format: ['esm'],
  dts: true,
  clean: true,
  tsconfig: './tsconfig.build.json', // Still needed for tsup DTS
  external: ['afenda-canon'],        // Workspace deps stay external
});
```

**Known issue:** If a tool imports a workspace package marked `external`, that package must be resolvable at runtime via pnpm symlinks. If `node_modules/<pkg>` is missing in the tool's directory, the tool will fail at runtime even though the build succeeds. Fix: ensure `pnpm install` has run and the symlink exists.

---

## 5. Diagnosis Checklist

Run this checklist when `tsc --noEmit`, `tsup`, or `vitest` fails.

### Step 1 — Identify the package category

```
Is it in packages/* AND consumed by others?  → Library package
Is it in business-domain/*?                  → Source-first domain
Is it in apps/*?                             → Leaf app
Is it in tools/*?                            → Tool
```

### Step 2 — Check `package.json` exports

```bash
# Source-first: should point to src/
grep '"main"' business-domain/finance/*/package.json
# Expected: "./src/index.ts"

# Library: should point to dist/
grep '"main"' packages/*/package.json
# Expected: "./dist/index.js" or "./src/index.ts" (crud pattern)
```

### Step 3 — Check tsconfig for forbidden combinations

```bash
# Run tsc and capture errors
pnpm --filter <package-name> exec tsc --noEmit 2>&1

# Common forbidden combos:
# composite: true + noEmit: true       → TS5053
# composite: true + incremental: false → TS5053
# composite: true + tsup ./tsconfig.json → TS5055 (would overwrite input)
```

### Step 4 — Check root tsconfig references

```bash
# Verify only library packages are referenced
cat tsconfig.json | grep -A2 '"references"'

# Source-first packages in references cause:
# error TS6306: Referenced project must have setting "composite": true
```

### Step 5 — Check tsup config

```bash
pnpm --filter <package-name> build 2>&1

# If DTS fails with TS5055: tsup is using tsconfig.json not tsconfig.build.json
# Fix: tsconfig: './tsconfig.build.json' in tsup.config.ts

# If ESM build fails with "Could not resolve afenda-canon":
# The package is in external[] but not symlinked in node_modules
# Fix: pnpm install, or move to noExternal[] if it must be bundled
```

### Step 6 — Check vitest alias for domain packages

```bash
pnpm --filter <package-name> test 2>&1

# If "Failed to resolve entry for package afenda-canon":
# Missing resolve.alias in vitest.config.ts
# Fix: add alias pointing to packages/canon/src/index.ts

# If DATABASE_URL error at import time:
# Missing vi.mock('afenda-database') in test file
# Fix: add vi.mock at top of test file (Vitest hoists it automatically)
```

---

## 6. Governance — Automated Checks

### CI gate: `pnpm ci:domain-gates`

Runs `tools/ci-gates/` tests that enforce:
- No direct DB writes in domain packages (no `insert`, `update`, `delete` calls)
- No `new Date()` in domain packages (use `ctx.asOf`)
- No raw `throw new Error()` (use `DomainError`)

### Type-check gate

```bash
# Check all library packages via project references
pnpm tsc --build --noEmit

# Check individual source-first packages
pnpm --filter afenda-accounting type-check
pnpm --filter afenda-tax-engine type-check
```

### Lint gate

```bash
# Catches import/no-cycle violations
pnpm --filter <package-name> lint:ci
```

### Proposed: `afenda doctor ts` command

Add to `tools/afenda-cli` a `doctor ts` subcommand that:
1. Reads all `package.json` files in `packages/*` and `business-domain/*/*`
2. Validates `main` field matches expected pattern per category
3. Checks `tsconfig.json` for forbidden combinations
4. Verifies root `tsconfig.json` references only contain library packages
5. Checks every library package has `tsconfig.build.json`
6. Checks every library package's `tsup.config.ts` uses `tsconfig.build.json`

---

## 7. Common Errors & Fixes

### `error TS5053: Option 'composite' cannot be used with option 'noEmit'`

**Cause:** `tsconfig.json` has both `composite: true` and `noEmit: true`.  
**Fix:** Remove `noEmit` (composite implies emit). Or if you truly don't want output, remove `composite`.

### `error TS5055: Cannot write file '...' because it would overwrite input file`

**Cause:** tsup is using `tsconfig.json` (with `composite: true`) directly.  
**Fix:** Create `tsconfig.build.json` with `composite: false` and point tsup at it.

### `error TS6306: Referenced project '...' must have setting "composite": true`

**Cause:** A source-first package (no `composite`) is listed in root `tsconfig.json` `references`.  
**Fix:** Remove it from `references`. Source-first packages don't use project references.

### `Failed to resolve entry for package "afenda-canon"` (Vitest)

**Cause:** `afenda-canon`'s `exports` field points to `dist/index.mjs` which doesn't exist in Vite's resolution path.  
**Fix:** Add `resolve.alias` in `vitest.config.ts` pointing to `packages/canon/src/index.ts`.

### `Cannot find module 'afenda-database'` (IDE squiggles only)

**Cause:** IDE's tsserver resolves via `exports` → `dist/` which may not exist locally.  
**Not a build error** — `tsc --noEmit` and `vitest` both work correctly.  
**Fix:** Run `pnpm --filter afenda-database build` to generate dist, or ignore (squiggles only).

### `ERR_MODULE_NOT_FOUND: Cannot find module '.../afenda-canon/dist/index.mjs'` (CLI runtime)

**Cause:** CLI tool has `afenda-canon` in `external[]` but pnpm hasn't symlinked it into the tool's `node_modules`.  
**Fix:** `pnpm install` from repo root. The symlink should appear at `tools/afenda-cli/node_modules/afenda-canon`.

---

## 8. Quick Reference

```
Package category → tsconfig rule
─────────────────────────────────────────────────────────────
Library (packages/*)    composite:true  noEmit:false  tsconfig.build.json ✓  root refs ✓
Source-first (business-domain)  composite:false  noEmit:true(default)  no tsconfig.build  no root refs
Leaf app (apps/*)       composite:false  noEmit:false  no tsconfig.build  no root refs
Tool (tools/*)          composite:false  noEmit:false  tsconfig.build.json ✓  no root refs

tsup rule
─────────────────────────────────────────────────────────────
Always: tsconfig: './tsconfig.build.json'
Never:  tsconfig: './tsconfig.json'  (breaks DTS when composite:true)
```

---

## Related Skills

- `package-development` — Full package creation checklist and templates
- `vitest-testing` — Vitest configuration, MCP tooling, test patterns
- `lint-types-debug` — ESLint and TypeScript error debugging
