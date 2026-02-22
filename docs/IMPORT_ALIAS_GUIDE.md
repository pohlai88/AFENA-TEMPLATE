# Import Alias Guide

## Overview

This guide defines the correct import patterns for the AFENDA-NEXUS monorepo based on TypeScript best practices and the Advanced Types skill patterns.

## 📋 Import Rules

### Rule 1: Cross-Package Imports → Use Package Names

**When to use:** Importing from a different package in the monorepo

**Pattern:** `import { X } from 'afenda-<package>'`

```typescript
// ✅ CORRECT - Cross-package imports
import { createLogger } from 'afenda-logger';
import { db, sql } from 'afenda-database';
import type { DocStatus } from 'afenda-canon';
import { mutate } from 'afenda-crud';
```

```typescript
// ❌ WRONG - Don't use relative paths across packages
import { createLogger } from '../../logger/src/index';
import { db } from '../../../packages/database/src';
```

**Why?**

- Type-safe with proper package.json exports configuration
- Works correctly with TypeScript project references
- Easier to refactor and move files
- Clear dependency graph

---

### Rule 2: Internal Package Imports → Use Relative Paths

**When to use:** Importing files within the same package

**Pattern:** `import { X } from './module'` or `import { X } from '../utils'`

```typescript
// ✅ CORRECT - Internal imports within a package
import { mutate } from './mutate';
import { buildSystemContext } from './context';
import type { WorkflowNodeType } from '../types';
import { evaluateDsl } from '../dsl-evaluator';
```

```typescript
// ❌ WRONG - Don't use package name for internal imports
import { mutate } from 'afenda-crud/mutate';
import type { WorkflowNodeType } from 'afenda-workflow/types';
```

**Why?**

- Prevents circular dependency issues
- Faster module resolution
- Works correctly with bundlers
- Clear file locality

---

### Rule 3: App-Level Imports → Use `@` Alias

**When to use:** Importing within Next.js apps or tools (app/, components/, lib/, etc.)

**Pattern:** `import { X } from '@/path/to/module'`

```typescript
// ✅ CORRECT - App-level imports in Next.js
import { auth } from '@/lib/auth/server';
import { Button } from '@/components/ui/button';
import { getUser } from '@/app/actions/user';

// Also valid for specific subpaths
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
```

```typescript
// ❌ WRONG - Don't use @ for cross-package imports
import { createLogger } from '@/logger';
import { db } from '@/database';
```

**Why?**

- Next.js convention and best practice
- Cleaner imports for app-specific code
- Easier to move components around
- IntelliSense support

---

### Rule 4: UI Package Shared Imports → Use `@afenda/ui` or Relative

**When to use:** Importing UI components from the shared packages/ui

**From Apps:**

```typescript
// ✅ CORRECT - Import from published package
import { Button } from '@afenda/ui';
import { Card, CardContent } from '@afenda/ui';
import { cn } from '@afenda/ui/lib/utils';
```

**Within packages/ui:**

```typescript
// ✅ CORRECT - Use relative paths internally
import { cn } from './lib/utils';
import type { ButtonProps } from '../types';
```

---

## 🏗️ Configuration Structure

### Root tsconfig.json

```jsonc
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      // Package aliases (for apps to import packages)
      "@afenda/*": ["./packages/*/src"],

      // App-level aliases (Next.js specific)
      "@/*": ["./apps/web/*"],
      "@/ui/*": ["./packages/ui/src/*"],
      "@/lib/*": ["./apps/web/src/lib/*"],
      "@/components/*": ["./apps/web/components/*"],
      "@/app/*": ["./apps/web/app/*"],
    },
  },
}
```

### Package tsconfig.json

```jsonc
{
  "extends": "afenda-typescript-config/base.json",
  "compilerOptions": {
    "composite": true,
    // NO paths configuration - use relative imports internally
    // NO @ aliases - not needed for package code
  },
}
```

### App tsconfig.json (Next.js)

