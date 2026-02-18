# Dividend Management

<!-- afenda:badges -->
![H - Governance, Risk & Compliance](https://img.shields.io/badge/H-Governance%2C+Risk+%26+Compliance-403294?style=flat-square) ![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square) ![pkg](https://img.shields.io/badge/pkg-afenda--dividend--management-555555?style=flat-square) ![docs](https://img.shields.io/badge/class-H%20·%20of%2010-lightgrey?style=flat-square)


Dividend policy and payment workflow for public and holding companies.

## Purpose

Public company and holding company dividend management with:
- Dividend policy (payout ratio targets, yield targets, board documentation)
- Dividend declaration (board resolution, ex-dividend, record, payment dates)
- Payment processing (shareholder distribution calculation and execution)
- Withholding tax (foreign shareholder tax - 30% or treaty rate)
- Dividend reinvestment (DRIP programs, fractional shares)
- Special dividends (one-time distributions)
- Stock dividends (share-based dividend accounting)

## Key Services

- `dividend-policy.ts` - Policy and board documentation
- `dividend-declaration.ts` - Declaration and key dates
- `payment-processing.ts` - Distribution calculation and execution
- `withholding-tax.ts` - Foreign withholding tax
- `dividend-reinvestment.ts` - DRIP programs
- `special-dividends.ts` - One-time distributions
- `dividend-analytics.ts` - Payout ratio, coverage, yield, growth

## Business Value

- Public company investor relations
- Holding company subsidiary management
- Tax compliance
- Cash flow forecasting

## Dependencies

- `afenda-database` - Database access
- `afenda-canon` - Standard types and utilities
- `zod` - Schema validation
- `drizzle-orm` - Type-safe SQL queries
