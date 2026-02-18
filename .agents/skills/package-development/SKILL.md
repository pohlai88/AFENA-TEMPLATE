# package-development

## Description

Creating, structuring, and maintaining packages in the AFENDA-NEXUS monorepo with layer-specific requirements and best practices.

## Trigger Conditions

Use this skill when:

- Creating a new package
- Restructuring an existing package
- Questions about package structure
- Export patterns and public API design
- Package configuration (package.json, tsconfig.json)
- Documentation requirements

---

## Overview

AFENDA-NEXUS uses a **monorepo** with **pnpm workspaces** and **Turborepo**. Packages are organized into 4 architectural layers with strict dependency rules.

**Current Package Count**: 18 packages across 4 layers

---

## Package Creation Checklist

### 1. Determine the Correct Layer

Ask these questions:

- **Layer 0**: Is this purely tooling/configuration?
- **Layer 1**: Is this a core primitive used everywhere?
- **Layer 2**: Is this domain-specific business logic?
- **Layer 3**: Does it orchestrate multiple domains?

See [afenda-architecture skill](../afenda-architecture/SKILL.md) for detailed layer rules.

---

### 2. Create Package Directory

```bash
mkdir -p packages/<package-name>
cd packages/<package-name>
```

**Naming Convention**:

- **Singular nouns**: `inventory`, `accounting`, `workflow`
- **Domain-focused**: Reflects business capability
- **Lowercase with hyphens**: `multi-word-package`
- **No technical suffixes**: `accounting`, not `accounting-service`

---

### 3. Required Files

Every package must have:

1. `package.json` - Package metadata and dependencies
2. `tsconfig.json` - TypeScript configuration
3. `README.md` - Documentation
4. `src/index.ts` - Public API barrel export
5. `eslint.config.cjs` (or `eslint.config.js`) - Linting configuration

**Optional**:

- `vitest.config.ts` - Unit test configuration (Layer 2 & 3)
- `tsup.config.ts` - Build configuration (if package needs bundling)
- `__tests__/` - Test files

---

## File Templates

### `package.json`

#### Layer 0 (Configuration)

```json
{
  "name": "afenda-<package-name>",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./index.js",
  "types": "./index.d.ts",
  "exports": {
    ".": {
      "types": "./index.d.ts",
      "default": "./index.js"
    }
  },
  "files": ["index.js", "*.json"],
  "dependencies": {
    // External only (ESLint, TypeScript, etc.)
  }
}
```

---

#### Layer 1 (Foundation)

```json
{
  "name": "afenda-<package-name>",
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
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx --cache --concurrency=auto",
    "lint:ci": "eslint . --ext .js,.jsx,.ts,.tsx --rule 'import/no-cycle: error'",
    "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --cache --fix",
    "test": "vitest run",
    "test:watch": "vitest watch"
  },
  "dependencies": {
    // External only (Zod, Drizzle, Pino, etc.)
    // NO workspace dependencies
  },
  "devDependencies": {
    "@types/node": "catalog:",
    "afenda-eslint-config": "workspace:^",
    "afenda-typescript-config": "workspace:*",
    "typescript": "catalog:",
    "vitest": "catalog:"
  }
}
```

---

#### Layer 2 (Domain Services)

```json
{
  "name": "afenda-<package-name>",
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
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx --cache --concurrency=auto",
    "lint:ci": "eslint . --ext .js,.jsx,.ts,.tsx --rule 'import/no-cycle: error'",
    "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --cache --fix",
    "test": "vitest run",
    "test:watch": "vitest watch",
    "test:coverage": "vitest run --coverage"
  },
  "dependencies": {
    "afenda-canon": "workspace:*",
    "afenda-database": "workspace:*",
    "afenda-logger": "workspace:*",
    "drizzle-orm": "^0.44.0"
  },
  "devDependencies": {
    "@types/node": "catalog:",
    "@vitest/coverage-v8": "^4.0.18",
    "afenda-eslint-config": "workspace:^",
    "afenda-typescript-config": "workspace:*",
    "typescript": "catalog:",
    "vitest": "catalog:"
  }
}
```

---

#### Layer 3 (Application)

