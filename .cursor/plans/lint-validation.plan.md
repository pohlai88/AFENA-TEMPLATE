---
name: Lint Validation Plan
overview: Ratification-ready plan to fix afena-crud lint failures: correct config ordering, precise bench handling, split core vs services overrides, remove broken selector, and safe lot-recall predicate.
todos: []
isProject: false
---

# Lint Validation Plan (Ratification-Ready)

## Validation Summary

The afena-crud lint failures stem from **configuration gaps**. This plan applies ratification-ready adjustments with correct ESLint flat-config ordering and minimal, precise overrides.

---

## 1. Config Ordering — Critical

In ESLint flat config, **later entries win** for the files they match. If `...baseConfig` comes after your package-level rules, baseConfig can clobber your kernel-specific settings.

**Safer contract-grade ordering:**

1. `...baseConfig` first (global defaults)
2. Package-level ignores
3. Package-level `languageOptions` + `rules` (kernel restrictions)
4. Overrides last (tx-typing exceptions)

This guarantees your package-level restrictions and tx-typing exceptions are not accidentally overridden by base.

---

## 2. Bench Exclusion — Full Coverage for Tests Benches

**Single pattern** (covers both `src/__tests__` and nested `src/**/__tests__`):

```js
'src/**/__tests__/**/*.bench.*',
```

**Wording:** Use "Full Coverage for **tests** benches" — not "Full Coverage" — to avoid overclaim. Benches in `__benchmarks__` or `bench/` are not covered (intentional).

**Optional hardening:** Instead of ignoring benches, keep them linted and only allow console in those files:

```js
{
  files: ['src/**/__tests__/**/*.bench.*'],
  rules: {
    'no-restricted-syntax': 'off',
  },
},
```

This keeps benches subject to import/order, types, etc.; only the console rule is lifted. If you prefer to fully ignore benches for speed, keep the ignore.

---

## 3. Console Rule Selector — Remove Broken One

The selector `CallExpression[callee.object.property.name='console']` does **not** match `console.log()` because `callee.object` is `console` (an Identifier), not an object with `.property.name === 'console'`.

The correct selector is:

```js
CallExpression[callee.object.name='console']
```

**Action:** Delete the second selector. It is redundant and misleading. If you need to catch `global.console.log()` or `globalThis.console.log()`, add explicit selectors for those; otherwise keep the contract minimal.

---

## 4. Override Scope — Split Core vs Services

Two separate overrides:

- **Override A (core):** Explicit list — mutate, handlers, read, metering, policy-engine, governor
- **Override B (services):** `src/services/**/*.ts` only

**Rule list:** Do **not** include `@typescript-eslint/no-unnecessary-type-assertion`. It can hide actual useless casts. Keep it on.

---

## 5. lot-recall.ts — Safe Predicate

Use `.at(0)` for clarity:

```ts
while (frontier.length > 0) {
  const nextDepth = frontier.at(0)?.depth ?? Infinity;
  if (nextDepth > maxDepth) break;
  // ... rest of loop body
}
```

**Runtime note:** `.at()` requires Node 16.6+. If runtime/tooling is older, use `frontier[0]` with optional chaining instead (still safe).

---

## 6. mutate.ts Import Order — Deterministic via lint:fix

Run `pnpm --filter afena-crud run lint:fix` and commit the diff. Do not hand-swap.

---

## 7. Out of Scope — Contract-Safe Wording

> Errors are primarily driven by bench-file console usage, import ordering, and the lot-recall predicate; remaining errors should clear after the config adjustments and `lint:fix`.

---

## Final eslint.config.js (Exact Form)

```js
const baseConfig = require('afena-eslint-config/base');

module.exports = [
  ...baseConfig,

  {
    ignores: [
      'dist/**',
      '*.config.*',
      '**/*.test.*',
      '**/*.spec.*',
      'src/**/__tests__/**/*.bench.*',
    ],
  },

  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      // packages/crud IS the kernel — it is allowed to use db.insert/update/delete
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.object.name='console']",
          message: 'Use afena-logger instead of console.* (INVARIANT-08)',
        },
        // INVARIANT-01 db.insert/update/delete rules intentionally omitted here
      ],
    },
  },

  // Override A: Core files that require tx typing exceptions (explicit list)
  {
    files: [
      'src/mutate.ts',
      'src/handlers/**/*.ts',
      'src/read.ts',
      'src/metering.ts',
      'src/policy-engine.ts',
      'src/governor.ts',
    ],
    rules: {
      // EX-LINT-DRZ-TX-001: Drizzle tx typing loses schema; allow intentional any-casts
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
    },
  },

  // Override B: Services only (no-unnecessary-type-assertion kept ON)
  {
    files: ['src/services/**/*.ts'],
    rules: {
      // EX-LINT-DRZ-TX-001: Drizzle tx typing loses schema; allow intentional any-casts in services
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
    },
  },
];
```

**Key fixes in this form:**

- `...baseConfig` first
- Broken `callee.object.property.name='console'` selector removed
- Ignores and package rules after base
- Overrides last

---

## Patch Order

1. Update [packages/crud/eslint.config.js](packages/crud/eslint.config.js) with the exact form above.
2. Run `pnpm --filter afena-crud run lint:fix` and commit the diff.
3. Fix [packages/crud/src/services/lot-recall.ts](packages/crud/src/services/lot-recall.ts) using the safe predicate with `.at(0)` (or `frontier[0]` if Node &lt; 16.6).
4. Verify `pnpm --filter afena-crud run lint` and `pnpm run type-check`.
