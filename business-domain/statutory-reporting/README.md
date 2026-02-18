# @afenda/statutory-reporting

Multi-GAAP statutory financial reporting with country-specific formats, XBRL generation, and SAF-T compliance.

## Purpose

Provides statutory financial reporting capabilities for multinational enterprises operating in multiple jurisdictions. Each country requires local GAAP financial statements in specific formats. This package handles multi-GAAP accounting, chart of accounts mapping, XBRL/iXBRL generation, SAF-T (Standard Audit File for Tax), and e-filing integration.

## When to Use This Package

Use `afenda-statutory-reporting` when you need to:

- Prepare local GAAP financial statements (HGB, PCG, JGAAP, BR-GAAP, etc.)
- Map group GAAP (IFRS/US GAAP) to local GAAP
- Generate country-specific financial statement formats
- Produce XBRL/iXBRL taxonomies for regulatory filings
- Generate SAF-T files for tax authorities
- Submit e-filings to local authorities
- Comply with local disclosure requirements
- Support 100+ country-specific reporting requirements

**Do NOT use directly** - Import through `afenda-crud` which provides authorization and audit logging.

## Key Concepts

### Multi-GAAP Accounting

Companies may need to maintain multiple sets of books:

- **Group GAAP**: IFRS or US GAAP for consolidation
- **Local GAAP**: Country-specific GAAP for statutory filing
- **Tax Basis**: Tax accounting for tax returns
- **Management Reporting**: Internal  reporting basis

### Chart of Accounts Mapping

Map local accounts to group accounts:

- **Local CoA**: Country-specific chart (Germany HGB, France PCG)
- **Group CoA**: Standardized group chart
- **Mapping Rules**: Many-to-one or one-to-many mappings
- **Adjustments**: Local GAAP vs. Group GAAP adjustments

### Country Formats

Each country has specific financial statement formats:

- **Germany (HGB)**: Bilanz, GuV, Anhang
- **France (PCG)**: Bilan, Compte de résultat, Annexe
- **Japan (JGAAP)**: Balance Sheet, P&L, Notes
- **Brazil (BR-GAAP)**: Balanço Patrimonial, DRE
- **China (CAS)**: Balance Sheet, Income Statement, Cash Flow

### XBRL/iXBRL

Machine-readable financial reporting:

- **XBRL**: Extensible Business Reporting Language
- **iXBRL**: Inline XBRL (human + machine readable)
- **Taxonomies**: Country-specific XBRL taxonomies
- **Tagging**: Map financial statement lines to XBRL tags
- **Validation**: Validate against taxonomy rules

### SAF-T

Standard Audit File for Tax:

- **Format**: XML file with accounting data
- **Coverage**: Chart of accounts, trial balance, journals, invoices
- **Countries**: Portugal, Poland, Austria, Norway, Luxembourg
- **Purpose**: Provide tax authorities with audit-ready data

## Quick Start

```typescript
import { db } from 'afenda-database';
import {
  generateStatutoryFinancials,
  mapToLocalGAAP,
  generateXBRL,
  generateSAFT,
  submitEFiling,
} from 'afenda-statutory-reporting';

// Generate statutory financial statements
const financials = await generateStatutoryFinancials(db, 'org-123', {
  legalEntityId: 'entity-de-001',
  fiscalYearEnd: '2025-12-31',
  reportingStandard: 'HGB',
  format: 'bilanz_guv',
});

// Map group GAAP to local GAAP
const mapped = await mapToLocalGAAP(db, 'org-123', {
  sourceEntityId: 'entity-de-001',
  sourceGAAP: 'IFRS',
  targetGAAP: 'HGB',
  fiscalPeriodId: 'period-2025-12',
  adjustments: ['depreciation', 'provisions', 'revenue_recognition'],
});

// Generate XBRL filing
const xbrl = await generateXBRL(db, 'org-123', {
  legalEntityId: 'entity-de-001',
  fiscalYearEnd: '2025-12-31',
  taxonomy: 'de-gaap-ci-2024-12-31',
  reportType: 'annual',
});

// Generate SAF-T file for tax authority
const saft = await generateSAFT(db, 'org-123', {
  legalEntityId: 'entity-pt-001',
  fiscalPeriodStart: '2025-01-01',
  fiscalPeriodEnd: '2025-12-31',
  version: 'PT_1.04_01',
});

// Submit e-filing to authority
await submitEFiling(db, 'org-123', {
  legalEntityId: 'entity-de-001',
  filingType: 'annual_accounts',
  filingData: xbrl,
  authorityEndpoint: 'https://www.bundesanzeiger.de',
});
```