```json
{
  "name": "afenda-<package-name>",
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
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx --cache --concurrency=auto",
    "lint:ci": "eslint . --ext .js,.jsx,.ts,.tsx --rule 'import/no-cycle: error'",
    "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --cache --fix",
    "test": "vitest run",
    "test:watch": "vitest watch",
    "test:coverage": "vitest run --coverage"
  },
  "dependencies": {
    "afenda-canon": "workspace:*",
    "afenda-database": "workspace:*",
    "afenda-logger": "workspace:*",
    "afenda-workflow": "workspace:*",
    "afenda-accounting": "workspace:*",
    "afenda-inventory": "workspace:*",
    "afenda-crm": "workspace:*",
    "drizzle-orm": "^0.44.0"
  },
  "devDependencies": {
    "@types/node": "catalog:",
    "@vitest/coverage-v8": "^4.0.18",
    "afenda-eslint-config": "workspace:^",
    "afenda-typescript-config": "workspace:*",
    "typescript": "catalog:",
    "vitest": "catalog:"
  }
}
```

---

### `tsconfig.json`

```jsonc
{
  "extends": "afenda-typescript-config/base.json",
  "compilerOptions": {
    "rootDir": "./src",
    "noEmit": true,
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"],
}
```

**For packages that bundle** (rare):

```jsonc
{
  "extends": "afenda-typescript-config/base.json",
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",
    "declaration": true,
    "declarationMap": true,
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"],
}
```

---

### `eslint.config.cjs`

```javascript
const base = require('afenda-eslint-config/base.cjs');

module.exports = [...base];
```

---

### `src/index.ts` (Public API)

**Layer 1 (Foundation)**:

```typescript
// Types
export type { EntityType, ActionVerb, CapabilityKey } from './types/entity';

// Schemas
export { entitySchema, actionSchema } from './schemas/entity-schema';

// Utilities
export { parseEntityId, formatDocNo } from './utils/formatters';
```

---

**Layer 2 (Domain Service)**:

```typescript
// Services
export { TaxCalculationService, type TaxCalculationResult } from './services/tax-calculation';

export { FiscalPeriodService, type FiscalPeriodStatus } from './services/fiscal-period';

// Utility functions (exported for convenience)
export { resolveTaxRate, calculateLineTax } from './services/tax-calc';

// Types
export type { TaxLineResult, ResolvedTaxRate } from './services/tax-calc';
```

---

**Layer 3 (Application)**:

```typescript
// CRUD operations
export {
  createEntity,
  updateEntity,
  deleteEntity,
  getEntityById,
  listEntities,
} from './crud/operations';

// Policy enforcement
export {
  enforceCreatePolicy,
  enforceUpdatePolicy,
  enforceDeletePolicy,
} from './policies/enforcement';

// Types
export type { CRUDResult, PolicyContext } from './types';
```

---

### `README.md`

See [packages/PACKAGE_TEMPLATE.md](../../../packages/PACKAGE_TEMPLATE.md) for full template.

**Minimum sections**:

1. **Title** - Package name
2. **Purpose** - What this package does
3. **When to Use** - Use cases
4. **Public API** - Exports and function signatures
5. **Usage Examples** - Code samples
6. **Testing** - How to run tests
7. **See Also** - Related documentation

---

## Directory Structure

### Layer 1 (Foundation) - Example: `canon`

```
packages/canon/
├── package.json
├── tsconfig.json
├── README.md
├── eslint.config.cjs
└── src/
    ├── index.ts          # Public API
    ├── types/            # Type definitions
    │   ├── entity.ts
    │   ├── action.ts
    │   └── policy.ts
    ├── schemas/          # Zod schemas
    │   ├── entity-schema.ts
    │   └── action-schema.ts
    └── utils/            # Utilities
        ├── parsers.ts
        └── validators.ts
```

---

### Layer 2 (Domain Service) - Example: `accounting`

```
packages/accounting/
├── package.json
├── tsconfig.json
├── tsconfig.build.json   # If package is built
├── README.md
├── eslint.config.cjs
├── vitest.config.ts
└── src/
    ├── index.ts          # Public API
    ├── services/         # Business logic
    │   ├── tax-calc.ts
    │   ├── fiscal-period.ts
    │   ├── depreciation-engine.ts
    │   └── revenue-recognition.ts
    ├── policies/         # Policies (Domain-specific rules)
    │   ├── approval-policy.ts
    │   └── validation-policy.ts
    ├── ports/            # Interfaces (no "I" prefix)
    │   ├── tax-calculator.ts
    │   └── period-checker.ts
    └── __tests__/        # Unit tests
        ├── tax-calc.test.ts
        └── fiscal-period.test.ts
```

---

### Layer 3 (Application) - Example: `crud`

