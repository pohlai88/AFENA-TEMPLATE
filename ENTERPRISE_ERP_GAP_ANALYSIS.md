# Enterprise ERP Domain Gap Analysis & Recommendations

**Date:** February 17, 2026\
**Current Status:** 31 Domain Packages (Classic ERP Coverage)\
**Objective:** Identify and implement advanced enterprise ERP domains

---

## Executive Summary

The current afenda NEXUS architecture provides **excellent "classic ERP"
coverage** across Finance, Supply Chain, Sales, HCM, BI, and Integration (31
packages). However, a **professional enterprise ERP suite** requires additional
domains that transform modules into an **operating system for the company**.

This document identifies **10 critical missing domains** (13 new packages)
needed for enterprise-grade ERP.

---

## Current Coverage Analysis

### ✅ Strengths (31 Existing Packages)

**Finance & Accounting (7)**

- Core accounting, budgeting, treasury, fixed assets
- Tax compliance, regulatory reporting, intercompany
- **GAP:** Missing financial close operations, rebates/accruals

**Supply Chain & Operations (11)**

- Inventory, procurement, purchasing, receiving, payables
- Planning (MRP/MPS), production, quality, warehouse, shipping, transportation
- **GAP:** Missing returns/RMA, engineering change control

**Sales & Customer (3)**

- CRM, sales orders, receivables
- **GAP:** Missing customer service, contract lifecycle (sales side)

**Human Capital (5)**

- Payroll, benefits, time & attendance, learning, performance
- **STRONG:** Comprehensive HCM coverage

**Business Intelligence (3)**

- Data warehouse, BI/analytics, predictive analytics
- **GAP:** Missing master data management/governance

**Integration (2)**

- Integration hub, configurator
- **STRONG:** Modern integration architecture

### ❌ Critical Gaps Identified

1. **Master Data Management** - No explicit MDM/golden records
2. **Financial Close Management** - Not separated from regulatory reporting
3. **Rebates & Trade Promotions** - Only basic pricing in CRM
4. **Customer Service & Returns** - After-sales loop missing
5. **Enterprise Asset Management** - Operational maintenance missing
6. **Product Lifecycle Management** - Engineering change control missing
7. **Trade & Global Logistics** - Customs/landed cost missing
8. **Contract Lifecycle (Sales)** - Only procurement contracts covered
9. **Document Management** - Not a first-class domain
10. **Access Governance** - No business-facing identity management

---

## Recommended New Packages (13)

### Priority 1: Foundation & Governance (3 packages)

#### 1. Master Data Management (`packages/mdm`)

**Why Critical:** Every ERP becomes a "master data war" without explicit MDM.
Prevents duplicate items/customers/locations and ensures reporting accuracy.

**Key Services:**

- `golden-records.ts` - Master record merge, deduplication, survivorship
- `data-stewardship.ts` - Data ownership, approval workflows
- `code-generation.ts` - SKU numbering, chart segment rules
- `data-quality.ts` - Quality rules, scorecards, monitoring
- `mdm-analytics.ts` - Data completeness, accuracy metrics

**Dependencies:** canon, database\
**Used By:** All domain packages

---

#### 2. Financial Close Management (`packages/financial-close`)

**Why Critical:** Finance teams live in close calendars, reconciliations,
allocations. This is separate from regulatory reporting.

**Key Services:**

- `close-calendar.ts` - Close checklists, tasks, dependencies, sign-offs
- `period-lock.ts` - Period lock policies, subledger close gates
- `reconciliations.ts` - Balance sheet recs, variance explanations
- `allocations.ts` - Shared services allocation, overhead absorption
- `close-analytics.ts` - Close cycle time, bottleneck analysis

**Dependencies:** accounting, budgeting, intercompany\
**Business Value:** Accelerate close, reduce errors, ensure completeness

---

#### 3. Document Management (`packages/document-mgmt`)

**Why Critical:** ERP needs "evidence" - invoices, delivery notes, COAs,
contracts, approvals. Essential for audit and compliance.

