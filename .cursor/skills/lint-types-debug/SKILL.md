---
name: lint-types-debug
description: Diagnose and fix ESLint and TypeScript errors in the AFENDA-NEXUS monorepo. Use when lint or type-check fails, when debugging type errors, when ESLint reports violations, or when the user mentions INVARIANT, EX-LINT, or strict type/lint issues.
---

# Lint & Type Debugging (AFENDA-NEXUS)

Reduces debugging hell for ESLint and TypeScript issues by applying project-specific patterns and commands.

---

## Quick Commands

| Task                                | Command                                   |
| ----------------------------------- | ----------------------------------------- |
| Lint all                            | `pnpm run lint`                           |
| Type-check (fast, per-package)      | `pnpm run type-check`                     |
| Type-check (refs, graph validation) | `pnpm run type-check:refs`                |
| Lint single package                 | `pnpm --filter afena-crud run lint`       |
| Lint fix (auto-fix)                 | `pnpm run lint:fix`                       |
| Type-check single package           | `pnpm --filter afena-crud run type-check` |
| Console invariant check             | `pnpm check:no-console`                   |
| Clean refs build                    | `pnpm run type-check:refs:clean`          |

**Turbo pipeline:** `lint` and `type-check` depend on `^build`. If a package fails, ensure its dependencies built first.

**Type-check modes:**

- `type-check` → Turbo runs `tsc --noEmit` per package (fast, for dev)
- `type-check:refs` → `tsc -b` validates cross-package contracts (for CI/release)

---

## ESLint Flat Config Ordering (Critical)

In ESLint flat config, **later entries win** for matching files. Wrong order causes rules to be clobbered.

**Correct order:**

1. `...baseConfig` first (global defaults)
2. Package-level `ignores`
3. Package-level `languageOptions` + `rules`
4. **Overrides last** (file-specific exceptions)

**Wrong:** Putting `...baseConfig` after package rules — base will override your package settings.

---

## Common Error Patterns & Fixes

### 1. `Use afena-logger instead of console.* (INVARIANT-08)`

- **Fix:** Replace `console.log/info/warn/error` with `logger` from `afena-logger`.
- **Exception:** `tools/**`, `**/client-logger.ts`, bench files (see package eslint.config.js).

### 2. `Direct db.insert/update/delete is forbidden — use mutate() (INVARIANT-01)`

- **Fix:** Use `mutate()` from `afena-crud` instead of direct `db.insert/update/delete`.
- **Exception:** `packages/crud` (kernel), `apps/web/app/api/storage/**` (system/infra).

### 3. `dbRo.insert/update/delete is forbidden (INVARIANT-RO)`

- **Fix:** Never write via `dbRo`. Use `db` for writes.

### 4. `@typescript-eslint/no-unsafe-*` or `no-explicit-any` in Drizzle tx code

- **Context:** EX-LINT-DRZ-TX-001 — Drizzle transaction typing loses schema.
- **Fix:** Add a **file-scoped override** in that package's `eslint.config.js` (do not disable globally):

```js
{
  files: ['src/services/**/*.ts', 'src/mutate.ts', 'src/handlers/**/*.ts', ...],
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

- **Keep:** `@typescript-eslint/no-unnecessary-type-assertion` ON (it catches real bugs).

### 5. Import order (`import/order`)

- **Fix:** Run `pnpm --filter <package> run lint:fix` — do not hand-swap imports.
- Groups: builtin → external → internal → parent → sibling → index, with `newlines-between: 'always'`.

### 6. `no-restricted-syntax` — broken selector

- **Wrong:** `CallExpression[callee.object.property.name='console']` (does not match `console.log()`).
- **Correct:** `CallExpression[callee.object.name='console']`.

### 7. Type-check: `noUncheckedIndexedAccess` / `strictNullChecks`

- **Fix:** Use optional chaining (`?.`), nullish coalescing (`??`), or explicit checks. For array access, prefer `.at(0)` or `arr[0] ?? defaultValue` when safe.

### 8. Type-check: `exactOptionalPropertyTypes` errors

- **Context:** `Type 'X | undefined' is not assignable to type 'X'` with optional properties.
- **Fix:** Use conditional spread instead of assigning `undefined`:

```ts
// ❌ WRONG
const result = {
  data: items,
  meta: hasMore ? { nextCursor } : undefined, // Error!
};

// ✅ CORRECT
const result = {
  data: items,
  ...(hasMore ? { meta: { nextCursor } } : {}),
};
```

- **Examples in codebase:** `apps/web/src/lib/api/entity-route-handlers.ts`, `packages/crud/src/read.ts`, `tools/afena-cli/src/executor/resolver.ts`

### 9. `no-restricted-imports` (web app)

- **Context:** Kernel (`@afena/database`, `afena-crud`, `drizzle-orm`) only in boundary modules.
- **Fix:** Import via `entity-route-handlers`, `entity-actions`, or other allowed boundary modules. See `apps/web/eslint.config.js` for the allowed file list.

### 10. `tsc -b` errors (TS2307, TS6305)

- **Context:** Project reference validation fails with module resolution or stale `.d.ts` errors.
- **Root cause:** Root `tsconfig.json` includes apps/tools in build graph.
- **Fix:** Root tsconfig should only include `packages/**/*.ts` and exclude `apps`, `tools`, and test files. See [reference.md](reference.md) for project reference structure.

---

## Package-Specific Notes

| Package                          | Notes                                                                                                        |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `afena-crud`                     | Kernel — omits INVARIANT-01 (db.insert/update/delete). Has EX-LINT-DRZ-TX-001 overrides for core + services. |
| `afena-search`, `afena-advisory` | Omit INVARIANT-01.                                                                                           |
| `afena-workflow`                 | Fire-and-forget db.insert for workflow state — exempt from INVARIANT-01.                                     |
| `web`                            | Complex `no-restricted-imports`; boundary modules allow kernel.                                              |

---

## Workflow: Fixing Lint/Type Failures

1. **Run the failing command** to get the exact error list.
2. **Categorize:** Lint vs type-check; which package.
3. **Lint:** Check if it's config (ordering, overrides) or code (fix or add override).
4. **Type:** Check if it's `noUncheckedIndexedAccess`, `strictNullChecks`, or missing types.
5. **Apply fix** per pattern above.
6. **Re-run** `pnpm run lint` and `pnpm run type-check` before committing.

---

## Additional Resources

- **Error patterns and code snippets:** [reference.md](reference.md)
- **Official TypeScript docs:** [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- **Official ESLint docs:** [ESLint Configuration](https://eslint.org/docs/latest/use/configure/)
- **TypeScript Project References:** [Official Guide](https://www.typescriptlang.org/docs/handbook/project-references.html)