```
packages/crud/
├── package.json
├── tsconfig.json
├── README.md
├── eslint.config.cjs
├── vitest.config.ts
└── src/
    ├── index.ts          # Public API
    ├── crud/             # CRUD operations
    │   ├── create.ts
    │   ├── read.ts
    │   ├── update.ts
    │   └── delete.ts
    ├── policies/         # Cross-cutting policies
    │   ├── authorization.ts
    │   ├── audit-logging.ts
    │   └── rate-limiting.ts
    ├── orchestrators/    # Multi-domain orchestration
    │   ├── order-processing.ts
    │   └── invoice-workflow.ts
    └── __tests__/
        ├── crud.test.ts
        └── policies.test.ts
```

---

## Export Patterns

### Barrel Exports (`src/index.ts`)

**✅ Good: Explicit exports**

```typescript
// Export specific items
export { functionA, functionB } from './module';
export type { TypeA, TypeB } from './types';
export { ClassA } from './services/class-a';

// Namespace export for utilities
export * as utils from './utils';
```

**❌ Bad: Wildcard exports**

```typescript
// Exposes internals
export * from './module';
export * from './internal-helpers';
```

---

### Type-Only Exports

Always use `type` keyword for type exports:

```typescript
// ✅ Good
export type { User, Company } from './types';

// ❌ Bad (runtime export)
export { User, Company } from './types';
```

---

### Re-exports

When re-exporting from dependencies:

```typescript
// ✅ Good - explicit re-export
export type { EntityType } from 'afenda-canon';

// ❌ Bad - creates dependency coupling
import type { EntityType } from 'afenda-canon';
export type MyEntityType = EntityType;
```

---

## Testing Setup

### `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/', '**/*.test.ts', '**/*.config.ts'],
      thresholds: {
        statements: 70,
        branches: 70,
        functions: 70,
        lines: 70,
      },
    },
  },
});
```

---

### Test File Structure

```typescript
import { describe, it, expect } from 'vitest';
import { functionUnderTest } from '../src/services/module';

describe('functionUnderTest', () => {
  it('should handle valid input', () => {
    const result = functionUnderTest('valid-input');
    expect(result).toBe('expected-output');
  });

  it('should throw on invalid input', () => {
    expect(() => functionUnderTest('')).toThrow('validation error');
  });
});
```

---

## Build Configuration

### When to Build a Package

**Build if**:

- Package is published externally
- Package needs browser bundle
- Package needs ESM + CJS dual exports

**Don't build if**:

- Package is internal and consumed via TypeScript source
- Faster development iteration is needed

---

### `tsup.config.ts` (if building)

```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
});
```

---

## Documentation Requirements

### README.md Checklist

- [ ] **Title**: Clear package name
- [ ] **Purpose**: 2-3 paragraphs explaining role
- [ ] **When to Use**: Bullet list of use cases
- [ ] **Key Concepts**: Important domain concepts
- [ ] **Dependencies**: Why each dependency is needed
- [ ] **Public API**: Complete list of exports
- [ ] **Usage Examples**: At least 2-3 code samples
- [ ] **Testing**: How to run tests
- [ ] **See Also**: Links to related docs

---

### JSDoc Comments

**For Public API Functions**:

````typescript
/**
 * Calculate tax amount for a line item.
 *
 * @param lineAmount - Pretax line amount
 * @param taxRate - Tax rate (e.g., 0.06 for 6%)
 * @returns Tax amount rounded to 2 decimal places
 *
 * @example
 * ```typescript
 * const tax = calculateLineTax(1000, 0.06);
 * // => 60.00
 * ```
 */
export function calculateLineTax(lineAmount: number, taxRate: number): number {
  return Math.round(lineAmount * taxRate * 100) / 100;
}
````

---

## Common Patterns

### Service Pattern (Layer 2)

```typescript
import type { NeonDatabase } from '@neondatabase/serverless';
import type { TaxRate } from 'afenda-canon';

export interface TaxCalculationResult {
  taxAmount: number;
  effectiveRate: number;
}

/**
 * Calculate tax for a transaction line.
 */
export async function calculateLineTax(
  db: NeonDatabase,
  orgId: string,
  lineAmount: number,
  taxRateId: string,
): Promise<TaxCalculationResult> {
  // 1. Fetch tax rate
  const taxRate = await db.query.taxRates.findFirst({
    where: (rates, { eq, and }) => and(eq(rates.orgId, orgId), eq(rates.id, taxRateId)),
  });

  if (!taxRate) {
    throw new Error(`Tax rate not found: ${taxRateId}`);
  }

  // 2. Calculate tax
  const taxAmount = Math.round(lineAmount * taxRate.rate * 100) / 100;

  return {
    taxAmount,
    effectiveRate: taxRate.rate,
  };
}
```

---

### Policy Pattern (Layer 2)

```typescript
import type { NeonDatabase } from '@neondatabase/serverless';
import type { FiscalPeriod } from 'afenda-canon';