## Architecture

**Layer**: 2 (Domain Service)

**Dependencies**:
- `afenda-canon` - Entity types and schemas
- `afenda-database` - Database schema and ORM
- `afenda-logger` - Structured logging
- `drizzle-orm` - SQL query builder

**Depends on**:
- `legal-entity-management` - Entity master data
- `accounting` - Trial balance data
- `consolidation` - Group financials (if needed)
- `tax-compliance` - Tax returns integration

## Services

### `statutory-financials.ts`

Generate country-specific statutory financial statements:
- Pull trial balance for legal entity
- Apply local GAAP adjustments
- Format per country requirements
- Generate balance sheet, P&L, notes
- Produce PDF/Excel/HTML outputs

### `gaap-mapping.ts`

Map between different accounting standards:
- Chart of accounts mapping (local ↔ group)
- GAAP adjustment entries
- Reconciliation schedules
- Mapping validation
- Mapping audit trail

### `xbrl-generator.ts`

Generate XBRL/iXBRL filings:
- Load taxonomy definition
- Tag financial statement lines
- Validate against taxonomy rules
- Generate XBRL instance document
- Produce iXBRL HTML output

### `saft-generator.ts`

Generate SAF-T files:
- Extract chart of accounts
- Export trial balance
- Include journal entries
- Add invoice details (AR/AP)
- Format per country SAF-T schema
- Validate XML structure

### `country-formats.ts`

Country-specific formatting:
- Germany: HGB Bilanz/GuV
- France: PCG Bilan/Compte de résultat
- Japan: JGAAP formats
- Brazil: BR-GAAP Balanço/DRE
- China: CAS formats
- UK: FRS 102 formats
- Extensible for new countries

### `efiling-integration.ts`

E-filing submission integration:
- Authority-specific APIs
- Digital signatures (qualified certificates)
- Submission tracking
- Acknowledgment processing
- Error handling and retry

## Compliance

- **IFRS**: International Financial Reporting Standards
- **US GAAP**: Generally Accepted Accounting Principles (US)
- **HGB**: German Commercial Code (Handelsgesetzbuch)
- **PCG**: French General Chart of Accounts (Plan Comptable Général)
- **JGAAP**: Japanese Generally Accepted Accounting Principles
- **BR-GAAP**: Brazilian GAAP
- **CAS**: Chinese Accounting Standards
- **FRS 102**: UK Financial Reporting Standard
- **SAF-T**: Standard Audit File for Tax (OECD)
- **XBRL**: Extensible Business Reporting Language

## Related Packages

- [`afenda-legal-entity-management`](../legal-entity-management/README.md) - Entity registry
- [`afenda-accounting`](../accounting/README.md) - Trial balance source
- [`afenda-consolidation`](../consolidation/README.md) - Group reporting
- [`afenda-tax-compliance`](../tax-compliance/README.md) - Tax returns

## Why This Wins Deals

**Cannot operate legally in a country without statutory reporting.** This is a **hard market entry requirement**.

Example: A US parent with a German subsidiary MUST:
- Prepare HGB financial statements
- File with Bundesanzeiger (German federal gazette)
- Submit to local tax authority
- Comply with German disclosure requirements

Without automated statutory reporting:
- Manual preparation = errors, delays, penalties
- Non-compliance = legal risk, fines
- Audit failures = reputational damage

SAP S/4HANA and Oracle ERP Cloud provide country packs with built-in statutory reporting. This package provides **parity** with those capabilities.