**Key Services:**

- `repository.ts` - Versioning, tagging, retention, legal hold
- `ocr-ingestion.ts` - OCR pipelines, document classification
- `transaction-linking.ts` - Link docs to transactions (PO → Invoice → Payment)
- `evidence-packs.ts` - Export evidence for audits
- `document-analytics.ts` - Storage, retrieval patterns

**Dependencies:** canon, database, search\
**Used By:** All transactional packages

---

### Priority 2: Commercial Operations (3 packages)

#### 4. Rebates & Trade Promotions (`packages/rebates`)

**Why Critical:** In many industries, pricing is THE ERP differentiator.
Rebates/promo/accrual settlement needs dedicated domain with accounting hooks.

**Key Services:**

- `rebate-programs.ts` - Customer/supplier rebate definitions (volume, growth)
- `accrual-engine.ts` - Accrual accounting, reserve calculations
- `trade-promotions.ts` - Promo planning, funding, claims
- `settlement.ts` - Rebate settlement workflow, payments
- `rebate-analytics.ts` - ROI, forecast vs actual, accrual accuracy

**Dependencies:** sales, crm, purchasing, accounting\
**Business Value:** Maximize margins, accurate accruals, prevent revenue leakage

---

#### 5. Contract Lifecycle Management (`packages/contract-mgmt`)

**Why Critical:** Contracts govern revenue, penalties, renewals, obligations.
Currently only procurement contracts covered.

**Key Services:**

- `sales-contracts.ts` - Sales contract terms, renewals, SLAs, price agreements
- `obligations.ts` - Deliverables tracking, milestone management
- `compliance.ts` - Penalty clauses, auto-renew alerts, compliance tracking
- `amendments.ts` - Contract amendments, change history
- `contract-analytics.ts` - Contract value, renewal pipeline, compliance rate

**Dependencies:** sales, crm, receivables, procurement\
**Business Value:** Revenue protection, obligation tracking, renewal
optimization

---

#### 6. Pricing Management (`packages/pricing`)

**Why Critical:** Advanced pricing separate from basic CRM. Needs complex rules,
time-based pricing, competitive pricing.

**Key Services:**

- `price-lists.ts` - Price lists by channel/region/customer group
- `price-rules.ts` - Effective dates, tier breaks, waterfall pricing
- `competitive-pricing.ts` - Market-based pricing, price optimization
- `price-approvals.ts` - Exception pricing approval workflow
- `pricing-analytics.ts` - Price realization, margin analysis, discount patterns

**Dependencies:** crm, sales, inventory\
**Business Value:** Optimize pricing strategy, margin protection

---

### Priority 3: After-Sales & Service (2 packages)

#### 7. Customer Service (`packages/customer-service`)

**Why Critical:** Order-to-cash incomplete without "what happens when things go
wrong." Service loop essential for customer satisfaction.

**Key Services:**

- `case-management.ts` - Complaints, inquiries, SLA tracking
- `rma-processing.ts` - Return authorization workflow
- `root-cause.ts` - Root cause analysis, issue categorization
- `service-analytics.ts` - Case volume, CSAT, first-call resolution
- `knowledge-base.ts` - Knowledge articles, solution library

**Dependencies:** sales, shipping, quality-mgmt\
**Business Value:** Improve customer satisfaction, reduce returns cost

---

#### 8. Returns & Reverse Logistics (`packages/returns`)

**Why Critical:** Complete the reverse supply chain. Quality, refurbishment,
warranty processing.

**Key Services:**

- `return-authorization.ts` - RMA creation, return eligibility
- `inspection.ts` - Return inspection, disposition (scrap/rework/restock)
- `warranty.ts` - Warranty entitlements, coverage periods, claim approvals
- `refurbishment.ts` - Repair/refurb workflow, parts tracking
- `returns-analytics.ts` - Return rates, reasons, cost recovery

**Dependencies:** sales, warehouse, inventory, quality-mgmt\
**Business Value:** Recover value, reduce waste, warranty compliance

---

