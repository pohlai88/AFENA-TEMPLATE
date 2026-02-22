# ESLint Configuration — AFENDA-NEXUS Monorepo

## Overview

This skill documents the ESLint configuration architecture, rules, and governance for the AFENDA-NEXUS monorepo. It is the authoritative reference for creating, modifying, or debugging ESLint configs.

## Architecture

### 3-Tier Config Hierarchy

```
packages/eslint-config/          ← Shared presets (Layer 0)
  base.js                        ← All packages: TS, import, security, pino, custom rules
  react.js                       ← UI packages: extends base + React + JSX-A11y
  next.js                        ← Web app: extends react + Next.js path groups
  rules/
    no-direct-db-access.js       ← Custom AST rule: SESSION-01
    no-db-transaction-outside-session.js  ← Custom AST rule: SESSION-02

per-package eslint.config.{js,cjs}  ← Package-level overrides (Layer 1)
  - ignores block (MUST be first)
  - ...baseConfig / ...reactConfig / ...nextConfig spread
  - projectService + tsconfigRootDir
  - package-specific rule overrides

file-level overrides               ← Targeted exceptions (Layer 2)
  - { files: [...], rules: {...} }
  - Must have EX-LINT-* exception code + expiry date
```

### Preset Selection

| Package type   | Preset  | Example                            |
| -------------- | ------- | ---------------------------------- |
| Node library   | `base`  | packages/crud, packages/logger     |
| Domain package | `base`  | business-domain/finance/accounting |
| UI library     | `react` | packages/ui                        |
| Next.js app    | `next`  | apps/web                           |
| CLI tool       | `base`  | tools/afenda-cli                   |

## Rules

### RULE-01: Every package with src/ MUST have an eslint config

Config packages (eslint-config, typescript-config) and test-only packages (ci-gates) are exempt.

### RULE-02: CJS format for type:module packages

Packages with `"type": "module"` in `package.json` MUST use `eslint.config.cjs` (not `.js`).
ESLint loads config files as ES modules when `"type": "module"` — CJS `require()` fails in ESM context.

### RULE-03: ignores block MUST be first element

In ESLint flat config, array order determines precedence. The `ignores` block MUST appear BEFORE `...baseConfig` spread:

```js
// ✅ CORRECT
module.exports = [
  { ignores: ['dist/**', '*.config.*'] },
  ...baseConfig,
  {
    /* overrides */
  },
];

// ❌ WRONG — ignores after spread won't override base rules
module.exports = [...baseConfig, { ignores: ['dist/**', '*.config.*'] }];
```

### RULE-04: Mandatory ignores

Every eslint config MUST ignore at minimum:

- `dist/**` — build output
- `*.config.*` — config files not in tsconfig include

Additional common ignores:

- `.next/**` — Next.js build output (apps/web only)

**Test files excluded from tsconfig:** Do NOT add test files to ignores.
Instead, use `tseslint.configs.disableTypeChecked` to disable only type-checked
rules while keeping non-type-checked rules (import/order, no-restricted-syntax, etc.) active.
The `domain.js` preset already handles this — see RULE-08.

### RULE-05: No createRequire ESM hack

Never use `createRequire(import.meta.url)` to load CJS base config from ESM.
Instead, rename the config to `.cjs` and use standard `require()`.

### RULE-06: Vitest globals, not Jest

Test file overrides use Vitest globals (`vi`, `describe`, `it`, `expect`, `test`, `beforeEach`, `afterEach`, `beforeAll`, `afterAll`). Never reference `jest: true`.

### RULE-07: Use projectService:true

All per-package configs MUST use `projectService: true` (typescript-eslint v8+), NOT `project: './tsconfig.json'`.
The base config MUST NOT set `project: true` — it conflicts with `projectService: true` set by packages.

### RULE-08: disableTypeChecked for test files in domain packages

Domain package tsconfigs exclude `**/*.test.*` and `**/*.spec.*` (correct — tests
shouldn't be compiled into dist). This means `projectService: true` cannot parse them
for type-checked rules. The fix is `tseslint.configs.disableTypeChecked`:

```js
// In domain.js (already applied):
{
  files: ['**/*.test.*', '**/*.spec.*'],
  ...tseslint.configs.disableTypeChecked,
},
```

This disables type-checked rules (require-await, no-floating-promises, etc.) on test
files while keeping non-type-checked rules (import/order, no-restricted-syntax, etc.)
active. Do NOT use `allowDefaultProject` — it creates a new TS program per file and
has an 8-file limit.

## Custom Rules

### afenda/no-direct-db-access (SESSION-01)

Prevents importing `db` or `dbRo` from `afenda-database` outside allowed paths.

**Allowed paths:** database internals, crud kernel, search (read-only), workers, tools.

### afenda/no-db-transaction-outside-session (SESSION-02)

Prevents calling `db.transaction()` or `dbRo.transaction()` directly.
All transactions must go through `DbSession.rw()` or `DbSession.ro()`.

**Allowed paths:** db-session.ts, auth-context.ts, database scripts, tests, tools.

## Plugins

| Plugin                      | Purpose                               | Required by |
| --------------------------- | ------------------------------------- | ----------- |
| `@typescript-eslint`        | TS type-checked rules                 | base.js     |
| `eslint-plugin-import`      | Import order, no-cycle, no-duplicates | base.js     |
| `eslint-plugin-security`    | Security patterns                     | base.js     |
| `eslint-plugin-pino`        | Logger argument order (INVARIANT-08)  | base.js     |
| `eslint-plugin-react`       | React rules                           | react.js    |
| `eslint-plugin-react-hooks` | Hooks rules                           | react.js    |
| `eslint-plugin-jsx-a11y`    | Accessibility                         | react.js    |
| `eslint-config-prettier`    | Disable formatting rules              | root        |

## Exception Codes

All rule overrides MUST have an exception code and expiry date:

```js
// EX-LINT-CLI-00 (expires: 2026-03-15): CLI tools use console for stdout.
{
  files: ['src/**/*.ts'],
  rules: { 'no-console': 'off' },
}
```

Format: `EX-LINT-{PACKAGE}-{NUMBER}` with `(expires: YYYY-MM-DD)`.

## New Package Checklist

1. Create `eslint.config.cjs` (if `"type":"module"`) or `eslint.config.js`
2. First element: `{ ignores: ['dist/**', '*.config.*'] }`
3. Spread correct preset: `...baseConfig` / `...reactConfig` / `...nextConfig`
4. Set `projectService: true` + `tsconfigRootDir: __dirname`
5. Add package-specific overrides with exception codes
6. Run `pnpm --filter <pkg> exec eslint src/` to verify

## CI Gate

`tools/ci-gates/eslint-config.test.ts` enforces RULE-01 through RULE-07 via static analysis.

## Biome Decision (Feb 2026)

**Keep ESLint + Prettier.** Biome cannot replace:

- Custom AST rules (no-direct-db-access, no-db-transaction-outside-session)
- Type-checked rules (no-floating-promises, await-thenable, no-misused-promises)
- `no-restricted-syntax` / `no-restricted-imports` (architectural invariants)
- eslint-plugin-pino, eslint-plugin-security
- prettier-plugin-tailwindcss (no Biome equivalent)

Re-evaluate when Biome ships Tailwind class sorting + custom rule plugins.
