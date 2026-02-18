# Cash Pooling

<!-- afenda:badges -->
![A - Financial Management](https://img.shields.io/badge/A-Financial+Management-0052CC?style=flat-square) ![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square) ![pkg](https://img.shields.io/badge/pkg-afenda--cash--pooling-555555?style=flat-square) ![docs](https://img.shields.io/badge/class-A%20·%20of%2010-lightgrey?style=flat-square)


Multi-entity cash concentration and notional pooling.

## Purpose

Multi-company treasury optimization with:
- Physical pooling (zero-balance accounts, daily sweep)
- Notional pooling (virtual pooling with interest offset)
- Intercompany lending (IC loans with arm's length rates)
- Pool analytics (effective interest rate, cash concentration)
- Bank integration (automated sweep instructions)
- Regulatory compliance (jurisdiction-specific rules)

## Key Services

- `physical-pooling.ts` - Zero-balance accounts and sweeps
- `notional-pooling.ts` - Virtual pooling with interest offset
- `intercompany-lending.ts` - IC loans at arm's length rates
- `pool-analytics.ts` - Effective rates and concentration
- `bank-integration.ts` - Automated sweep instructions
- `regulatory-compliance.ts` - Jurisdiction-specific rules

## Business Value

- 10-20% interest cost savings
- Reduced external borrowing
- Centralized cash control
- Working capital optimization

## Dependencies

- `afenda-database` - Database access
- `afenda-canon` - Standard types and utilities
- `zod` - Schema validation
- `drizzle-orm` - Type-safe SQL queries