export interface FiscalPeriodChecker {
  isPeriodOpen(orgId: string, date: Date): Promise<boolean>;
  assertPeriodOpen(orgId: string, date: Date): Promise<void>;
}

export class FiscalPeriodPolicy implements FiscalPeriodChecker {
  constructor(private db: NeonDatabase) {}

  async isPeriodOpen(orgId: string, date: Date): Promise<boolean> {
    const period = await this.findPeriod(orgId, date);
    return period?.status === 'open';
  }

  async assertPeriodOpen(orgId: string, date: Date): Promise<void> {
    const isOpen = await this.isPeriodOpen(orgId, date);
    if (!isOpen) {
      throw new Error(`Fiscal period closed for date: ${date.toISOString()}`);
    }
  }

  private async findPeriod(orgId: string, date: Date): Promise<FiscalPeriod | undefined> {
    // Implementation
    return undefined;
  }
}
```

---

## Validation Workflow

### 1. Dependency Validation

```bash
pnpm validate:deps
```

Checks:

- Layer isolation rules
- Circular dependencies
- Forbidden cross-layer references

---

### 2. Type Checking

```bash
pnpm type-check:refs
```

Validates TypeScript project references.

---

### 3. Linting

```bash
cd packages/<package-name>
pnpm lint
```

---

### 4. Testing

```bash
cd packages/<package-name>
pnpm test
pnpm test:coverage
```

---

### 5. README Generation

```bash
pnpm afenda readme gen --package <package-name>
pnpm afenda readme check
```

---

## Common Anti-Patterns

### ❌ Anti-Pattern 1: Implicit Dependencies

```typescript
// ❌ BAD - direct file system access to sibling package
import { Something } from '../../database/src/internal';
```

**Solution**:

```typescript
// ✅ GOOD - explicit dependency via package.json
import { Something } from 'afenda-database';
```

---

### ❌ Anti-Pattern 2: Barrel Export Everything

```typescript
// ❌ BAD - exposes internals
export * from './internal-helpers';
export * from './private-utils';
```

**Solution**:

```typescript
// ✅ GOOD - explicit public API
export { publicFunction } from './internal-helpers';
export type { PublicType } from './private-utils';
```

---

### ❌ Anti-Pattern 3: Missing Layer Prefix in Imports

```typescript
// ❌ BAD - importing from higher layer
import { crudOperation } from 'afenda-crud';
```

**Solution**: Don't import from higher layers. Review architecture.

---

## Checklist: New Package Creation

- [ ] Create directory: `packages/<package-name>`
- [ ] Add `package.json` with correct layer dependencies
- [ ] Add `tsconfig.json` extending `afenda-typescript-config/base.json`
- [ ] Add `eslint.config.cjs` using `afenda-eslint-config`
- [ ] Create `src/index.ts` with explicit exports
- [ ] Add `README.md` using package template
- [ ] Add to root `pnpm-workspace.yaml` (if not using wildcard)
- [ ] Run `pnpm install` at root
- [ ] Run `pnpm validate:deps`
- [ ] Run `pnpm type-check:refs`
- [ ] Implement package functionality
- [ ] Write tests (Layer 2 & 3)
- [ ] Generate README: `pnpm afenda readme gen`
- [ ] Verify CI passes: `pnpm lint`, `pnpm test`, `pnpm build`

---

## References

- [packages/PACKAGE_TEMPLATE.md](../../../packages/PACKAGE_TEMPLATE.md) - README template
- [packages/GOVERNANCE.md](../../../packages/GOVERNANCE.md) - Dependency rules
- [ARCHITECTURE.md](../../../ARCHITECTURE.md) - Layer architecture
- [docs/CODING_STANDARDS.md](../../../docs/CODING_STANDARDS.md) - Code conventions
- [afenda-architecture skill](../afenda-architecture/SKILL.md) - Architecture patterns
- [afenda-database-patterns skill](../afenda-database-patterns/SKILL.md) - Database patterns

---

## Quick Reference

### Package Naming

- **Singular**: `inventory`, not `inventories`
- **Domain-focused**: `accounting`, not `accounting-service`
- **Lowercase**: `multi-word-package`

### Export Patterns

```typescript
// Types
export type { Type1, Type2 } from './types';

// Functions
export { func1, func2 } from './module';

// Classes
export { ServiceClass } from './services/service';

// Namespace
export * as utils from './utils';
```

### Required Scripts (package.json)

```json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx --cache",
    "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --cache --fix",
    "test": "vitest run",
    "test:watch": "vitest watch"
  }
}
```
