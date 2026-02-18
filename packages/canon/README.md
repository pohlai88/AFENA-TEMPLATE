# afenda-canon

**Version:** 1.0.0 • **Status:** Production-Ready ✅  
**Layer 1: Foundation** • **Role:** Type System & Metadata Catalog

Single source of truth for ALL types, enums, Zod schemas, and metadata definitions across AFENDA-NEXUS.

---

## 🎉 v1.0 Production Status

**Shipped:** February 18, 2026  
**Tests:** 181/181 passing (100%)  
**TypeScript:** 0 errors  
**Coverage:** 44% overall (75-100% on core modules)  
**Dependencies:** `zod` only (zero workspace deps)

---

## 📐 Architecture Role

**Layer 1** in the 4-layer architecture:

```
Layer 3: Application (crud, observability)
Layer 2: Domain Services (workflow, advisory, 116 business-domain packages)
Layer 1: Foundation (canon ← YOU ARE HERE, database, logger, ui)
Layer 0: Configuration (eslint-config, typescript-config)
```

**Purpose:**
- Exports types, enums, and Zod schemas
- Provides metadata catalog (LiteMetadata)
- Enforces ubiquitous language across all packages
- Prevents type duplication

**Zero Business Logic:** This package contains ONLY type definitions and pure functions.

---

## ✅ What This Package Does

### 1. Exports TypeScript Types

```typescript
export interface Invoice { id: string; totalMinor: number; /* ... */ }
export interface Payment { id: string; invoiceId: string; /* ... */ }
export interface Customer { id: string; name: string; /* ... */ }
// 211+ entity types
```

### 2. Exports Enums

```typescript
export enum PaymentStatus { PENDING = 'pending', COMPLETED = 'completed' }
export enum DocStatus { DRAFT = 'draft', FINAL = 'final' }
// 50+ enums
```

### 3. Exports Zod Schemas

```typescript
export const invoiceSchema = z.object({ id: z.string(), totalMinor: z.number() });
export const paymentSchema = z.object({ id: z.string(), invoiceId: z.string() });
// 211+ validation schemas
```

### 4. LiteMetadata Catalog (NEW in v1.0)

```typescript
// Asset key system
import { buildAssetKey, parseAssetKey, validateAssetKey } from 'afenda-canon';

// Type mappings
import { POSTGRES_TO_CANON, mapPostgresType, TYPE_COMPAT_MATRIX } from 'afenda-canon';

// Classification
import { classifyColumn, PII_PATTERNS } from 'afenda-canon';

// Lineage & Quality
import { inferEdgeType, topoSortLineage, compileQualityRule } from 'afenda-canon';
```

---

## ❌ What This Package NEVER Does

| ❌ Never Do This | ✅ Do This Instead |
|-----------------|-------------------|
| Import from business-domain packages | Export types for domains to import |
| Import from crud | Export types for crud to import |
| Implement business logic | Keep pure type definitions |
| Implement database queries | Export types for database package to use |
| Depend on workspace packages | Only depend on external npm (Zod) |

---

## 📦 What This Package Exports

### Core Types

- **Entity Types:** `Invoice`, `Payment`, `Customer`, `TaxRate`, etc. (211+ types)
- **Base Types:** `BaseEntity`, `EntityRef`, `ActorRef`
- **Action Types:** `ActionType`, `ActionVerb`, `ActionFamily`
- **Mutation Types:** `MutationSpec`, `Receipt`, `ReceiptStatus`
- **API Types:** `ApiResponse`, `ErrorCode`, `KernelError`
- **Audit Types:** `AuditLogEntry`

### Enums

- `PaymentStatus`, `DocStatus`, `InvoiceStatus`, `OrderStatus` (50+ enums)

### Zod Schemas

- Every type has a matching Zod schema: `invoiceSchema`, `paymentSchema`, etc.

### Helpers

- `extractVerb(actionType)` — Extract verb from `entity.verb`
- `extractEntityNamespace(actionType)` — Extract entity name
- `getActionFamily(actionType)` — Map action to CRUD/SAP family

---

## 📖 Usage Examples

### Import Types

```typescript
import type { Invoice, Payment, Customer } from 'afenda-canon';

function processInvoice(invoice: Invoice): void {
  // business logic uses canon types
}
```

### Import Enums

```typescript
import { PaymentStatus, DocStatus } from 'afenda-canon';

const status = PaymentStatus.COMPLETED;
```

### Import Schemas (Runtime Validation)

```typescript
import { invoiceSchema, type Invoice } from 'afenda-canon';

const validated: Invoice = invoiceSchema.parse(input);
```

---

## 🔗 Dependencies

### Workspace Dependencies

**NONE** — This package has ZERO workspace dependencies.

### External Dependencies

- `zod` (validation schemas)

### Who Depends on This Package (v1.0 Verified)

- ✅ `afenda-database` (Layer 1) — imports types for schema definitions
- ✅ `afenda-logger` (Layer 1) — imports types for log context
- ✅ `afenda-workflow` (Layer 2) — imports types + LiteMetadata (verified)
- ✅ `afenda-advisory` (Layer 2) — imports types for analytics
- ✅ `afenda-crud` (Layer 3) — imports types + LiteMetadata for API handlers
- ✅ `apps/web` (Layer 3) — imports types for Next.js application
- ✅ All 116 business-domain packages (Layer 2) — import types for business logic

---

## 🚦 Dependency Rules

```
✅ ALLOWED:
  - External npm packages (zod)
  - Node.js built-ins

❌ FORBIDDEN:
  - afenda-database (Layer 1, same layer)
  - afenda-workflow (Layer 2, upper layer)
  - business-domain/* (Layer 2, upper layer)
  - afenda-crud (Layer 3, upper layer)
```

