# Investment Management

<!-- afenda:badges -->
![A - Financial Management](https://img.shields.io/badge/A-Financial+Management-0052CC?style=flat-square) ![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square) ![pkg](https://img.shields.io/badge/pkg-afenda--investment--management-555555?style=flat-square) ![docs](https://img.shields.io/badge/class-A%20·%20of%2010-lightgrey?style=flat-square)


Investment portfolio tracking with fair value measurement and impairment testing.

## Purpose

Holding company investment management with:
- Investment registry (debt/equity securities, real estate, derivatives, alternatives)
- Fair value measurement (ASC 820 hierarchy - Level 1/2/3)
- Mark-to-market quarterly/monthly adjustments
- Impairment testing (OTTI for debt, qualitative/quantitative for equity)
- Investment income (interest accrual, dividends, gains/losses)
- Cost basis tracking (average cost, FIFO, specific identification)
- Portfolio analytics (IRR, MOIC, allocation, risk metrics)

## Key Services

- `investment-registry.ts` - Investment portfolio management
- `fair-value-measurement.ts` - ASC 820 fair value hierarchy
- `mark-to-market.ts` - Fair value adjustments
- `impairment-testing.ts` - OTTI and impairment tests
- `investment-income.ts` - Interest, dividends, gains/losses
- `cost-basis-tracking.ts` - Cost basis methods
- `portfolio-analytics.ts` - IRR, MOIC, risk metrics

## Business Value

- Holding company enablement
- ASC 820 compliance
- Tax optimization (correct cost basis)
- Portfolio risk management

## Dependencies

- `afenda-database` - Database access
- `afenda-canon` - Standard types and utilities
- `zod` - Schema validation
- `drizzle-orm` - Type-safe SQL queries
