# Group Purchasing

Multi-company procurement leverage and volume discount optimization.

## Purpose

Multi-company procurement with:
- Group contracts (master purchasing agreements)
- Volume commitments (commitment tracking across entities)
- Rebate tracking (volume rebate accrual and claims)
- Compliance monitoring (maverick spend detection)
- Spend aggregation (cross-entity spend consolidation)
- Supplier leverage (volume discount tier tracking)

## Key Services

- `group-contracts.ts` - Master purchasing agreements
- `volume-commitments.ts` - Cross-entity commitment tracking
- `rebate-tracking.ts` - Volume rebate accrual and claims
- `compliance-monitoring.ts` - Maverick spend detection
- `spend-aggregation.ts` - Cross-entity spend consolidation
- `supplier-leverage.ts` - Volume discount tier tracking

## Business Value

- 10-15% procurement cost savings
- Supplier consolidation
- Compliance enforcement
- Negotiation leverage

## Dependencies

- `afenda-database` - Database access
- `afenda-canon` - Standard types and utilities
- `zod` - Schema validation
- `drizzle-orm` - Type-safe SQL queries
