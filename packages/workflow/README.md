# afenda-workflow

**Layer 2: Domain Services** • **Role:** Business Rules Engine

Rule engine for before/after mutation hooks with condition evaluation and action triggering.

---

## 📐 Architecture Role

**Layer 2** in the 4-layer architecture:

```
Layer 3: Application (crud, observability)
Layer 2: Domain Services (workflow ← YOU ARE HERE, advisory, 116 business-domain packages)
Layer 1: Foundation (canon, database, logger, ui)
Layer 0: Configuration (eslint-config, typescript-config)
```

**Purpose:**
- Defines business rules as condition → action mappings
- Evaluates rules before/after entity mutations
- Triggers actions (block, enrich, notify, log)

**Business Logic:** This package implements rule evaluation logic.

---

## ✅ What This Package Does

### 1. Rule Registry

```typescript
import { registerRule } from 'afenda-workflow';

registerRule({
  id: 'auto-approve-small-invoices',
  name: 'Auto-approve invoices under $10,000',
  timing: 'before',
  entityTypes: ['invoices'],
  verbs: ['create'],
  priority: 100,
  enabled: true,
  condition: fieldLessThan('totalMinor', 1000000), // $10,000 in cents
  action: (spec) => ({ ok: true, enrichments: { approved: true } }),
});
```

### 2. Rule Evaluation

```typescript
import { evaluateRules } from 'afenda-workflow';

const result = await evaluateRules('before', mutationSpec, entity, context);
if (!result.ok) {
  throw new Error(result.message);
}
```

### 3. Built-in Conditions

```typescript
import { fieldEquals, fieldChanged, actorHasRole, allOf, anyOf } from 'afenda-workflow';

// Field equality
fieldEquals('status', 'draft')

// Field changed from original
fieldChanged('totalMinor')

// Actor permission
actorHasRole('admin')

// Combinators
allOf(fieldEquals('status', 'draft'), actorHasRole('accountant'))
anyOf(actorHasRole('admin'), actorHasRole('accountant'))
```

---

## ❌ What This Package NEVER Does

| ❌ Never Do This | ✅ Do This Instead |
|-----------------|-------------------|
| Import from business-domain packages | Business domains can import workflow |
| Import from crud | CRUD calls workflow during mutations |
| Import from advisory | Advisory is same layer (isolated) |
| Import from observability | Observability is upper layer |
| Implement database logic | Use database package for queries |

---

## 📦 What This Package Exports

### Rule Engine

- `evaluateRules(timing, spec, entity, ctx)` — Evaluate all matching rules
- `registerRule(rule)` — Register a workflow rule
- `unregisterRule(id)` — Remove a rule by ID
- `getRegisteredRules()` — List all registered rules
- `clearRules()` — Remove all rules (testing only)

### Built-in Conditions

- `always()` / `never()` — Constant matchers
- `fieldEquals(field, value)` — Input field equality
- `fieldLessThan(field, value)` — Numeric comparison
- `fieldChanged(field)` — Field differs from entity snapshot
- `actorHasRole(role)` — Actor role check
- `allOf(...conditions)` — AND combinator
- `anyOf(...conditions)` — OR combinator

### Types

- `Rule` — Rule definition shape
- `RuleTiming` — 'before' | 'after'
- `RuleContext` — Evaluation context
- `RuleResult` — Evaluation result (ok, message, enrichments)

---

## 📖 Usage Examples

### Before-Rule: Block Invalid Mutations

```typescript
import { registerRule, fieldEquals } from 'afenda-workflow';

registerRule({
  id: 'require-customer-email',
  name: 'Require email when creating customer',
  timing: 'before',
  entityTypes: ['customers'],
  verbs: ['create'],
  priority: 50,
  enabled: true,
  condition: fieldEquals('email', undefined),
  action: () => ({
    ok: false,
    message: 'Email is required for new customers',
  }),
});
```

### Before-Rule: Enrich Mutation

```typescript
registerRule({
  id: 'auto-set-created-date',
  name: 'Auto-set createdAt timestamp',
  timing: 'before',
  entityTypes: ['invoices'],
  verbs: ['create'],
  priority: 10,
  enabled: true,
  condition: always(),
  action: () => ({
    ok: true,
    enrichments: { createdAt: new Date() },
  }),
});
```

### After-Rule: Trigger Side Effect

```typescript
registerRule({
  id: 'notify-large-payment',
  name: 'Notify on payments over $100,000',
  timing: 'after',
  entityTypes: ['payments'],
  verbs: ['create'],
  priority: 100,
  enabled: true,
  condition: fieldGreaterThan('amountMinor', 10000000),
  action: async (spec, entity) => {
    await sendNotification('large-payment', { paymentId: entity.id });
    return { ok: true };
  },
});
```

---

## 🔗 Dependencies

### Workspace Dependencies