### Priority 4: Operations Excellence (3 packages)

#### 9. Enterprise Asset Management (`packages/asset-mgmt`)

**Why Critical:** Fixed assets is accounting. EAM is operational uptime.
Critical for manufacturing and facility-intensive operations.

**Key Services:**

- `preventive-maintenance.ts` - PM schedules, work orders
- `work-requests.ts` - Maintenance requests, prioritization
- `spare-parts.ts` - Spare parts planning linked to inventory
- `calibration.ts` - Equipment calibration schedules (regulated industries)
- `eam-analytics.ts` - MTBF, MTTR, maintenance costs, uptime

**Dependencies:** inventory, production, fixed-assets\
**Business Value:** Maximize uptime, reduce emergency repairs, compliance

---

#### 10. Product Lifecycle Management (`packages/plm`)

**Why Critical:** Manufacturing needs controlled BOM/routing changes.
Engineering change governance essential.

**Key Services:**

- `engineering-change.ts` - ECO/ECN workflow, approval chains
- `bom-versioning.ts` - Versioned BOMs, effectivity dates
- `impact-analysis.ts` - Cost impact, inventory impact, open order impact
- `specifications.ts` - Formulas, tolerances, QC specs
- `plm-analytics.ts` - Change cycle time, change volume, cost impact

**Dependencies:** inventory, production, quality-mgmt\
**Business Value:** Controlled changes, reduced scrap, cost visibility

---

#### 11. Trade & Customs (`packages/trade-compliance`)

**Why Critical:** Global trade workflows painful without explicit support.
ASEAN/customs essential for international business.

**Key Services:**

- `customs-declaration.ts` - HS codes, country of origin, documentation
- `landed-cost.ts` - Duties, brokerage, freight allocation to inventory
- `restricted-party.ts` - Denied party screening, sanctions compliance
- `trade-documentation.ts` - Commercial invoice, packing list, COO, permits
- `trade-analytics.ts` - Duty costs, clearance time, compliance audit trail

**Dependencies:** shipping, inventory, accounting, receivables\
**Business Value:** Compliance, accurate costing, faster clearance

---

### Priority 5: Security & Governance (2 packages)

#### 12. Access Governance (`packages/access-governance`)

**Why Critical:** RLS is technical. Business needs role design, SoD, approvals,
access reviews. Essential for SOX and audit.

**Key Services:**

- `role-management.ts` - Roles, permission sets, role hierarchies
- `access-requests.ts` - Access request/approval workflow
- `sod-rules.ts` - Segregation of Duties enforcement (AP vs GL, etc.)
- `access-reviews.ts` - Periodic recertification, attestations
- `governance-analytics.ts` - Role assignments, SoD violations, access trends

**Dependencies:** canon, workflow\
**Used By:** All packages\
**Business Value:** SOX compliance, security, audit readiness

---

#### 13. Lease Accounting (`packages/lease-accounting`)

**Why Critical:** ASC 842 / IFRS 16 compliance. Leases are now balance sheet
items requiring dedicated management.

**Key Services:**

- `lease-contracts.ts` - Lease identification, terms capture
- `lease-calculation.ts` - ROU asset, lease liability calculations
- `lease-schedules.ts` - Payment schedules, amortization tables
- `modifications.ts` - Lease modifications, remeasurement
- `lease-analytics.ts` - Lease portfolio, expiration tracking, compliance

**Dependencies:** accounting, fixed-assets\
**Business Value:** ASC 842 compliance, audit-ready reporting

---

## Revised Package Count

**Before:** 31 packages\
**After:** 44 packages (+13)

### New Domain Distribution

```
1. Finance & Accounting           → 10 packages (+3)
   - Added: financial-close, lease-accounting, rebates (accruals)

2. Supply Chain & Operations      → 14 packages (+3)
   - Added: returns, asset-mgmt, plm

3. Sales & Customer               → 6 packages (+3)
   - Added: customer-service, contract-mgmt, pricing

4. Human Capital                  → 5 packages (no change)

5. Business Intelligence          → 3 packages (no change)

6. Integration & Configuration    → 2 packages (no change)

7. Governance & Foundation        → 4 packages (+4)
   - Added: mdm, document-mgmt, access-governance, trade-compliance
```

