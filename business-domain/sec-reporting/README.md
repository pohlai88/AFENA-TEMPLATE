# SEC Reporting

Public company SEC filing automation and XBRL compliance.

## Purpose

Complete SEC reporting capability with:
- Form 10-K annual report with MD&A, financials, footnotes
- Form 10-Q quarterly report with condensed financials
- Form 8-K current events (M&A, CEO change, earnings)
- Proxy statement DEF 14A for shareholder meetings
- XBRL tagging (US GAAP taxonomy + company extensions)
- EDGAR integration (SEC electronic filing system)
- Filing calendar (accelerated/large filer deadline tracking)
- Segment reporting (ASC 280 operating segments)

## Key Services

- `form-10k.ts` - Annual report generation
- `form-10q.ts` - Quarterly report generation
- `form-8k.ts` - Current event reporting
- `proxy-statement.ts` - Shareholder meeting materials
- `xbrl-tagging.ts` - US GAAP taxonomy tagging
- `edgar-integration.ts` - SEC filing system
- `mda-templates.ts` - Management Discussion & Analysis
- `segment-reporting.ts` - ASC 280 disclosures

## Business Value

- Public company compliance
- Prevent delisting risk
- Reduce external audit fees
- Investor confidence

## Dependencies

- `afenda-database` - Database access
- `afenda-canon` - Standard types and utilities
- `zod` - Schema validation
- `drizzle-orm` - Type-safe SQL queries
