# Group Purchasing

<!-- afenda:badges -->
![B - Procurement & Supply Chain](https://img.shields.io/badge/B-Procurement+%26+Supply+Chain-36B37E?style=flat-square) ![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square) ![pkg](https://img.shields.io/badge/pkg-afenda--group--purchasing-555555?style=flat-square) ![docs](https://img.shields.io/badge/class-B%20·%20of%2010-lightgrey?style=flat-square)


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