---

## Updated Business Process Coverage

### Order-to-Cash (Extended)

1. `pricing` - Advanced pricing rules
2. `contract-mgmt` - Sales contracts
3. `crm` - Customer data
4. `sales` - Order entry
5. `warehouse` → `shipping` - Fulfillment
6. `receivables` - Invoice & collection
7. `customer-service` - Complaints/inquiries
8. `returns` - RMA processing

### Procure-to-Pay (Extended)

1. `procurement` - Sourcing
2. `contract-mgmt` - Procurement contracts
3. `purchasing` - PO creation
4. `receiving` - Goods receipt
5. `payables` - Invoice & payment
6. `rebates` - Supplier rebates

### Record-to-Report (Enhanced)

1. `accounting` - Transaction recording
2. `intercompany` - Consolidation
3. `budgeting` - Budget vs actual
4. `financial-close` - **NEW** Close operations
5. `regulatory-reporting` - Filings
6. `document-mgmt` - **NEW** Audit evidence

### Design-to-Manufacture (NEW)

1. `plm` - **NEW** Engineering change
2. `inventory` - BOM management
3. `planning` - MRP/MPS
4. `production` - Manufacturing
5. `quality-mgmt` - Quality control

### Import-to-Pay (NEW)

1. `purchasing` - PO to supplier
2. `trade-compliance` - **NEW** Customs clearance
3. `receiving` - Goods receipt
4. `payables` - Landed cost invoice

---

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)

**Priority:** Master data, document management, access governance

1. `mdm` - Master Data Management
2. `document-mgmt` - Document Management
3. `access-governance` - Access Governance

**Rationale:** Foundation for all other domains

---

### Phase 2: Financial Excellence (Weeks 3-4)

**Priority:** Close operations, rebates, lease accounting

4. `financial-close` - Financial Close Management
5. `rebates` - Rebates & Trade Promotions
6. `lease-accounting` - Lease Accounting

**Rationale:** Finance team pain points, compliance

---

### Phase 3: Commercial Operations (Weeks 5-6)

**Priority:** Pricing, contracts, customer service

7. `pricing` - Pricing Management
8. `contract-mgmt` - Contract Lifecycle
9. `customer-service` - Customer Service

**Rationale:** Revenue optimization, customer experience

---

### Phase 4: Operations Excellence (Weeks 7-8)

**Priority:** EAM, PLM, returns, trade

10. `asset-mgmt` - Enterprise Asset Management
11. `plm` - Product Lifecycle Management
12. `returns` - Returns & Reverse Logistics
13. `trade-compliance` - Trade & Customs

**Rationale:** Operational efficiency, global operations

---

## Dependencies & Integration

### Cross-Domain Dependencies

**Master Data Management (mdm)**

- Provides golden records to: ALL packages
- Consumes from: workflow (approval), document-mgmt (attachments)

**Financial Close (financial-close)**

- Depends on: accounting, budgeting, intercompany, treasury
- Triggers: regulatory-reporting, document-mgmt (evidence)

**Rebates (rebates)**

- Depends on: sales, crm, purchasing, accounting
- Integrates with: pricing, contract-mgmt

**Customer Service (customer-service)**

- Depends on: sales, shipping, quality-mgmt
- Triggers: returns, document-mgmt (case attachments)

**Returns (returns)**

- Depends on: sales, warehouse, inventory, quality-mgmt
- Integrates with: customer-service, accounting (refunds)

**Contract Management (contract-mgmt)**

- Depends on: sales, procurement, crm
- Integrates with: pricing, rebates, receivables, payables

**PLM (plm)**

- Depends on: inventory (BOM), production (routing)
- Integrates with: quality-mgmt, purchasing

**Trade Compliance (trade-compliance)**