**Rule:** Layer 1 packages can ONLY depend on Layer 0 + external npm.

---

## 🛠️ Development Workflow

### Adding a New Type

1. **Define the TypeScript type:**

```typescript
// src/types/accounting.ts
export interface TaxRate {
  taxCode: string;
  rate: number;
  effectiveFrom: Date;
}
```

2. **Create a Zod schema:**

```typescript
// src/schemas/accounting.ts
import { z } from 'zod';

export const taxRateSchema = z.object({
  taxCode: z.string(),
  rate: z.number(),
  effectiveFrom: z.date(),
});
```

3. **Export from index:**

```typescript
// src/index.ts
export type { TaxRate } from './types/accounting';
export { taxRateSchema } from './schemas/accounting';
```

4. **Use in other packages:**

```typescript
// business-domain/accounting/src/index.ts
import type { TaxRate } from 'afenda-canon';
import { taxRateSchema } from 'afenda-canon';
```

---

## 📜 Scripts

```bash
pnpm build       # Build package
pnpm dev         # Watch mode
pnpm type-check  # TypeScript check
pnpm lint        # ESLint
pnpm lint:fix    # ESLint with auto-fix
```

---

## ⚠️ PREVENT DRIFT - Critical Architecture Rules

### 🔒 Rule 1: NEVER Import from Upper Layers

**❌ WRONG:**

```typescript
// src/index.ts
import { calculateTax } from 'afenda-accounting'; // FORBIDDEN!
```

**Why:** Canon is Layer 1, accounting is Layer 2. Dependencies flow bottom-up only.

**✅ CORRECT:**

```typescript
// src/types/accounting.ts
export interface TaxRate { taxCode: string; rate: number; }
```

---

### 🔒 Rule 2: NEVER Implement Business Logic

**❌ WRONG:**

```typescript
// src/types/invoice.ts
export interface Invoice { id: string; totalMinor: number; }

// ❌ NO LOGIC!
export function calculateTotal(invoice: Invoice): number {
  return invoice.totalMinor;
}
```

**Why:** Canon contains ONLY types. Logic belongs in business-domain packages.

**✅ CORRECT:**

```typescript
// afenda-canon: src/types/invoice.ts
export interface Invoice { id: string; totalMinor: number; }

// afenda-accounting: src/services/invoice-calculation.ts
import type { Invoice } from 'afenda-canon';
export function calculateTotal(invoice: Invoice): number {
  return invoice.totalMinor;
}
```

---

### 🔒 Rule 3: NEVER Import from Same-Layer Packages

**❌ WRONG:**

```typescript
// src/index.ts
import { db } from 'afenda-database'; // FORBIDDEN! Same layer!
```

**Why:** Layer 1 packages cannot depend on each other. Only Layer 0 + external npm.

**✅ CORRECT:**

```typescript
// afenda-canon exports types
// afenda-database imports canon types
// They don't cross-import
```

---

### 🔒 Rule 4: NEVER Export Functions (Except Pure Helpers)

**❌ WRONG:**

```typescript
export async function fetchInvoice(db, id) { /* ... */ } // FORBIDDEN!
```

**Why:** Canon is types-only. Functions belong in business-domain packages.

**✅ ALLOWED (Pure Helpers Only):**

```typescript
// OK: Pure string manipulation, no dependencies
export function extractVerb(actionType: string): string {
  return actionType.split('.')[1] ?? '';
}
```

---

### 🔒 Rule 5: ALL Types Must Be Here

**❌ WRONG:**

```typescript
// business-domain/accounting/src/types.ts
export interface TaxRate { taxCode: string; rate: number; } // WRONG LOCATION!
```

**Why:** Types belong in canon to prevent duplication and ensure consistency.

**✅ CORRECT:**

```typescript
// afenda-canon: src/types/accounting.ts
export interface TaxRate { taxCode: string; rate: number; }

// business-domain/accounting: src/index.ts
import type { TaxRate } from 'afenda-canon'; // Import from canon
```

---

### 🚨 Validation Commands

Run these to prevent drift:

```bash
# Check for circular dependencies
pnpm run validate:deps

# Check for layer violations
pnpm lint:ci

# Type-check
pnpm type-check

# Verify zero workspace dependencies
cat package.json | grep -A 5 dependencies
# Should only show: "zod"
```

---

## 🔍 Quick Reference

| Question | Answer |
|----------|--------|
| **What layer?** | Layer 1 (Foundation) |
| **What does it export?** | Types, enums, Zod schemas |
| **What does it import?** | Nothing from workspace (only Zod) |
| **Who imports it?** | All packages (database, workflow, domains, crud) |
| **Can it import from domains?** | ❌ NO |
| **Can it import from crud?** | ❌ NO |
| **Can it import from database?** | ❌ NO (same layer) |
| **Can it have business logic?** | ❌ NO (types only) |
| **Can it have database queries?** | ❌ NO (types only) |

---

## 📚 Documentation

**In this package:**
- `README.md` (this file) - Quick start and usage guide
- `canon.architecture.md` - Complete architecture specification (2113 lines)
- `CANON-V1-COMPLETE.md` - Production readiness certification
- `IMPLEMENTATION-STATUS.md` - Test coverage and status summary

**Related:**
- [ARCHITECTURE.md](../../ARCHITECTURE.md) - Complete 4-layer architecture
- [business-domain/README.md](../../business-domain/README.md) - Domain package guide
- [packages/database/README.md](../database/README.md) - Database schemas

---

**Version:** 1.0.0  
**Last Updated:** February 18, 2026  
**Status:** Production-Ready ✅
