````skill
---
name: lint-types-debug
description: Diagnose and fix ESLint and TypeScript errors in the AFENDA-NEXUS monorepo using official flat config and strict mode best practices. Use when lint/type-check fails, debugging type errors, ESLint violations, or INVARIANT/EX-LINT issues.
---

# Lint & Type Debugging (AFENDA-NEXUS)

Official ESLint flat config and TypeScript strict mode patterns for the AFENDA-NEXUS monorepo.

**Authoritative Sources:**
- [ESLint Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files)
- [TypeScript-ESLint Getting Started](https://typescript-eslint.io/getting-started/)
- [TSConfig Reference](https://www.typescriptlang.org/tsconfig)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)

---

## Quick Commands

| Task                                | Command                                   |
| ----------------------------------- | ----------------------------------------- |
| Lint all                            | `pnpm run lint`                           |
| Type-check (fast, per-package)      | `pnpm run type-check`                     |
| Type-check (refs, graph validation) | `pnpm run type-check:refs`                |
| Lint single package                 | `pnpm --filter afenda-crud run lint`       |
| Lint fix (auto-fix)                 | `pnpm run lint:fix`                       |
| Type-check single package           | `pnpm --filter afenda-crud run type-check` |
| Console invariant check             | `pnpm check:no-console`                   |
| Clean refs build                    | `pnpm run type-check:refs:clean`          |
| Debug config for file               | `pnpm eslint --print-config src/file.ts`  |
| Enable ESLint debug logging         | `DEBUG=eslint:* pnpm lint`                |

**Turbo pipeline:** `lint` and `type-check` depend on `^build`. Failures require dependency builds.

**Type-check modes:**
- `type-check` → Per-package `tsc --noEmit` (fast development)
- `type-check:refs` → Full `tsc -b` for cross-package validation (CI/release)

---

## ESLint Flat Config Structure (Official)

**Critical concept:** Flat config uses arrays of config objects. **Later entries override earlier ones** for matching files.

### Official Flat Config Format

```js
// eslint.config.js
import tseslint from 'typescript-eslint';
import tsParser from '@typescript-eslint/parser';

export default [
  // 1. Global ignores (applies to all subsequent configs)
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/.next/**'],
  },

  // 2. Shared base config (your defaults)
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        projectService: true, // Auto-detect tsconfig (TypeScript-ESLint 8+)
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },

  // 3. TypeScript recommended configs
  ...tseslint.configs.recommended,

  // 4. Package-specific overrides (MUST come after base)
  {
    files: ['packages/crud/src/**/*.ts'],
    rules: {
      // Override for Drizzle transaction typing issues (AFENDA-NEXUS specific)
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
```

**Source:** [ESLint Configuration Files](https://eslint.org/docs/latest/use/configure/configuration-files)

### AFENDA-NEXUS Config Ordering ⚠️

**Correct order:**

1. Global `ignores` patterns (first)
2. Shared base config with `languageOptions` + core `rules`
3. Extended configs (`...baseConfig`, `...tseslint.configs.recommended`)
4. Package-specific overrides (last)

**Wrong:** Putting `...baseConfig` or extended configs after package rules — they will override your custom settings.

### Official Config Object Schema

```ts
// Source: ESLint Linter.Config type
interface Config {
  files?: string[];         // Glob patterns (default: ['**/*.js'])
  ignores?: string[];       // Exclusion patterns
  languageOptions?: {
    parser?: Parser;        // Parser object (not string in flat config!)
    parserOptions?: object;
    globals?: Record<string, boolean>;
    sourceType?: 'module' | 'script' | 'commonjs';
    ecmaVersion?: number | 'latest';
  };
  linterOptions?: {
    reportUnusedDisableDirectives?: boolean | 'off' | 'warn' | 'error';
  };
  plugins?: Record<string, Plugin>; // Object of plugin instances
  rules?: Record<string, RuleSeverity | [RuleSeverity, ...options]>;
  settings?: Record<string, unknown>;
}
```

**Key differences from eslintrc:**
- `plugins` is an **object**, not an array of strings
- `parser` is an **imported module object**, not a string
- No `extends` field (use spread operator instead)

**Source:** [ESLint TypeScript Types](https://github.com/eslint/eslint/blob/main/lib/types/index.d.ts)

---

## TypeScript Strict Mode Configuration

### Official Recommended tsconfig.json

```json
{
  "compilerOptions": {
    // Type Checking (strict mode)
    "strict": true,                      // Enable all strict checks
    "noUncheckedIndexedAccess": true,    // []? for array access
    "exactOptionalPropertyTypes": true,  // No {x?: T} = {x: undefined}

    // Module System
    "module": "esnext",                  // or "nodenext" for Node.js
    "moduleResolution": "bundler",       // or "nodenext"
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,

    // Emit
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",

    // Project References (monorepo)
    "composite": true,                   // Enable project references
    "tsBuildInfoFile": "./dist/.tsbuildinfo",

    // Quality
    "skipLibCheck": true,               // Faster builds
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,

    // Libraries
    "lib": ["ES2021"],
    "target": "ES2021"
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist", "**/*.test.ts", "**/*.spec.ts"]
}
```

**Source:** [TSConfig Bases](https://github.com/tsconfig/bases), [TypeScript Handbook - Project Configuration](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

### AFENDA-NEXUS Specific: Project References

```json
// Root tsconfig.json - Only includes packages, not apps/tools
{
  "references": [
    { "path": "./packages/canon" },
    { "path": "./packages/database" },
    { "path": "./packages/crud" }
  ],
  "include": ["packages/**/*.ts"],
  "exclude": ["apps", "tools", "**/__tests__/**", "**/node_modules/**"]
}

// packages/crud/tsconfig.json
{
  "extends": "afenda-typescript-config/react-library.json",
  "compilerOptions": {
    "composite": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "references": [
    { "path": "../database" },
    { "path": "../canon" }
  ]
}
```

**Issue:** Root tsconfig including `apps/` or `tools/` causes TS6305 errors.
**Fix:** Exclude non-library packages from root build graph.

**Source:** [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)

---

## Common Error Patterns & Fixes

### 1. `Use afenda-logger instead of console.* (INVARIANT-08)`

**Rule:** Project-specific custom rule
**Fix:** Replace `console.log/info/warn/error` with `logger` from `afenda-logger`

```ts
// ❌ WRONG
console.log('User created:', userId);

// ✅ CORRECT
import { logger } from 'afenda-logger';
logger.info({ userId }, 'User created');
```

**Exceptions:** `tools/**`, `**/client-logger.ts`, bench files (see package eslint.config.js)

### 2. `Direct db.insert/update/delete forbidden - use mutate() (INVARIANT-01)`

**Rule:** Enforce mutation tracking through CRUD abstraction
**Fix:** Use `mutate()` from `afenda-crud`

```ts
// ❌ WRONG
const [newUser] = await db.insert(users).values({ name }).returning();

// ✅ CORRECT
import { mutate } from 'afenda-crud';
const result = await mutate(tx).insert(users, { org_id, name }, userId);
```

**Exceptions:** `packages/crud` (kernel), `apps/web/app/api/storage/**` (system/infra)

### 3. `@typescript-eslint/no-unsafe-*` in Drizzle Transaction Code

**Context:** Known TypeScript-ESLint limitation with Drizzle transaction typing (EX-LINT-DRZ-TX-001)
**Fix:** File-scoped override in package `eslint.config.js`

```js
// packages/crud/eslint.config.js
export default [
  // ... base config

  // Drizzle transaction typing workaround
  {
    files: ['src/services/**/*.ts', 'src/mutate.ts', 'src/handlers/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      // KEEP ON - catches real bugs:
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    },
  },
];
```

**Do NOT disable globally** — only for specific files with Drizzle transactions.

### 4. Import Order (`import/order`)

**Official pattern from `eslint-plugin-import`:**

```js
rules: {
  'import/order': ['error', {
    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
    'newlines-between': 'always',
    alphabetize: { order: 'asc', caseInsensitive: true },
  }],
}
```

**Fix:** Run `pnpm --filter <package> run lint:fix` — auto-fixes import order

### 5. Type-check: `noUncheckedIndexedAccess` Errors

**Error:** `Type X | undefined is not assignable to type X`

```ts
// ❌ WRONG - arr[0] could be undefined
const first = arr[0];
processItem(first); // Error: possibly undefined

// ✅ CORRECT - Use .at() or optional chaining
const first = arr.at(0);
if (first) processItem(first);

// OR use nullish coalescing
const first = arr[0] ?? defaultItem;
processItem(first);
```

**Source:** [noUncheckedIndexedAccess](https://www.typescriptlang.org/tsconfig#noUncheckedIndexedAccess)

### 6. Type-check: `exactOptionalPropertyTypes` Errors

**Error:** `Type 'X | undefined' is not assignable to type 'X'` with optional properties

```ts
// ❌ WRONG - Cannot assign undefined to optional property
const result = {
  data: items,
  meta: hasMore ? { nextCursor } : undefined, // Error!
};

// ✅ CORRECT - Use conditional spread
const result = {
  data: items,
  ...(hasMore ? { meta: { nextCursor } } : {}),
};

// ✅ OR make it explicitly nullable (not just optional)
interface Result {
  data: Item[];
  meta?: { nextCursor: string } | null; // Allow null
}

const result: Result = {
  data: items,
  meta: hasMore ? { nextCursor } : null, // OK
};
```

**Real examples:** `apps/web/src/lib/api/entity-route-handlers.ts`, `packages/crud/src/read.ts`

**Source:** [exactOptionalPropertyTypes](https://www.typescriptlang.org/tsconfig#exactOptionalPropertyTypes)

### 7. `no-restricted-imports` (Web App Boundary)

**Context:** Kernel packages (`@afenda/database`, `drizzle-orm`) only in server boundary modules

```ts
// ❌ WRONG - importing kernel in React component
import { db } from '@afenda/database'; // Error!

// ✅ CORRECT - use server action boundary
import { listEntities } from '@/actions/entities';
const entities = await listEntities();
```

**Allowed boundary files:** `apps/web/eslint.config.js` has explicit allow-list

### 8. `tsc -b` Errors (TS2307, TS6305)

**Symptoms:** `tsc --noEmit` passes but `tsc -b` fails

**Common causes:**
1. Root tsconfig includes apps/tools (should only include packages)
2. Stale `.d.ts` files from previous builds
3. Wrong `references` paths in tsconfig

```bash
# Clean rebuild to fix stale declarations
pnpm type-check:refs:clean

# Verify root tsconfig structure
cat tsconfig.json
# Should have: include: ["packages/**/*.ts"]
# Should NOT have: 'apps' or 'tools' in references
```

**Source:** [Project References - Build Mode](https://www.typescriptlang.org/docs/handbook/project-references.html#build-mode-for-typescript)

---

## TypeScript-ESLint Type-Aware Rules

**Official integration for rules that use TypeScript's type checker:**

```js
// eslint.config.js
import tseslint from 'typescript-eslint';

export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,  // Auto-detect tsconfig (v8+)
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      // Type-aware rules (require type information)
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-misused-promises': ['error', {
        checksVoidReturn: false, // For Next.js actions
      }],
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    },
  },
];
```

**Performance note:** Type-aware rules are slower. Use `projectService: true` for automatic tsconfig detection (faster than manual `project` option).

**Source:** [TypeScript-ESLint Getting Started](https://typescript-eslint.io/getting-started/)

### Recommended TypeScript-ESLint Configs

```js
import tseslint from 'typescript-eslint';

export default tseslint.config(
  ...tseslint.configs.recommended,       // Basic rules
  ...tseslint.configs.strict,            // Stricter rules
  ...tseslint.configs.stylistic,         // Code style

  // Custom overrides after
  {
    rules: {
      // Your project-specific rules
    },
  },
);
```

**Source:** [TypeScript-ESLint Configs](https://typescript-eslint.io/users/configs)

---

## Package-Specific ESLint Patterns

### afenda-crud (Kernel Package)

```js
// packages/crud/eslint.config.js
export default [
  // Omit INVARIANT-01 - crud IS the mutate() kernel
  {
    files: ['src/**/*.ts'],
    rules: {
      'afenda/no-direct-db-mutation': 'off',
    },
  },

  // Drizzle transaction workaround (EX-LINT-DRZ-TX-001)
  {
    files: ['src/services/**/*.ts', 'src/mutate.ts', 'src/core.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
    },
  },
];
```

### apps/web (Next.js App with Boundary Pattern)

```js
// apps/web/eslint.config.js
import nextPlugin from '@next/eslint-plugin-next';

export default [
  // Restrict kernel imports to boundary modules
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          {
            group: ['@afenda/database', 'drizzle-orm'],
            message: 'Import kernel via entity-route-handlers or entity-actions',
          },
        ],
      }],
    },
  },

  // Allow kernel in server boundaries
  {
    files: [
      'app/api/**/route.ts',
      'src/lib/api/entity-route-handlers.ts',
      'src/actions/**/*.ts',
    ],
    rules: {
      'no-restricted-imports': 'off',
    },
  },

  // Next.js specific rules
  {
    plugins: { '@next': nextPlugin },
    rules: {
      '@next/next/no-html-link-for-pages': 'error',
    },
  },
];
```

---

## Workflow: Debug Lint/Type Failures

### Step 1: Categorize the Error

```bash
# Run to see exact errors
pnpm lint              # ESLint errors
pnpm type-check        # TypeScript errors (fast)
pnpm type-check:refs   # Project references validation
```

### Step 2: Identify Package and File

```bash
# Error message shows:
# /packages/crud/src/services/user.ts
#   22:5  error  @typescript-eslint/no-unsafe-argument

# Package: crud
# File: src/services/user.ts
# Line: 22
# Rule: @typescript-eslint/no-unsafe-argument
```

### Step 3: Check Config Application

```bash
# See which config applies to the file
pnpm eslint --print-config packages/crud/src/services/user.ts

# Enable debug logging
DEBUG=eslint:* pnpm --filter afenda-crud run lint
```

### Step 4: Apply Fix

**For known patterns:** See "Common Error Patterns" section above

**For new issues:**

1. Check if it's a known TypeScript-ESLint limitation (Drizzle transactions, exact optional properties)
2. Look for similar patterns in codebase (`grep -r "similar error"`)
3. Check [TypeScript-ESLint docs](https://typescript-eslint.io/rules/) for rule details
4. Add file-scoped override if architectural (not global disable)

### Step 5: Validate Fix

```bash
# Always run both before commit
pnpm lint && pnpm type-check

# For CI checks
pnpm type-check:refs
```

---

## Troubleshooting

### ESLint Rules Not Applying

**Debug commands:**

```bash
# Show which config applies to a file
pnpm eslint --print-config src/file.ts

# Enable debug logging
DEBUG=eslint:* pnpm lint

# Check for config syntax errors
pnpm eslint --validate-config eslint.config.js
```

**Common fixes:**

1. **Config ordering** - `...baseConfig` must come before overrides
2. **Files patterns** - Ensure `files: ['**/*.ts']` matches your extensions
3. **Ignores overlap** - Check if `ignores` patterns exclude your files
4. **Parser not set** - Flat config requires explicit `languageOptions.parser` for TypeScript

**Source:** [ESLint Configuration Troubleshooting](https://eslint.org/docs/latest/use/configure/configuration-files#troubleshooting)

### Type-check Passes but type-check:refs Fails

**Symptoms:** `tsc --noEmit` succeeds but `tsc -b` shows TS6305 errors

**Causes:**

1. **Stale .d.ts files** from previous builds
2. **Root tsconfig includes apps/tools** (should only include packages)
3. **Missing or wrong references** in tsconfig.json

**Solutions:**

```bash
# 1. Clean rebuild
pnpm type-check:refs:clean

# 2. Check root tsconfig structure
cat tsconfig.json
# Must have:
#   "include": ["packages/**/*.ts"]
#   "exclude": ["apps", "tools", "**/__tests__/**"]
#   "references": [{"path": "./packages/..."}]  # Only packages!

# 3. Verify package tsconfig has correct references
cat packages/crud/tsconfig.json
# Must list dependencies in "references"
```

**Source:** [Project References - What is a Project Reference?](https://www.typescriptlang.org/docs/handbook/project-references.html#what-is-a-project-reference)

### Type Errors Only in CI

**Causes:**

- Different TypeScript versions
- Missing build artifacts
- Lockfile drift

**Solutions:**

```bash
# Check TypeScript version
pnpm list typescript

# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Rebuild all packages
pnpm build
pnpm type-check:refs
```

### Lint Passes but Husky/Git Hook Fails

**Cause:** Husky may run different ESLint version or config

**Solutions:**

```bash
# Check what Husky runs
cat .husky/pre-commit

# Ensure Husky uses same commands
# Should be: pnpm lint-staged or pnpm lint

# Re-run locally
pnpm lint-staged
```

---

## Advanced Patterns

### Null Safety with Invariant Helper

Reduce TS18048 "possibly undefined" errors:

```ts
// utils/invariant.ts
export function invariant<T>(v: T | null | undefined, msg: string): T {
  if (v == null) throw new Error(msg);
  return v;
}

// Usage - narrows type automatically
const user = invariant(
  users.find(u => u.id === id),
  'User not found',
);
console.log(user.name); // ✅ OK: user is narrowed to defined type
```

### Conditional Spread for Complex Objects

```ts
// Multiple optional properties
const config = {
  required: value,
  ...(hasTimeout ? { timeout } : {}),
  ...(hasRetry ? { retry } : {}),
  ...(hasCache ? { cache } : {}),
};

// Nested optional objects
const result = {
  data: items,
  ...(meta ? {
    meta: {
      total: meta.total,
      ...(meta.cursor ? { cursor: meta.cursor } : {}),
    },
  } : {}),
};
```

### Type-Safe Error Handling

```ts
// Instead of non-null assertions
if (!result.ok) {
  const error = result.error; // Type guard narrows
  return {
    ok: false as const,
    code: error.code,
    message: error.message,
  };
}

// result.data is now guaranteed to exist
return { ok: true as const, data: result.data };
```

### Custom ESLint Rules (AFENDA Project)

```js
// Common pattern for project invariants
export default [
  {
    files: ['**/*.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'CallExpression[callee.object.name="console"]',
          message: 'Use afenda-logger instead of console.* (INVARIANT-08)',
        },
        {
          selector: 'CallExpression[callee.object.name="db"][callee.property.name=/^(insert|update|delete)$/]',
          message: 'Direct db.insert/update/delete forbidden - use mutate() (INVARIANT-01)',
        },
      ],
    },
  },
];
```

---

## Official Resources

### ESLint
- [Configuration Files](https://eslint.org/docs/latest/use/configure/configuration-files)
- [Migration to Flat Config](https://eslint.org/docs/latest/use/configure/migration-guide)
- [Rules Reference](https://eslint.org/docs/latest/rules/)
- [Plugin Development](https://eslint.org/docs/latest/extend/plugins)

### TypeScript-ESLint
- [Getting Started](https://typescript-eslint.io/getting-started/)
- [Configs Overview](https://typescript-eslint.io/users/configs)
- [Rules Reference](https://typescript-eslint.io/rules/)
- [Type-Aware Linting](https://typescript-eslint.io/getting-started/typed-linting/)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [TSConfig Reference](https://www.typescriptlang.org/tsconfig)
- [Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)
- [Compiler Options](https://www.typescriptlang.org/docs/handbook/compiler-options.html)

### Project-Specific
- [reference.md](reference.md) - Error patterns and code snippets
- [COMPLIANCE-REPORT.md](COMPLIANCE-REPORT.md) - Compliance audit
- [IMPROVEMENTS-COMPLETED.md](IMPROVEMENTS-COMPLETED.md) - Change log

---

## Migration Checklist

When adding new packages or updating ESLint config:

- [ ] Use flat config format (array of config objects)
- [ ] Import plugins as modules, not strings
- [ ] Put global `ignores` first
- [ ] Put base config before overrides
- [ ] Use `languageOptions.parser` for TypeScript (object, not string)
- [ ] Enable `projectService: true` for type-aware rules
- [ ] Add `composite: true` to tsconfig for project references
- [ ] Exclude test files from root tsconfig
- [ ] Test with both `pnpm lint` and `pnpm type-check:refs`

**Source:** [ESLint Migration Guide](https://eslint.org/docs/latest/use/configure/migration-guide)

````
