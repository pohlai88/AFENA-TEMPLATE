# afenda-crm

Customer relationship management and pricing domain services for the
AFENDA-NEXUS ERP system.

## Purpose

`afenda-crm` provides domain-specific business logic for customer relationship
management including price resolution, discount evaluation, tiered pricing, and
promotional pricing rules.

## When to Use This Package

Use `afenda-crm` when you need to:

- Resolve product prices with customer-specific rules
- Apply tiered pricing based on quantity breaks
- Evaluate and apply discount rules with stacking logic
- Calculate line-level pricing with all discounts applied
- Support multi-currency pricing through price lists

**Do NOT use directly** - Import through `afenda-crud` which provides
authorization and audit logging.

## Key Concepts

### Price Resolution

- **Resolution order**: Customer-specific → Price list → Default
- **Effective dating**: Price lists have effective date ranges
- **Quantity tiers**: Different prices at different quantity breakpoints
- **Currency-aware**: Each price list has a currency code

### Discount Evaluation

- **Precedence-based**: Rules ordered by precedence (lower = higher priority)
- **Stacking logic**: Stackable rules compound; non-stackable rules are
  exclusive
- **Scope-based**: Global, customer-specific, or product-specific rules
- **Time-bounded**: Rules have effective_from and effective_to dates
- **Discount types**: Percentage, fixed amount, or buy-x-get-y

### Line Pricing

- **Full calculation**: Combines price resolution and discount evaluation
- **Minor units**: All amounts in integer cents (no floating-point drift)
- **Transparent results**: Returns detailed breakdown of pricing components

## Quick Start

```typescript
import { db } from 'afenda-database';
import { evaluateDiscounts, priceLineItem, resolvePrice } from 'afenda-crm';

// Resolve unit price for a product
const price = await resolvePrice(
  db,
  'org-123',
  'product-456',
  10, // quantity
  '2026-02-17',
  'customer-789', // optional
);
// => {
//   priceMinor: 125000,
//   priceListId: 'pl-001',
//   priceListCode: 'RETAIL-2026',
//   currencyCode: 'MYR',
//   source: 'price_list'
// }

// Evaluate applicable discounts
const discounts = await evaluateDiscounts(
  db,
  'org-123',
  1250000, // subtotal in minor units ($12,500.00)
  '2026-02-17',
  'product-456', // optional
  'customer-789', // optional
);
// => [
//   {
//     ruleId: 'rule-001',
//     code: 'EARLY-BIRD',
//     discountType: 'percentage',
//     discountValue: 10,
//     discountMinor: 125000,
//     stackable: true
//   }
// ]

// Full line pricing (convenience function)
const lineResult = await priceLineItem(
  db,
  'org-123',
  'product-456',
  10,
  '2026-02-17',
  'customer-789',
);
// => {
//   unitPriceMinor: 125000,
//   qty: 10,
//   subtotalMinor: 1250000,
//   discounts: [...],
//   totalDiscountMinor: 125000,
//   netMinor: 1125000,
//   priceSource: {...}
// }
```

## Dependencies

- `afenda-canon` - Entity types and schemas
- `afenda-database` - Database schema and ORM
- `drizzle-orm` - SQL query builder

## Related Packages

- [`afenda-crud`](../crud/README.md) - Orchestrates CRM services with auth
- [`afenda-workflow`](../workflow/README.md) - Triggers rules based on CRM
  events
- [`afenda-database`](../database/README.md) - Provides database schema

## Architecture

**Layer**: Domain Services (Layer 2)

This package implements pure business logic with no knowledge of HTTP, auth, or
UI. All services accept database handles and return typed results.

See: [ARCHITECTURE.md](../../ARCHITECTURE.md)

---

**Last Updated**: February 17, 2026
