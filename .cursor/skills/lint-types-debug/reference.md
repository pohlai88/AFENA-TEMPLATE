# Lint & Type Debug Reference

Detailed error patterns, code snippets, and config snippets for AFENDA-NEXUS.

---

## TypeScript Strict Settings (Root tsconfig)

The project uses very strict settings. Common friction points:

| Option | Effect | Typical Fix |
|--------|--------|-------------|
| `noUncheckedIndexedAccess` | `arr[0]` is `T \| undefined` | Use `arr.at(0)`, `arr[0] ?? default`, or explicit check |
| `strictNullChecks` | Must handle null/undefined | Optional chaining, nullish coalescing |
| `exactOptionalPropertyTypes` | `{ a?: number }` ≠ `{ a?: number \| undefined }` | Be explicit with optional vs undefined |
| `noImplicitReturns` | All code paths must return | Add explicit return in all branches |
| `noUnusedLocals` / `noUnusedParameters` | Unused vars/params error | Prefix with `_` or remove |

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
