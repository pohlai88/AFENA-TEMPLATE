# Cash Pooling

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
