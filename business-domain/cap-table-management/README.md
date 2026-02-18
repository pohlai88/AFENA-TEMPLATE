# Cap Table Management

<!-- afenda:badges -->
![H - Governance, Risk & Compliance](https://img.shields.io/badge/H-Governance%2C+Risk+%26+Compliance-403294?style=flat-square) ![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square) ![pkg](https://img.shields.io/badge/pkg-afenda--cap--table--management-555555?style=flat-square) ![docs](https://img.shields.io/badge/class-H%20·%20of%2010-lightgrey?style=flat-square)


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