```jsonc
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/ui/*": ["../../packages/ui/src/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/components/*": ["./components/*"],
    },
  },
}
```

---

## 📝 Examples by Location

### In `packages/workflow/src/engine.ts`

```typescript
// ✅ CORRECT
import { extractVerb } from 'afenda-canon'; // Cross-package
import { db, workflowExecutions } from 'afenda-database'; // Cross-package
import type { MutationSpec } from 'afenda-canon'; // Cross-package
import { executeNode } from './executor'; // Internal
import type { WorkflowContext } from './types'; // Internal
```

### In `packages/crud/src/mutate.ts`

```typescript
// ✅ CORRECT
import { db, sql } from 'afenda-database'; // Cross-package
import { createLogger } from 'afenda-logger'; // Cross-package
import { buildSystemContext } from './context'; // Internal
import { validateMutation } from './validators'; // Internal
import type { MutationContext } from './context'; // Internal
```

### In `apps/web/app/dashboard/page.tsx`

```typescript
// ✅ CORRECT
import { Button } from '@afenda/ui'; // Shared UI package
import { getUser } from '@/app/actions/user'; // App action
import { auth } from '@/lib/auth/server'; // App lib
import DashboardLayout from '@/components/layouts/dashboard'; // App component
```

### In `apps/web/components/custom-table.tsx`

```typescript
// ✅ CORRECT
import { Table } from '@afenda/ui'; // Shared UI
import { cn } from '@afenda/ui/lib/utils'; // Shared util
import { useTableState } from '@/hooks/use-table'; // App hook
import type { TableConfig } from '@/lib/types'; // App type
```

---

## 🚫 Common Mistakes

### ❌ Using @ for cross-package imports

```typescript
// WRONG
import { db } from '@/database';
import { logger } from '@/logger';

// CORRECT
import { db } from 'afenda-database';
import { createLogger } from 'afenda-logger';
```

### ❌ Using package name for internal imports

```typescript
// WRONG (in packages/crud/src/mutate.ts)
import { buildContext } from 'afenda-crud/context';

// CORRECT
import { buildContext } from './context';
```

### ❌ Using relative paths across packages

```typescript
// WRONG
import { db } from '../../../database/src/index';

// CORRECT
import { db } from 'afenda-database';
```

### ❌ Mixing patterns inconsistently

```typescript
// WRONG - Inconsistent
import { Button } from '@afenda/ui';
import { Card } from '../../packages/ui/src/components/card';

// CORRECT - Consistent
import { Button, Card } from '@afenda/ui';
```

---

## 🎯 Quick Reference

| Import Type            | Pattern        | Example                                |
| ---------------------- | -------------- | -------------------------------------- |
| **Cross-Package**      | `afenda-<pkg>` | `import { db } from 'afenda-database'` |
| **Internal (Package)** | `./` or `../`  | `import { utils } from './lib/utils'`  |
| **App Files**          | `@/`           | `import { auth } from '@/lib/auth'`    |
| **Shared UI**          | `@afenda/ui`   | `import { Button } from '@afenda/ui'`  |
| **Node Modules**       | package name   | `import { z } from 'zod'`              |

---

## 🔍 Type Safety Benefits

Following these patterns ensures:

1. **Type Inference Works** - TypeScript can properly track types across module boundaries
2. **No Circular Dependencies** - Clear import hierarchy prevents cycles
3. **Fast Module Resolution** - Bundlers and TS compiler optimize correctly
4. **Build Performance** - Project references work properly with composite mode
5. **Refactoring Safety** - Move files without breaking imports across packages

---

## 📚 Related Documentation

- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)
- [TypeScript Module Resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html)
- [Next.js Path Aliases](https://nextjs.org/docs/app/building-your-application/configuring/absolute-imports-and-module-aliases)

---

## ✅ Validation

Run these commands to validate your imports:

```bash
# Type check all packages
pnpm type-check

# Build with project references
pnpm build

# Lint for import patterns
pnpm lint
```

---

_Last updated: Using TypeScript Advanced Types skill patterns_
