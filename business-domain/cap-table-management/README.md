# Cap Table Management

Capitalization table and ownership tracking for venture-backed companies.

## Purpose

Pre-IPO cap table management with support for:
- Shareholder registry (founders, employees, angels, VCs, strategic investors)  
- Share classes (common, preferred series, warrants, SAFEs, convertible notes)
- Dilution tracking and modeling (pre-money/post-money valuations)
- Liquidation waterfall (preference stack and participation rights)
- Round modeling (Series A/B/C scenarios, pro-forma ownership)
- Option pool management (equity pool sizing, refresh rounds)
- Conversion mechanics (preferred → common on IPO/M&A)

## Key Services

- `shareholder-registry.ts` - Shareholder management
- `share-classes.ts` - Common, preferred, warrants, SAFEs, convertibles
- `dilution-tracking.ts` - Pre/post-money modeling
- `liquidation-waterfall.ts` - Preference stack calculations
- `round-modeling.ts` - Fundraising scenario modeling
- `option-pool.ts` - Equity pool management
- `conversion-mechanics.ts` - Preferred to common conversions

## Business Value

- Enable venture capital fundraising
- IPO and M&A readiness
- Legal risk mitigation  
- Ownership dispute prevention

## Dependencies

- `afenda-database` - Database access
- `afenda-canon` - Standard types and utilities
- `zod` - Schema validation
- `drizzle-orm` - Type-safe SQL queries
