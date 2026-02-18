# External Audit Management

<!-- afenda:badges -->
![H - Governance, Risk & Compliance](https://img.shields.io/badge/H-Governance%2C+Risk+%26+Compliance-403294?style=flat-square) ![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square) ![pkg](https://img.shields.io/badge/pkg-afenda--external--audit--management-555555?style=flat-square) ![docs](https://img.shields.io/badge/class-H%20·%20of%2010-lightgrey?style=flat-square)


External audit support and SOX 404 attestation workflow.

## Purpose

Streamline external audit process with:
- PBC (Prepared By Client) list tracking (200-500 requests)
- Confirmations (bank, AR, legal, AP workflows)
- Audit adjustments (AJE tracking, approval, posting)
- Control testing (SOX 404 evidence repository)
- Deficiency tracking (material weakness and significant deficiencies)
- Audit milestones (interim review, year-end fieldwork, opinion)
- Auditor portal (secure file sharing and Q&A tracking)
- Representation letter generation

## Key Services

- `pbc-management.ts` - Prepared By Client list management
- `confirmations.ts` - Bank, AR, legal, AP confirmations
- `audit-adjustments.ts` - AJE tracking and posting
- `control-testing.ts` - SOX 404 evidence management
- `deficiency-tracking.ts` - Material weaknesses and deficiencies
- `audit-milestones.ts` - Audit timeline management
- `auditor-portal.ts` - Secure collaboration portal

## Business Value

- IPO enablement
- 20-30% audit fee reduction
- Faster close (8-12 weeks → 4-6 weeks)
- Audit committee confidence

## Dependencies

- `afenda-database` - Database access
- `afenda-canon` - Standard types and utilities
- `zod` - Schema validation
- `drizzle-orm` - Type-safe SQL queries