- ✅ `afenda-canon` (Layer 1) — imports types
- ✅ `afenda-database` (Layer 1) — queries database for rule data

### External Dependencies

- `drizzle-orm` — Database queries
- `zod` — Schema validation

### Who Depends on This Package

- ✅ `afenda-crud` (Layer 3) — calls `evaluateRules()` during mutations
- ✅ Business-domain packages (Layer 2) — MAY import if needed (same layer)

---

## 🚦 Dependency Rules

```
✅ ALLOWED:
  - afenda-canon (Layer 1)
  - afenda-database (Layer 1)
  - External npm (drizzle-orm, zod)
  - Node.js built-ins

❌ FORBIDDEN:
  - business-domain/* (Layer 2, same layer - avoid coupling)
  - afenda-advisory (Layer 2, same layer - different domain)
  - afenda-crud (Layer 3, upper layer)
  - afenda-observability (Layer 3, upper layer)
```

**Rule:** Layer 2 packages can depend on Layers 0 and 1, but NOT on other Layer 2 or Layer 3 packages.

---

## 📜 Scripts

```bash
pnpm build       # Build package
pnpm dev         # Watch mode
pnpm type-check  # TypeScript check
pnpm lint        # ESLint
pnpm lint:fix    # ESLint with auto-fix
pnpm test        # Run tests
```

---

## ⚠️ PREVENT DRIFT - Critical Architecture Rules

### 🔒 Rule 1: NEVER Import from Business Domains

**❌ WRONG:**

```typescript
// src/index.ts
import { calculateTax } from 'afenda-accounting'; // FORBIDDEN!
```

**Why:** Workflow is Layer 2, same layer as business domains. No cross-domain dependencies.

**✅ CORRECT:**

```typescript
// Workflow defines rules
// Business domains import workflow if they need rule evaluation
```

---

### 🔒 Rule 2: Rules Are Data, Not Logic

**❌ WRONG:**

```typescript
// Embedding complex logic in actions
action: async (spec, entity) => {
  const tax = spec.totalMinor * 0.0825; // TAX CALCULATION
  const total = spec.totalMinor + tax;
  // 50 lines of business logic...
}
```

**Why:** Complex logic belongs in business-domain packages, not in workflow rules.

**✅ CORRECT:**

```typescript
// Keep actions simple: coordinate, don't calculate
import { calculateTax } from 'afenda-accounting';

action: async (spec, entity) => {
  const tax = calculateTax(spec.totalMinor, spec.taxRate);
  return { ok: true, enrichments: { taxMinor: tax } };
}
```

---

### 🔒 Rule 3: Before-Rules Can Block, After-Rules Cannot

**❌ WRONG:**

```typescript
registerRule({
  timing: 'after', // After mutation commits
  action: () => ({ ok: false, message: 'Blocked!' }), // ❌ Can't block!
});
```

**Why:** After-rules run after transaction commit. They can't block mutations.

**✅ CORRECT:**

```typescript
// Before-rule: Can block
registerRule({
  timing: 'before',
  action: () => ({ ok: false, message: 'Validation failed' }),
});

// After-rule: Fire-and-forget only
registerRule({
  timing: 'after',
  action: async () => {
    await sendNotification(...);
    return { ok: true }; // Always ok, errors swallowed
  },
});
```

---

### 🔒 Rule 4: NEVER Import from CRUD

**❌ WRONG:**

```typescript
import { createInvoice } from 'afenda-crud'; // FORBIDDEN!
```

**Why:** Workflow is Layer 2, crud is Layer 3. Dependencies flow bottom-up only.

---

### 🚨 Validation Commands

```bash
# Check for circular dependencies
pnpm run validate:deps

# Check for layer violations
pnpm lint:ci

# Type-check
pnpm type-check
```

---

## 🔍 Quick Reference

| Question | Answer |
|----------|--------|
| **What layer?** | Layer 2 (Domain Services) |
| **What does it export?** | Rule engine, conditions, rule registry |
| **What does it import?** | canon (types), database (queries) |
| **Who imports it?** | crud (Layer 3), optionally business domains |
| **Can it import from domains?** | ❌ NO (same layer) |
| **Can it import from crud?** | ❌ NO (upper layer) |
| **Can it import from advisory?** | ❌ NO (same layer, different domain) |
| **Before vs After?** | Before = block/enrich, After = fire-and-forget |

---

## 📚 Related Documentation

- [ARCHITECTURE.md](../../ARCHITECTURE.md) - Complete 4-layer architecture
- [packages/canon/README.md](../canon/README.md) - Type definitions
- [packages/advisory/README.md](../advisory/README.md) - Advisory engine
- [packages/crud/README.md](../crud/README.md) - Application orchestration

---

**Last Updated:** February 18, 2026  
**Architecture Version:** 2.0 (Clean State)
