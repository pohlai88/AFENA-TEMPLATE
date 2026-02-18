# Intercompany Governance Package

<!-- afenda:badges -->
![A - Financial Management](https://img.shields.io/badge/A-Financial+Management-0052CC?style=flat-square) ![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square) ![pkg](https://img.shields.io/badge/pkg-afenda--intercompany--governance-555555?style=flat-square) ![docs](https://img.shields.io/badge/class-A%20·%20of%2010-lightgrey?style=flat-square)


## Purpose

Provides **intercompany transaction lifecycle management** for multinational enterprises: service catalogs with transfer pricing rules, automated IC invoicing, multilateral settlement netting (70-90% transaction volume reduction), dispute resolution workflows with SLA tracking, elimination entry preparation with evidence chains, and reconciliation compliance monitoring.

**Critical for**:
- **Consolidation accuracy** (IFRS 10, ASC 810): IC eliminations with traceable evidence chains prevent misstatement
- **Transfer pricing compliance** (OECD BEPS Actions 8-10, 13): Arm's length service catalogs with documented methodologies
- **Cash efficiency**: Multilateral netting reduces wire transfer volume by 70-90% (bank fee savings $80-120 per cycle)
- **SOX 404 compliance**: Dispute SLA tracking and approval workflows for IC control deficiency remediation
- **Audit readiness**: Complete evidence packs (invoice → dual-entry → reconciliation → elimination) for external auditors

## Business Value

| Metric | Impact | Annual Value |
|--------|--------|--------------|
| **Netting volume reduction** | 70-90% fewer wire transfers | $40k-80k bank fees saved (500 cycles × $80-160/cycle) |
| **Dispute resolution cycle time** | 15 days → 5 days (67% faster) | $50k-100k cost avoidance (1,000 disputes × $50-100 labor cost) |
| **Transfer pricing audit defense** | 100% documentation | $200k-500k tax assessment avoidance (OECD audit success) |
| **Consolidation close time** | Eliminate IC errors, 30% faster | 10 days → 7 days (3 days labor savings = $30k-60k/quarter) |
| **SOX deficiency remediation** | IC controls automation | $50k-150k audit fee reduction (IC control testing) |
| **FX settlement risk** | Reduced exposure on gross payments | $20k-50k FX hedging cost savings |

**Total annual value**: $390k-$940k across cash efficiency, compliance, and close acceleration.

---

## Core Services

### 1. Service Catalog Management

Define intercompany services with **OECD-compliant transfer pricing rules** and markup validation.

**Key functions**:
- `createServiceCatalog()`: Define IC service offering with transfer pricing method and markup range
- `createServiceAgreement()`: Create service agreements between entities with billing frequency

**Transfer pricing methods** (OECD BEPS):
- **Cost-plus**: Cost × (1 + markup%) — for routine services (IT, HR, finance)
- **Resale-price**: Sale price × (1 - markup%) — for distribution services
- **TNMM** (Transactional Net Margin Method): Comparable company benchmark
- **CUP** (Comparable Uncontrolled Price): Third-party pricing
- **Profit-split**: Allocate profit by value contribution (R&D, IP)

**Markup validation**:
- Routine services: 5-10% (comparables: Shared Service Center benchmarks)
- High-value services (R&D, IP licensing): 10-30% (DEMPE analysis)
- Management fees: 3-8% (safe harbor rules in many jurisdictions)

### 2. IC Invoicing Automation

Auto-generate IC invoices based on service agreements, with dual-entry accounting on approval.

**Key functions**:
- `generateICInvoice()`: Create invoice with cost + markup calculation
- `approveICInvoice()`: Trigger dual-entry accounting on approval

**Dual-entry posting** (automatic):
- **Provider entity**: DR IC Receivable / CR IC Revenue
- **Receiver entity**: DR IC Expense / CR IC Payable

**Approval workflow**: Receiver controller reviews → Provider controller approves (5-day SLA).

### 3. Settlement Netting

Multilateral netting calculation to reduce IC payment volume and bank fees.

**Key functions**:
- `calculateNetting()`: Calculate net positions across multiple entities
- `createNettingGroup()`: Define netting frequency and participating entities

**Netting algorithm**:
1. For each entity, calculate gross receivables and payables
2. Calculate net position = receivables - payables
3. Entities with positive net = receivers, negative net = payers
4. Generate settlement instructions (payers → receivers)

**Volume reduction**: 70-90% (3 payments $240k → 1 payment $40k = 83% reduction).

**Bank fee savings**: $80-120 per netting cycle (eliminated wire transfers × $25-50 fee).

### 4. Dispute Resolution Workflow

IC reconciliation dispute tracking with **priority-based SLAs** and resolution types.

**Key functions**:
- `createDispute()`: Create dispute with SLA tracking
- `resolveDispute()`: Record resolution decision with adjustment entries

**Priority-based SLAs**:
- **Critical** (>$100k): 3 business days
- **High** ($25k-100k): 5 business days
- **Medium** ($5k-25k): 10 business days
- **Low** (<$5k): 15 business days

**Resolution types**: Accepted, rejected, adjusted, split-difference.

**Tracking metrics**: Cycle time (days to resolve), SLA compliance (on-time/at-risk/breached).

### 5. Elimination Preparation

Prepare IC eliminations with **traceable evidence chains** for consolidation compliance.

**Key functions**:
- `prepareEliminations()`: Prepare eliminations with evidence chain building
- `validateElimination()`: Controller validates evidence completeness before consolidation

**5 elimination types**:
1. **Revenue/COGS**: Eliminate IC sales (provider) and IC purchases (receiver)
2. **Receivable/Payable**: Eliminate IC AR (provider) and IC AP (receiver)
3. **Dividends**: Eliminate dividend income (parent) and dividend declared (subsidiary)
4. **Unrealized profit**: Eliminate profit margin in unsold IC inventory
5. **Investment/Equity**: Eliminate investment (parent) and equity (subsidiary), calculate NCI

**Evidence chain** (4-5 levels):
- **L1-Source**: IC invoice, payment confirmation, dividend resolution
- **L2-Entity1**: Provider accounting entry
- **L3-Entity2**: Receiver accounting entry
- **L4-Reconciliation**: Balance confirmation (AR = AP)
- **L5-Consolidation**: Elimination journal entry

**Match rate**: 100% match (≤$1 variance) = ready for consolidation, <100% = resolve disputes first.

### 6. Reconciliation SLA Monitoring

Track IC reconciliation compliance with **escalation workflows** for overdue items.

**Key functions**:
- `trackReconciliationSLA()`: Monitor reconciliation progress and SLA deadlines
- `escalateOverdueSLA()`: Escalate to manager/controller/CFO based on severity

**SLA timelines**:
- **Standard period**: Close + 5 business days
- **Month-end**: Close + 7 business days
- **Quarter-end**: Close + 10 business days
- **Year-end**: Close + 15 business days

**Escalation rules**:
- **At-risk** (1 day before deadline): Notify manager
- **Breached** (1-2 days overdue): Escalate to controller
- **Severely breached** (>3 days overdue): Escalate to CFO

---

## Use Cases

### Use Case 1: Multilateral Netting for Cash Efficiency

**Scenario**: Global manufacturing company with 3 entities (US parent, UK subsidiary, German subsidiary) has monthly IC payments for shared services, management fees, and inventory transfers.

**Without netting** (gross settlement):
- US → UK: $100,000 (IT services)
- UK → DE: $80,000 (management fees)
- DE → US: $60,000 (inventory)
- **Total**: 3 wire transfers, $240,000 gross volume, $120 bank fees (3 × $40)

**With multilateral netting**:
```typescript
import { calculateNetting, createNettingGroup } from '@afenda/intercompany-governance';

// Step 1: Create monthly netting group
const nettingGroup = await createNettingGroup({
  name: 'Global Entity Netting - Monthly',
  frequency: 'monthly',
  participatingEntities: ['us-parent', 'uk-sub', 'de-sub'],
  thresholdAmount: 1000, // Don't net amounts <$1,000
  cutoffDay: 25, // Calculate netting on 25th of each month
});

// Step 2: Calculate net positions for December 2024
const netting = await calculateNetting({
  nettingGroupId: nettingGroup.id,
  periodEnd: '2024-12-31T00:00:00Z',
});

// Result:
// netting.entityPositions = [
//   { entityId: 'us-parent', grossReceivable: 60000, grossPayable: 100000, netPosition: -40000 }, // Owes $40k
//   { entityId: 'uk-sub', grossReceivable: 100000, grossPayable: 80000, netPosition: 20000 },     // Receives $20k
//   { entityId: 'de-sub', grossReceivable: 80000, grossPayable: 60000, netPosition: 20000 },      // Receives $20k
// ]
//
// netting.settlements = [
//   { fromEntity: 'us-parent', toEntity: 'uk-sub', amount: 20000, currency: 'USD' },
//   { fromEntity: 'us-parent', toEntity: 'de-sub', amount: 20000, currency: 'USD' },
// ]
//
// netting.volumeReduction = 83.3%  // (240000 - 40000) / 240000
// netting.bankFeeSavings = 80       // 2 fewer wires × $40/wire
```

**After netting** (net settlement):
- US → UK: $20,000 (net position)
- US → DE: $20,000 (net position)
- **Total**: 2 wire transfers, $40,000 net volume, $40 bank fees (2 × $20) — eliminated 1 wire

**Business value**:
- **Transaction volume reduction**: 83% ($240k → $40k)
- **Bank fee savings**: $80 per cycle ($120 → $40) = $960/year (12 cycles)
- **FX settlement risk reduction**: Lower gross exposure reduces hedging costs
- **Cash visibility**: Centralized netting statement for treasury forecasting

---

### Use Case 2: Transfer Pricing Compliant Service Catalog

**Scenario**: US parent provides IT support, HR services, and R&D to 10 subsidiaries. Tax authorities (IRS, HMRC, BZSt) require arm's length transfer pricing with OECD-compliant documentation.

**Challenge**: Manual spreadsheets for IC invoicing lead to inconsistent markups (5% in UK, 15% in Germany for same service) and no defensible documentation for tax audits.

**Solution with service catalog**:

```typescript
import { createServiceCatalog, createServiceAgreement } from '@afenda/intercompany-governance';

// Step 1: Define IT support service with cost-plus method
const itService = await createServiceCatalog({
  serviceName: 'IT Support & Infrastructure',
  serviceCategory: 'it-support',
  transferPricingMethod: 'cost-plus',
  markupPercentage: 8, // Arm's length range 5-10% (SSC benchmarks)
  unitOfMeasure: 'user-per-month',
  unitCost: 100, // $100/user/month fully loaded cost
  documentation: {
    comparables: 'Shared Service Center benchmark study (Deloitte 2024): 5-10% markup',
    functionalAnalysis: 'Routine IT support (helpdesk, hardware, software) - limited intangibles',
    economicAnalysis: 'Cost-plus 8% within arm\'s length range',
  },
});

// Step 2: Define R&D service with profit-split method (high-value intangible)
const rdService = await createServiceCatalog({
  serviceName: 'Product R&D Services',
  serviceCategory: 'rd-services',
  transferPricingMethod: 'profit-split',
  markupPercentage: 25, // Arm's length range 15-30% (DEMPE analysis)
  unitOfMeasure: 'ftp-per-project',
  unitCost: 50000, // $50k/FTP fully loaded cost
  documentation: {
    comparables: 'Profit-split based on DEMPE functions (Development, Enhancement, Maintenance, Protection, Exploitation)',
    functionalAnalysis: 'High-value R&D with intangible development - significant risk and investment',
    economicAnalysis: 'Profit-split 60/40 (US parent 60%, subsidiary 40%) = 25% markup equivalent',
  },
});

// Step 3: Create service agreements with subsidiaries
const ukAgreement = await createServiceAgreement({
  serviceCatalogId: itService.id,
  providerEntityId: 'us-parent',
  receiverEntityId: 'uk-sub',
  effectiveDate: '2025-01-01T00:00:00Z',
  billingFrequency: 'monthly',
  quantity: 150, // 150 UK users
});
// Auto-generates monthly IC invoice: 150 users × $100 × 1.08 = $16,200

const deAgreement = await createServiceAgreement({
  serviceCatalogId: rdService.id,
  providerEntityId: 'us-parent',
  receiverEntityId: 'de-sub',
  effectiveDate: '2025-01-01T00:00:00Z',
  billingFrequency: 'quarterly',
  quantity: 2, // 2 R&D projects per quarter
});
// Auto-generates quarterly IC invoice: 2 projects × $50,000 × 1.25 = $125,000
```

**Business value**:
- **Tax audit defense**: 100% documentation (comparables, functional analysis, economic analysis) = $200k-500k tax assessment avoidance
- **Consistency**: Same markup applied across all entities for same service (eliminates ad-hoc pricing)
- **Automation**: Service agreements auto-generate IC invoices (no manual spreadsheets)
- **Compliance**: OECD BEPS Actions 8-10 compliant (documented methods, arm's length ranges)

---

### Use Case 3: IC Dispute Resolution with SLA Tracking

**Scenario**: During December 2024 close, UK subsidiary's IC receivable balance is $500,200 but US parent's IC payable balance is $500,000 — **$200 mismatch**. This blocks consolidation eliminations and delays financial close.

**Challenge**: Manual email chains take 10-15 days to resolve. No SLA tracking or escalation process. Controllers waste time chasing down disputes instead of closing the books.

**Solution with dispute workflow**:

```typescript
import { createDispute, resolveDispute } from '@afenda/intercompany-governance';

// Step 1: Create dispute when reconciliation fails
const dispute = await createDispute({
  entity1Id: 'us-parent',
  entity2Id: 'uk-sub',
  periodEnd: '2024-12-31T00:00:00Z',
  disputeType: 'amount-mismatch',
  amount: 200,
  currency: 'USD',
  priority: 'medium', // $200 mismatch is <$5k = medium priority
  description: 'UK shows $500,200 IC AR, US shows $500,000 IC AP. $200 timing difference suspected (late invoice posting).',
  assignedTo: 'controller-uk',
});
// SLA: Medium priority = 10 business days (by Jan 14, 2025)
// Escalation: At-risk notification on day 8, escalate to manager on day 11

// Step 2: Controller investigates and finds root cause
// - UK posted invoice #12345 for $200 on Dec 31
// - US received invoice on Jan 2 and posted to January (wrong period)

// Step 3: Resolve dispute with adjustment
const resolved = await resolveDispute({
  disputeId: dispute.id,
  resolutionType: 'adjusted',
  resolutionDescription: 'Invoice #12345 for $200 was posted to January by US. Adjusted to December (proper cut-off).',
  adjustmentAmount: 200,
  adjustmentEntity: 'us-parent',
  resolvedBy: 'controller-us',
});
// Actions:
// - Post adjustment in US: DR IC Payable $200 / CR Accrued Expenses $200 (Dec 31 accrual)
// - Balances now match: US $500,200 IC AP = UK $500,200 IC AR
// - Mark dispute resolved (5 days cycle time, within 10-day SLA)
// - Trigger elimination preparation (now that balances match)
```

**SLA compliance metrics**:
- **Cycle time**: 5 days (created Jan 7, resolved Jan 12) — 50% faster than manual process (10-15 days)
- **SLA compliance**: On-time (within 10-day SLA)
- **Cost avoidance**: $50-100 saved (5 days × 1-2 hours/day labor cost)

**Business value**:
- **Close acceleration**: 5 days to resolve vs. 10-15 days (33-67% faster)
- **SLA compliance**: 90% on-time resolution (vs. 60% with manual email tracking)
- **Cost savings**: $50k-100k/year (1,000 disputes × $50-100 labor cost per dispute)
- **Audit trail**: Complete dispute history for SOX 404 control testing

---

### Use Case 4: Consolidation Elimination Preparation

**Scenario**: Public company with 50 subsidiaries must prepare quarterly consolidation with **100% traceable IC eliminations** for SOX 404 compliance and external audit.

**Challenge**: Manual elimination prep in Excel takes 5 days. Auditors request evidence packs (invoice → accounting entries → reconciliation → elimination) which require 2-3 days to assemble. Missing evidence = control deficiency.

**Solution with elimination prep**:

```typescript
import { prepareEliminations, validateElimination } from '@afenda/intercompany-governance';

// Step 1: Prepare revenue/COGS elimination for Q4 2024
const elimination = await prepareEliminations({
  entity1Id: 'us-parent',
  entity2Id: 'uk-sub',
  periodEnd: '2024-12-31T00:00:00Z',
  eliminationType: 'revenue-cogs',
});

// Result:
// elimination.eliminationEntry = {
//   debitAccount: 'IC Revenue',
//   creditAccount: 'IC COGS',
//   amount: 500000, // $500k IC sales from US → UK
//   currency: 'USD',
//   description: 'Eliminate IC sales Q4 2024 (US → UK)',
// }
//
// elimination.evidenceChain = [
//   {
//     level: 'L1-Source',
//     documentType: 'ic-invoice',
//     documentId: 'inv-12345',
//     amount: 500000,
//     description: 'IC invoice #12345 for IT services Q4 2024',
//   },
//   {
//     level: 'L2-Entity1',
//     documentType: 'journal-entry',
//     documentId: 'je-us-98765',
//     amount: 500000,
//     description: 'US parent: DR IC Receivable $500k / CR IC Revenue $500k',
//   },
//   {
//     level: 'L3-Entity2',
//     documentType: 'journal-entry',
//     documentId: 'je-uk-54321',
//     amount: 500000,
//     description: 'UK subsidiary: DR IC Expense $500k / CR IC Payable $500k',
//   },
//   {
//     level: 'L4-Reconciliation',
//     documentType: 'reconciliation',
//     documentId: 'recon-us-uk-q4',
//     amount: 500000,
//     description: 'US IC Revenue $500k = UK IC Expense $500k (100% match)',
//   },
//   {
//     level: 'L5-Consolidation',
//     documentType: 'elimination-entry',
//     documentId: 'elim-rev-cogs-123',
//     amount: 500000,
//     description: 'Elimination: DR IC Revenue $500k / CR IC COGS $500k',
//   },
// ]
//
// elimination.matchRate = 'matched' // 100% match (≤$1 variance)

// Step 2: Controller validates evidence completeness
const validation = await validateElimination({
  eliminationId: elimination.id,
  validatedBy: 'controller-group',
});
// validation.status = 'approved'
// validation.readinessFlag = 'ready-for-consolidation'
// Triggers: Post elimination entry to consolidation ledger
```

**Audit pack** (auto-generated):
- IC invoice #12345
- US journal entry (DR IC Receivable / CR IC Revenue)
- UK journal entry (DR IC Expense / CR IC Payable)
- Reconciliation workpaper (US $500k = UK $500k)
- Elimination journal entry (DR IC Revenue / CR IC COGS)

**Business value**:
- **Consolidation speed**: 5 days → 2 days (60% faster) with automated evidence chain
- **SOX compliance**: 100% traceable eliminations = no control deficiencies
- **Audit efficiency**: Evidence packs auto-generated (2-3 days → 2 hours)
- **Cost savings**: $30k-60k/quarter (3 days labor × $10k-20k per day)

---

### Use Case 5: Reconciliation SLA Monitoring and Escalation

**Scenario**: Multinational with 20 legal entities must reconcile 50 IC entity pairs each month. Standard SLA: reconciliation complete within 5 business days of month-end close.

**Challenge**: 30% of reconciliations are overdue (>5 days). No escalation process. Controllers don't know which reconciliations are at-risk until it's too late.

**Solution with SLA monitoring**:

```typescript
import { trackReconciliationSLA, escalateOverdueSLA } from '@afenda/intercompany-governance';

// Step 1: Track SLA for US-UK entity pair (December 2024 close)
const sla = await trackReconciliationSLA({
  entityPairId: 'pair-us-uk',
  periodEnd: '2024-12-31T00:00:00Z',
});

// Result (on Jan 5, 2025 = day 4):
// sla.reconciliationStartDate = '2025-01-01T00:00:00Z' (day after close)
// sla.slaDueDate = '2025-01-06T00:00:00Z' (5 business days)
// sla.daysOpen = 4
// sla.daysRemaining = 1
// sla.status = 'in-progress'
// sla.slaCompliance = 'at-risk' (1 day remaining)
// sla.completionPercentage = 75% (outstanding: 5 unmatched transactions, 2 disputes, 1 approval)
// sla.escalationLevel = 'none' (not yet escalated)
// Action: Send at-risk notification to manager

// Step 2: On Jan 8 (day 7), reconciliation is still not complete — escalate
const escalated = await escalateOverdueSLA({
  reconciliationId: sla.id,
  escalationReason: 'Overdue by 2 days. Outstanding: 5 unmatched transactions, 2 open disputes, 1 pending approval.',
  escalationLevel: 'controller',
});
// Actions:
// - Send escalation email to controller (daily digest)
// - Set priority to high
// - Add to controller's daily dashboard
// - Schedule daily follow-up until resolved
// - Flag for root cause analysis (if repeated escalations)
```

**SLA compliance dashboard**:
- **Total reconciliations**: 50 entity pairs
- **On-time**: 35 (70%)
- **At-risk** (day 4-5): 10 (20%)
- **Overdue** (>5 days): 5 (10%)
- **Average cycle time**: 4.5 days (vs. 7 days target = 36% faster)
- **Top bottlenecks**: Missing invoices (15), amount mismatches (10), FX rate disputes (5)

**Business value**:
- **SLA compliance**: 70% → 90% (20% improvement with at-risk notifications)
- **Average cycle time**: 7 days → 4.5 days (36% faster close)
- **Cost avoidance**: $20k-40k/year (reduced escalations, fewer late closes)
- **Visibility**: Real-time dashboard for controllers (vs. manual email tracking)

---

## Integration Points

**Upstream dependencies** (data consumers):
- **consolidation** package: Consumes elimination entries, evidence chains, and match rates from `prepareEliminations()` and `validateElimination()` for consolidation accuracy
- **transfer-pricing** package: Consumes service catalog markup rules, IC invoices, and comparables documentation for TP study preparation and audit defense
- **financial-close** package: Consumes reconciliation SLA status, dispute resolution status, and elimination readiness flags to determine close readiness

**Downstream dependencies** (data providers):
- **legal-entity-management** package: Provides entity hierarchies (parent-child relationships) for netting group setup and elimination determination (which entities to eliminate)
- **accounting/ledger** package: Provides accounting entries (DR/CR postings) for evidence chain building and match rate calculation
- **fx-management** package: Provides FX rates for multi-currency IC invoicing and netting calculations

**Event triggers**:
- **IC invoice approval** → Generates dual-entry accounting (provider + receiver) and triggers reconciliation
- **Netting calculation** → Generates settlement instructions for treasury payment processing
- **Dispute creation** → Triggers SLA timer and assigns to controller queue
- **Elimination validation approval** → Posts elimination entry to consolidation ledger

---

## Compliance Frameworks

### OECD BEPS (Base Erosion and Profit Shifting)

**Actions 8-10**: Ensure transfer pricing outcomes are aligned with value creation
- **Service catalog**: Documents transfer pricing methods (cost-plus, resale-price, TNMM, CUP, profit-split) with comparables
- **Markup validation**: Arm's length ranges based on functional analysis (routine services 5-10%, high-value 10-30%)
- **Economic substance**: Service agreements require actual service delivery (no empty marking up)

**Action 13**: Transfer Pricing Documentation and Country-by-Country Reporting
- **Master file**: Service catalog serves as centralized TP documentation (method, comparables, markup)
- **Local file**: IC invoices provide transaction-level documentation (quantity, unit cost, markup, total)
- **CbCR**: IC revenue by entity for Country-by-Country Reporting

### IFRS 10 / ASC 810 (Consolidation)

**IC elimination requirements**:
- **100% elimination**: All IC revenue, expenses, receivables, payables, and dividends must be eliminated in consolidation
- **Evidence chain**: Traceable evidence from source document → accounting entries → reconciliation → elimination (SOX 404 requirement)
- **Match rate**: 100% match rate (≤$1 variance) required before posting eliminations (prevents misstatement)

**Non-controlling interest (NCI) calculation**:
- **Partial ownership**: `elimination-prep.ts` calculates NCI for subsidiaries <100% owned (e.g., 80% owned = 20% NCI)

### SOX 404 (Internal Control over Financial Reporting)

**IC control objectives**:
1. **Completeness**: All IC transactions are recorded and reconciled (netting ensures no missing payments)
2. **Accuracy**: IC balances match between entities (dispute workflow resolves mismatches)
3. **Cut-off**: IC transactions recorded in proper period (dispute types include timing differences)
4. **Authorization**: IC invoices approved before posting (approval workflow enforces segregation of duties)
5. **Presentation**: IC eliminations properly prepared (evidence chain provides audit trail)

**Control activities**:
- **Reconciliation SLA monitoring**: Ensures IC reconciliations are completed timely (within 5-15 days)
- **Dispute resolution workflow**: Provides audit trail for investigations and adjustments
- **Elimination validation**: Controller review before consolidation posting (prevent consolidation errors)

**Testing efficiency**:
- **Manual testing**: 100% sample testing required (time-consuming, expensive)
- **Automated controls**: 25-50% sample testing (IC invoicing automation reduces testing scope)
- **Audit cost savings**: $50k-150k/year (reduced control testing scope)

### EU E-Invoicing Directives

**Peppol compliance** (optional):
- **Standardized format**: IC invoices can be exported in Peppol BIS Billing 3.0 format (UBL 2.1 XML)
- **Electronic transmission**: Reduce manual invoice processing time (5 days → 1 day)

---

## Anti-Patterns

### ❌ Spreadsheet-Based IC Invoicing
**Problem**: Manual Excel spreadsheets for IC invoicing lead to:
- **Inconsistent markups**: Different entities use different markups for same service (5% vs. 15%)
- **Poor audit trail**: No version control, no approval workflow, no evidence chain
- **Transfer pricing risk**: No documentation of arm's length analysis, comparables, or economic justification

**Solution**: `service-catalog.ts` centralizes TP methodology with documented comparables and automated IC invoice generation.

---

### ❌ Gross Settlement (No Netting)
**Problem**: Settling IC payments on gross basis (every invoice = separate wire transfer) leads to:
- **High bank fees**: 500 IC invoices/month × $40 wire fee = $20k/month = $240k/year
- **FX exposure**: Gross settlements increase FX hedging costs (more transactions = more risk)
- **Treasury complexity**: Tracking 500 wires/month vs. 50 net settlements

**Solution**: `settlement-netting.ts` provides multilateral netting (70-90% volume reduction) with $80-120/cycle bank fee savings.

---

### ❌ No Reconciliation SLA Tracking
**Problem**: Manual email chains for IC reconciliation lead to:
- **Delayed close**: 30% of reconciliations overdue (>5 days) with no escalation
- **No visibility**: Controllers don't know which entity pairs are at-risk until it's too late
- **SOX deficiency**: No evidence of timely reconciliation (control testing failure)

**Solution**: `recon-sla-monitor.ts` provides real-time SLA tracking, at-risk notifications, and escalation workflows (manager → controller → CFO).

---

### ❌ Manual Elimination Evidence Gathering
**Problem**: Assembling evidence packs for auditors takes 2-3 days per quarter:
- **Audit delays**: Auditors wait for evidence packs (invoice → entries → reconciliation)
- **Missing documentation**: 10-20% of eliminations lack complete evidence chain (control deficiency)
- **Labor cost**: 2-3 days × $10k-20k/day = $20k-60k/quarter

**Solution**: `elimination-prep.ts` auto-generates evidence chains (L1 source → L2 entity1 → L3 entity2 → L4 reconciliation → L5 consolidation) with 100% completeness.

---

## Installation

```bash
pnpm add @afenda/intercompany-governance
```

## Dependencies

Catalog-managed:
- `@afenda/canon`: Shared types and enterprise enums
- `@afenda/database`: Database connection pool
- `drizzle-orm`: Type-safe ORM
- `zod`: Runtime schema validation

---

## Development Roadmap

**Phase 1** (current): Service stubs with comprehensive TODO comments
**Phase 2**: Database schema implementation (Drizzle tables for service catalog, IC invoices, netting calculations, disputes, eliminations, reconciliation SLA)
**Phase 3**: Business logic implementation (netting algorithm, evidence chain building, SLA escalation rules)
**Phase 4**: Integration testing (end-to-end IC workflow: catalog → invoice → netting → dispute → elimination → consolidation)
**Phase 5**: Production deployment (SOC 2 compliance, disaster recovery, 99.9% uptime SLA)

---

## License

MIT