- Depends on: shipping, inventory, accounting
- Integrates with: receivables, payables (landed cost)

---

## Benefits & Business Value

### Financial Impact

- **Rebates:** Prevent revenue leakage, accurate accruals (margins +2-5%)
- **Financial Close:** Reduce close time 50% (from 10 days to 5 days)
- **Pricing:** Optimize pricing strategy, protect margins (+1-3% margin)
- **Lease Accounting:** ASC 842 compliance, avoid audit findings

### Operational Impact

- **MDM:** Reduce duplicate records 90%, improve data quality
- **EAM:** Increase uptime 15%, reduce emergency repairs 30%
- **PLM:** Reduce engineering change cycle time 50%
- **Returns:** Improve recovery rate 20%, reduce waste

### Customer Impact

- **Customer Service:** Improve CSAT +15%, reduce case volume 20%
- **Contract Management:** Reduce contract cycle time 40%
- **Returns:** Faster RMA processing, better warranty experience

### Compliance Impact

- **Trade Compliance:** Avoid customs delays, accurate duty calculations
- **Access Governance:** SOX compliance, pass audits
- **Document Management:** Audit-ready evidence, retention compliance
- **Lease Accounting:** ASC 842/IFRS 16 compliance

---

## Architecture Principles (Maintained)

All new packages follow existing standards:

✅ **5 service files per package**\
✅ **Zod validation for all functions**\
✅ **Result<T> for error handling**\
✅ **Pure domain logic (no side effects)**\
✅ **ESM module format**\
✅ **Explicit dependencies via package.json**\
✅ **Public API via index.ts exports**

---

## Competitive Positioning

With these additions, afenda NEXUS will have **enterprise ERP coverage**
comparable to:

- **SAP S/4HANA** (master data, close management, rebates, EAM, trade)
- **Oracle Cloud ERP** (financial close, contract lifecycle, PLM)
- **Microsoft Dynamics 365** (customer service, pricing, access governance)
- **NetSuite** (document management, returns, lease accounting)

**Differentiator:** Modern tech stack (TypeScript, Serverless, AI-ready) with
enterprise domain completeness.

---

## Risks & Mitigations

### Risk 1: Scope Creep

**Mitigation:** Phased implementation, strict 5-service limit per package

### Risk 2: Dependency Complexity

**Mitigation:** Dependency graph validation (existing tooling), explicit
package.json deps

### Risk 3: Resource Constraints

**Mitigation:** Prioritize Phase 1 (foundation) and Phase 2 (finance), defer
operations packages

### Risk 4: Integration Complexity

**Mitigation:** Event-driven architecture already in place (integration-hub),
use domain events

---

## Success Metrics

### Code Quality

- 44 domain packages (100% coverage)
- 220 service files (+65)
- 440+ business functions (+130)
- 0 circular dependencies
- 100% type-safe

### Business Impact (12 months)

- Close cycle time: 10 days → 5 days
- Data quality score: 75% → 95%
- Customer CSAT: 3.8 → 4.5
- Equipment uptime: 85% → 92%
- Margin realization: +2.5%

---

## Conclusion

The current 31-package architecture provides **strong classic ERP coverage**.
Adding these **13 strategic packages** transforms afenda NEXUS into a **complete
enterprise ERP platform** with:

1. **Governance Foundation** (MDM, document management, access governance)
2. **Financial Excellence** (close management, rebates, lease accounting)
3. **Commercial Operations** (pricing, contracts, customer service)
4. **Operations Excellence** (EAM, PLM, returns, trade compliance)

This positions afenda NEXUS to compete with tier-1 ERP vendors while maintaining
modern architecture and developer experience advantages.

---

**Next Steps:**

1. Review and approve package scope
2. Prioritize implementation phases
3. Begin Phase 1 development (foundation packages)
4. Update BUSINESS_DOMAIN_ARCHITECTURE.md with complete 44-package view

---

**Document Owner:** Enterprise Architecture\
**Stakeholders:** Finance, Operations, IT, Product\
**Review Date:** February 17, 2026
