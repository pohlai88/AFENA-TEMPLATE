# afenda-crud-convenience

> **Convenience Re-export Package** — Domain services + infrastructure utilities barrel

This package provides a single import point for domain services and infrastructure utilities that are commonly used together with the CRUD kernel. It's a convenience wrapper that re-exports from multiple specialized packages.

---

## 📦 What This Package Exports

### Domain Service Re-exports

This package re-exports domain services from specialized business-domain packages:

```typescript
import {
  // Accounting services
  calculateTax,
  lookupFxRate,
  allocatePayment,
  
  // CRM services  
  priceLineItem,
  checkCreditLimit,
  
  // Inventory services
  convertUom,
  checkStockLevel,
  
  // Intercompany services
  createIcTransaction,
  matchIcTransactions,
} from 'afenda-crud-convenience';
```

### Infrastructure Service Re-exports

Re-exports infrastructure utilities from `afenda-crud/internal`:

```typescript
import {
  allocateDocNumber,
  validateCustomFields,
  loadFieldDefs,
  checkRateLimit,
  meterApiRequest,
} from 'afenda-crud-convenience';
```

---

## 🎯 When to Use This Package

### ✅ Use `afenda-crud-convenience` when:

- You need multiple domain services in one file
- You're building API routes that coordinate across domains
- You want a single import for common utilities

### ❌ Don't use `afenda-crud-convenience` when:

- You only need the CRUD kernel (`mutate`, `readEntity`, `listEntities`) — use `afenda-crud` directly
- You only need one domain service — import directly from the domain package
- You're building a domain package — never import convenience packages from domain code

---

## 📖 Usage Example

```typescript
import { mutate, buildUserContext } from 'afenda-crud';
import { 
  calculateTax,
  priceLineItem,
  allocateDocNumber,
  validateCustomFields,
} from 'afenda-crud-convenience';

const ctx = buildUserContext({ orgId: 'org-123', userId: 'user-456' });

// Use domain services
const taxMinor = await calculateTax(db, orgId, { baseMinor: 10000, rate: 0.0825 });
const pricing = await priceLineItem(db, orgId, { productId: 'prod-1', quantity: 10 });

// Use infrastructure services
const docNo = await allocateDocNumber(db, orgId, 'invoices', '2024');
await validateCustomFields(db, orgId, 'invoices', customData);

// Use CRUD kernel
const result = await mutate(
  {
    actionType: 'invoices.create',
    entityRef: { type: 'invoices', orgId },
    input: { /* ... */ },
  },
  ctx
);
```

---

## 🔗 Source Packages

This package re-exports from:

- **`afenda-accounting`** — Tax, FX, depreciation, payment allocation
- **`afenda-crm`** — Pricing, discounts, credit limits
- **`afenda-inventory`** — UOM conversion, stock checks, landed costs
- **`afenda-intercompany`** — IC transactions, matching, eliminations
- **`afenda-crud/internal`** — Infrastructure services

---

## 📚 Related Documentation

- **[afenda-crud](../crud/README.md)** — Mutation kernel
- **[afenda-accounting](../../business-domain/accounting/README.md)** — Accounting services
- **[afenda-crm](../../business-domain/crm/README.md)** — CRM services
- **[afenda-inventory](../../business-domain/inventory/README.md)** — Inventory services
- **[afenda-intercompany](../../business-domain/intercompany/README.md)** — Intercompany services

---

## 🔧 Development

### Scripts

```bash
pnpm build       # Build package
pnpm dev         # Watch mode
pnpm type-check  # TypeScript check
pnpm lint        # ESLint
pnpm lint:fix    # ESLint with auto-fix
```

---

## ⚠️ Important Notes

### This is a Convenience Package

- **No business logic** — only re-exports
- **No new functionality** — just aggregation
- **Lightweight** — minimal bundle size (2.7 KB ESM)

### Direct Imports Are Preferred

If you only need one service, import directly from the source package:

```typescript
// ✅ BETTER: Direct import (tree-shakeable)
import { calculateTax } from 'afenda-accounting';

// ⚠️ OK: Convenience import (still tree-shakeable)
import { calculateTax } from 'afenda-crud-convenience';
```

Both work identically due to proper ESM exports, but direct imports make dependencies clearer.

---

**License:** Private  
**Package:** `afenda-crud-convenience`  
**Type:** Convenience Re-export  
**Last Updated:** February 19, 2026
