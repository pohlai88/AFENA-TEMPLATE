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
- `tools/afenda-cli/src/executor/resolver.ts` - env property

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

## TypeScript Strict Mode Deep Dive

**Source:** [TypeScript Handbook - Compiler Options](https://www.typescriptlang.org/tsconfig)

### strictNullChecks (Official Docs)

When `strictNullChecks: false`, `null` and `undefined` are effectively ignored by the language. This can lead to unexpected runtime errors.

When `strictNullChecks: true`, `null` and `undefined` have their own distinct types:

```ts
// With strictNullChecks: true
const users = [{ name: 'Oby', age: 12 }];
const user = users.find((u) => u.name === 'Oby');
console.log(user.age); // Error: 'user' is possibly 'undefined'

// Fix with optional chaining
console.log(user?.age); // OK: number | undefined

// Fix with nullish coalescing
const age = user?.age ?? 0; // OK: number

// Fix with type guard
if (user) {
  console.log(user.age); // OK: user is narrowed to defined
}
```

**Array.find() signature difference:**

```ts
// strictNullChecks: true
type Array<T> = {
  find(predicate: (value: T) => boolean): T | undefined;
};

// strictNullChecks: false (unsafe)
type Array<T> = {
  find(predicate: (value: T) => boolean): T; // Lies about return type!
};
```

### alwaysStrict (Official Docs)

Ensures files are parsed in ECMAScript strict mode and emits `"use strict"` for each source file.

**Benefits:**

- Prevents accidental globals
- Makes `this` undefined in functions (not global object)
- Disallows duplicate parameter names
- Throws on assignment to read-only properties

**Enabled by:** `strict: true` or explicit `alwaysStrict: true`

---

## ESLint Flat Config Best Practices

**Source:** [ESLint Configuration Files](https://eslint.org/docs/latest/use/configure/configuration-files)

### Configuration Object Structure

Each config object can contain:

```js
{
  name: "my-config",           // For error messages and debugging
  files: ["**/*.ts"],          // Glob patterns to match
  ignores: ["**/*.test.ts"],   // Glob patterns to exclude
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      project: "./tsconfig.json",
      tsconfigRootDir: __dirname,
    },
  },
  plugins: { "@typescript-eslint": tsPlugin },
  rules: {
    "@typescript-eslint/no-explicit-any": "error",
  },
}
```

### Global Ignores Pattern

**Critical:** Ignores-only objects must be FIRST in the array:

```js
export default [
  // ✅ CORRECT - global ignores first
  { ignores: ["dist/**", "*.config.*"] },
  ...baseConfig,
  {
    files: ["src/**/*.ts"],
    rules: { /* ... */ },
  },
];

// ❌ WRONG - ignores after other configs
export default [
  ...baseConfig,
  { ignores: ["dist/**"] },  // Too late, already matched files!
];
```

### Files and Ignores Evaluation

**From ESLint docs:** Patterns use minimatch syntax and are evaluated relative to `eslint.config.js` location.

```js
// Matches all .js files
{ files: ["**/*.js"] }

// Matches .js files except in __tests__
{
  files: ["**/*.js"],
  ignores: ["__tests__/**"],
}

// Without files key - applies to ALL matched files
{
  rules: { semi: "error" }  // Applies to default patterns
}
```

**Default patterns:** `**/*.js`, `**/*.cjs`, `**/*.mjs`

---

## TypeScript Project References Troubleshooting

**Source:** [TypeScript Handbook - Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)

### When to Use Project References

**Benefits:**

- Greatly improve build times
- Enforce logical separation between components
- Better editor performance with large codebases
- Enable incremental builds

**Requirements:**

1. Referenced projects must have `composite: true`
2. Must have `declaration: true` (implied by composite)
3. All source files must be matched by `include` or listed in `files`

### Common TS6305 Errors

**Error:** `Output file 'X.d.ts' has not been built from source file 'X.ts'`

**Causes:**

1. **Stale build artifacts** - `.d.ts` files exist but are outdated
2. **Include/exclude mismatch** - Source file in tsconfig but not emitted
3. **tsup bundling** - tsup creates single `.d.ts` but tsconfig includes all sources

**Solutions:**

```bash
# Option 1: Clean rebuild
pnpm type-check:refs:clean

# Option 2: Force rebuild
tsc -b --force

# Option 3: Exclude internal files from tsconfig
{
  "include": ["src/**/*.ts"],
  "exclude": ["src/internal/**", "src/v2/**"]  // If bundled by tsup
}
```

### tsc -b Command Line Flags

**From TypeScript docs:**

```bash
tsc -b                    # Build referenced projects
tsc -b --verbose          # Show what's being built
tsc -b --dry              # Show what would be built
tsc -b --clean            # Delete outputs
tsc -b --force            # Rebuild everything
tsc -b --watch            # Watch mode
```

**Build order:** TypeScript automatically orders projects by dependencies.

### Composite Project Requirements

**From TypeScript docs:** Enabling `composite: true` changes:

1. `rootDir` defaults to directory containing tsconfig
2. All implementation files must be matched by `include` or in `files`
3. `declaration` must be `true`
4. Enables project references

```json
// ✅ Valid composite project
{
  "compilerOptions": {
    "composite": true,
    "declaration": true, // Required
    "declarationMap": true, // Recommended for go-to-definition
    "outDir": "./dist"
  },
  "include": ["src/**/*.ts"] // Must match all source files
}
```

---

## tsup Declaration Bundling

**Issue:** tsup bundles all `.d.ts` files into single `dist/index.d.ts`, but TypeScript expects individual declaration files when `composite: true`.

### Pattern: Separate Build Config

```json
// tsconfig.json - For project references
{
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "outDir": "./dist"
  },
  "include": ["src/index.ts"],  // Only entry point
  "exclude": ["src/internal/**"]  // Exclude bundled internals
}

// tsconfig.build.json - For tsup
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "composite": false,      // Disable for bundling
    "incremental": false,
    "tsBuildInfoFile": null
  },
  "include": ["src/**/*.ts"]  // All files for bundling
}
```

**tsup.config.ts:**

```ts
export default defineConfig({
  entry: ['src/index.ts'],
  tsconfig: './tsconfig.build.json', // Use build config
  dts: true, // Bundles all .d.ts into single file
});
```

### When to Accept TS6305 Warnings

**Safe to ignore if:**

1. Package builds successfully
2. Consumers can import and use the package
3. Warnings are only about internal implementation files
4. Package has proper `types` field in package.json

**Example:**

```json
// package.json
{
  "types": "./dist/index.d.ts", // Points to bundled declaration
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  }
}
```

---

## Troubleshooting Guide

### Lint passes but type-check fails

**Cause:** ESLint and TypeScript use different parsers and type systems.

**Solution:**

```bash
# Always run both before committing
pnpm lint && pnpm type-check

# Or use a pre-commit hook
```

### type-check passes but type-check:refs fails

**Cause:** Stale `.d.ts` files or project reference configuration issues.

**Solutions:**

```bash
# 1. Clean rebuild
pnpm type-check:refs:clean

# 2. Check root tsconfig includes/excludes
# Should only include packages/**, not apps or tools

# 3. Verify composite projects have declaration: true
```

### ESLint rules not applying to files

**Cause:** Config ordering or files/ignores patterns.

**Debug:**

```bash
# Use ESLint debug mode
DEBUG=eslint:* pnpm lint

# Check which config applies to a file
pnpm eslint --print-config src/file.ts
```

**Common fixes:**

1. Move `...baseConfig` to top of array
2. Check `ignores` patterns aren't too broad
3. Ensure `files` patterns match your file extensions

### Type errors only in CI, not locally

**Causes:**

1. Different TypeScript versions
2. Missing build step (stale `.d.ts`)
3. Different node_modules (lockfile drift)

**Solutions:**

```bash
# Match TypeScript version
pnpm list typescript

# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Rebuild all packages
pnpm build
```

---

## Pino Logger (INVARIANT-08)

```ts
// ❌
console.log('msg', obj);

// ✅ Correct arg order: (msg, obj) — pino/correct-args-position
import { logger } from 'afenda-logger';
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

- `afenda-crud`
- `afenda-database`
- `afenda-search`
- `afenda-workflow`
- `afenda-ui`
- `web` (apps/web)
