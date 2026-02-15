# Lint & Type Debug Reference

Detailed error patterns, code snippets, and config snippets for AFENDA-NEXUS.

---

## TypeScript Strict Settings (Root tsconfig)

The project uses very strict settings. Common friction points:

| Option                                  | Effect                                           | Typical Fix                                             |
| --------------------------------------- | ------------------------------------------------ | ------------------------------------------------------- |
| `noUncheckedIndexedAccess`              | `arr[0]` is `T \| undefined`                     | Use `arr.at(0)`, `arr[0] ?? default`, or explicit check |
| `strictNullChecks`                      | Must handle null/undefined                       | Optional chaining, nullish coalescing                   |
| `exactOptionalPropertyTypes`            | `{ a?: number }` ≠ `{ a?: number \| undefined }` | Use conditional spread: `...(val ? { key: val } : {})`  |
| `noImplicitReturns`                     | All code paths must return                       | Add explicit return in all branches                     |
| `noUnusedLocals` / `noUnusedParameters` | Unused vars/params error                         | Prefix with `_` or remove                               |

### exactOptionalPropertyTypes (Official Docs)

**Source:** [TypeScript Handbook](https://www.typescriptlang.org/tsconfig/exactOptionalPropertyTypes.html)

With `exactOptionalPropertyTypes: true`, optional properties cannot be explicitly set to `undefined`:

```ts
interface Config {
  timeout?: number; // means: omit the key OR provide a number
}

// ❌ WRONG - explicitly setting undefined
const cfg: Config = {
  timeout: maybeTimeout, // Error if maybeTimeout can be undefined
};

// ✅ CORRECT - conditional spread (omit key when undefined)
const cfg: Config = {
  ...(maybeTimeout !== undefined ? { timeout: maybeTimeout } : {}),
};

// ✅ CORRECT - widen the type if undefined is meaningful
interface Config {
  timeout: number | undefined; // explicitly allows undefined values
}
```

**Pattern used in this codebase:**

- `apps/web/src/lib/api/entity-route-handlers.ts` - cursor, meta properties
- `packages/crud/src/read.ts` - cache options (includeDeleted, limit, offset, cursor)
- `tools/afena-cli/src/executor/resolver.ts` - env property

### noUncheckedIndexedAccess (Official Docs)

**Source:** [TypeScript Handbook](https://www.typescriptlang.org/tsconfig/noUncheckedIndexedAccess.html)

Adds `undefined` to any un-declared field accessed via index signature or array access:

```ts
const arr: string[] = ['a', 'b'];
const first = arr[0]; // Type: string | undefined (not just string)

interface Env {
  [key: string]: string;
}
const env: Env = { NODE_ENV: 'prod' };
const nodeEnv = env.NODE_ENV; // Type: string | undefined
```

---

## ESLint Type-Checked Rules (base.js)

These require `projectService: true` and `tsconfigRootDir`:

- `@typescript-eslint/no-floating-promises` — await or void
- `@typescript-eslint/await-thenable` — only await Promises
- `@typescript-eslint/no-misused-promises` — async in sync contexts
- `@typescript-eslint/require-await` — async without await
- `@typescript-eslint/return-await` — return await in try/catch
- `@typescript-eslint/prefer-nullish-coalescing`
- `@typescript-eslint/prefer-optional-chain`
- `@typescript-eslint/no-unnecessary-type-assertion`

---

## EX-LINT-DRZ-TX-001 Override Template

Use when Drizzle transaction typing loses schema and you need intentional `any` in tx callbacks:

```js
// In package eslint.config.js — place AFTER base + package rules
{
  files: [
    'src/mutate.ts',
    'src/handlers/**/*.ts',
    'src/read.ts',
    'src/services/**/*.ts',
    // add other paths as needed
  ],
  rules: {
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
  },
},
```

**Do not** add `@typescript-eslint/no-unnecessary-type-assertion` to this override.

---

## Safe Array Access (noUncheckedIndexedAccess)

```ts
// ❌ arr[0] may be undefined
const first = frontier[0];

// ✅ Option 1: .at(0) with fallback
const first = frontier.at(0) ?? defaultValue;

// ✅ Option 2: Explicit check
if (frontier.length > 0) {
  const first = frontier[0]!; // or frontier[0] as T
}

// ✅ Option 3: Optional chaining
const depth = frontier.at(0)?.depth ?? Infinity;
```

---

## TypeScript Project References (tsc -b)

**Source:** [TypeScript Handbook - Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)

### Two Type-Check Modes

| Command                | Purpose                        | Scope                              | Speed  |
| ---------------------- | ------------------------------ | ---------------------------------- | ------ |
| `pnpm type-check`      | Per-package dev checks         | Each package independently         | Fast   |
| `pnpm type-check:refs` | Cross-package graph validation | Library packages only via `tsc -b` | Slower |

### Root tsconfig.json Structure

```json
{
  "include": ["packages/**/*.ts"], // Only library packages
  "exclude": [
    "apps", // Leaf apps (Next.js) not in refs
    "tools", // Standalone tools not in refs
    "**/__tests__/**", // Tests excluded from build graph
    "**/*.test.ts"
  ],
  "references": [
    { "path": "./packages/ui" },
    { "path": "./packages/crud" }
    // Only composite: true library packages
  ]
}
```

### Package tsconfig.json (Library)

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "composite": true, // Required for project references
    "declaration": true, // Emit .d.ts files
    "declarationMap": true, // For go-to-definition
    "outDir": "./dist"
  },
  "include": ["src/**/*.ts"],
  "exclude": ["**/*.test.ts", "**/__tests__/**"]
}
```

### Package tsconfig.json (Leaf App - Next.js)

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "composite": false, // NOT in reference graph
    "noEmit": false // Next.js handles build
  }
}
```

**Key Rule:** Only `composite: true` library packages belong in root `references` array. Apps and tools are excluded.

---

## Pino Logger (INVARIANT-08)

```ts
// ❌
console.log('msg', obj);

// ✅ Correct arg order: (msg, obj) — pino/correct-args-position
import { logger } from 'afena-logger';
logger.info({ ...obj }, 'msg');
// or
logger.info('msg', obj);
```

---

## Config Ordering Checklist

When editing `eslint.config.js`:

- [ ] `...baseConfig` is first (or right after root ignores)
- [ ] Package ignores come before rules
- [ ] `languageOptions.parserOptions.projectService` and `tsconfigRootDir` set for type-checked rules
- [ ] File-specific overrides (EX-LINT-DRZ-TX-001, test files, etc.) are last
- [ ] No duplicate/broken `no-restricted-syntax` selectors

---

## Package Filter Names

Use these with `pnpm --filter <name>`:

- `afena-crud`
- `afena-database`
- `afena-search`
- `afena-advisory`
- `afena-workflow`
- `afena-ui`
- `web` (apps/web)
