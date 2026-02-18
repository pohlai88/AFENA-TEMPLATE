# Revenue Recognition (afenda-revenue-recognition)

<!-- afenda:badges -->
![A - Financial Management](https://img.shields.io/badge/A-Financial+Management-0052CC?style=flat-square) ![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square) ![pkg](https://img.shields.io/badge/pkg-afenda--revenue--recognition-555555?style=flat-square) ![docs](https://img.shields.io/badge/class-A%20·%20of%2010-lightgrey?style=flat-square)


**ASC 606 / IFRS 15 revenue recognition with performance obligation allocation, SSP analysis, and deferred revenue management.**

---

## Purpose

This package implements **ASC 606** (US GAAP) and **IFRS 15** (International) revenue recognition standards, addressing the 5-step model:

1. **Identify the contract** with a customer
2. **Identify performance obligations** in the contract
3. **Determine the transaction price**
4. **Allocate the transaction price** to performance obligations
5. **Recognize revenue** when (or as) performance obligations are satisfied

Critical for:
- **SaaS / subscription businesses** (multi-year contracts, multiple deliverables)
- **Software companies** (perpetual license + maintenance + services)
- **IPO readiness** (SEC scrutiny on revenue recognition)
- **Contract manufacturers** (percentage-of-completion)
- **Professional services** (time-based, milestone-based)

---

## When to Use

- **Multi-element arrangements**: Software + support + training in one contract
- **Subscription revenue**: Recognize revenue over subscription period (monthly/annual)
- **Deferred revenue**: Track unearned revenue for future performance
- **Variable consideration**: Estimate discounts, rebates, refunds
- **Contract modifications**: Handle upgrades, downgrades, renewals
- **Point-in-time vs. over-time**: Distinguish delivery models

---

## Key Concepts

### Performance Obligations (POs)

Distinct goods/services promised in a contract. Examples:
- SaaS subscription (over time)
- Professional services (over time)
- Software license (point in time)
- Maintenance/support (over time)
- Hardware (point in time)

### Standalone Selling Price (SSP)

The price at which an entity would sell a promised good/service separately. Methods:
- **Adjusted market assessment**: Competitor pricing
- **Expected cost plus margin**: Cost + reasonable markup
- **Residual approach**: Total price minus observable SSPs (only if SSP highly variable)

### Revenue Allocation

Transaction price allocated to POs based on **relative SSP**:
```
PO1 allocation = (SSP_PO1 / Total_SSP) × Transaction_Price
```

### Contract Modifications

Changes to contract scope or price:
- **Separate contract**: New distinct goods at SSP
- **Termination + new contract**: Remaining POs + modification as new contract
- **Cumulative catch-up**: Adjust revenue for change in estimate

---

## Services

### `contract-identifier.ts`

Identifies contracts that meet ASC 606 criteria:
- Commercial substance
- Approved by parties
- Rights and payment terms identified
- Collectability probable

**Example**:
```typescript
const contract = await identifyContract({
    orgId: 'org_123',
    salesOrderId: 'SO-001',
    customerId: 'cust_456',
    approvalDate: '2026-01-15',
    paymentTerms: 'Net 30',
    totalAmount: 120000
});
// → { contractId: 'rev_001', isValid: true, reason: '...' }
```

### `po-analyzer.ts`

Analyzes contracts to identify distinct performance obligations:
- Line-by-line analysis
- Bundling vs. separate POs
- Over-time vs. point-in-time determination

**Example**:
```typescript
const pos = await analyzePerformanceObligations({
    orgId: 'org_123',
    contractId: 'rev_001',
    lineItems: [
        { type: 'software_license', amount: 50000 },
        { type: 'annual_support', amount: 10000 },
        { type: 'training', amount: 5000 }
    ]
});
// → 3 distinct POs
```

### `ssp-calculator.ts`

Calculates standalone selling prices using ASC 606 methods:
- Observable prices (from standalone sales)
- Adjusted market assessment
- Expected cost plus margin
- Residual approach (limited use)

**Example**:
```typescript
const ssp = await calculateSSP({
    orgId: 'org_123',
    productId: 'prod_saas_annual',
    method: 'observable',
    historicalSales: [...],
    marketData: [...]
});
// → { ssp: 12000, confidence: 'high', method: 'observable' }
```

### `allocation-engine.ts`

Allocates transaction price to performance obligations based on relative SSP:

**Example**:
```typescript
const allocation = await allocateTransactionPrice({
    orgId: 'org_123',
    contractId: 'rev_001',
    transactionPrice: 60000, // discounted from $65k list
    performanceObligations: [
        { poId: 'po_1', ssp: 50000 }, // license
        { poId: 'po_2', ssp: 10000 }, // support
        { poId: 'po_3', ssp: 5000 }   // training
    ]
});
// → po_1: 46,154 | po_2: 9,231 | po_3: 4,615 (proportional discount)
```

### `recognition-scheduler.ts`

Schedules revenue recognition based on satisfaction of performance obligations:
- **Point in time**: License delivery, hardware shipment
- **Over time**: Subscription (time-based), services (time/milestone)
- **Percentage of completion**: For long-term contracts

**Example**:
```typescript
const schedule = await scheduleRevenue({
    orgId: 'org_123',
    poId: 'po_2',
    allocatedAmount: 12000,
    pattern: 'time_based',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    frequency: 'monthly'
});
// → 12 monthly entries of $1,000 each
```

### `modification-handler.ts`

Handles contract modifications (scope or price changes):
- Separate contract treatment
- Prospective adjustment
- Cumulative catch-up

**Example**:
```typescript
const modification = await handleModification({
    orgId: 'org_123',
    contractId: 'rev_001',
    modificationType: 'upgrade',
    additionalAmount: 5000,
    newPO: { type: 'premium_support', ssp: 5000 }
});
// → Separate contract (distinct good at SSP)
```

### `deferred-revenue-tracker.ts`

Tracks deferred revenue (contract liability) and revenue recognition:
- Deferred revenue balance
- Revenue waterfall (recognized vs. deferred)
- Unbilled revenue (contract asset)

**Example**:
```typescript
const deferred = await trackDeferredRevenue({
    orgId: 'org_123',
    contractId: 'rev_001',
    asOfDate: '2026-06-30'
});
// → { totalDeferred: 60000, recognized: 30000, unbilled: 5000 }
```

---

## Architecture

### Layer
**Layer 2: Domain Service**

### Dependencies
- `afenda-canon` - Standard types and schemas
- `afenda-database` - Database access (revenue contracts, POs, schedules)
- `afenda-logger` - Structured logging
- `drizzle-orm` - ORM for queries
- `zod` - Runtime validation

### Compliance Mappings
- **ASC 606** (US GAAP): Revenue from Contracts with Customers
- **IFRS 15** (International): Revenue from Contracts with Customers
- **SOX 404**: Revenue recognition internal controls
- **SEC scrutiny**: Material revenue recognition policies (10-K disclosure)

---

## Why This Wins Deals

### IPO Blocker
**"Can you handle ASC 606 revenue recognition for our SaaS business?"**

Companies preparing for IPO face **intense SEC scrutiny** on revenue recognition. Big 4 auditors require:
- Documented SSP analysis
- Proper allocation methodology
- Deferred revenue roll-forward
- Contract modification tracking

**Without ASC 606 compliance**, companies **cannot go public**. This is a deal-breaker for high-growth SaaS companies.

### SaaS Standard
Every SaaS company has:
- Multi-year contracts with annual/monthly billing
- Multiple deliverables (platform + support + services)
- Discounts/promotions (variable consideration)
- Upgrades/downgrades (contract modifications)

SAP, Oracle, NetSuite all have **dedicated revenue recognition modules**. Table stakes for enterprise SaaS.

### Audit Risk
**Manual revenue recognition** = high audit risk:
- Spreadsheet errors
- Inconsistent SSP methodology
- Missing contract modifications
- Deferred revenue reconciliation failures

CFOs want **automated, auditable** revenue recognition with full audit trail.

---

## Usage Example

```typescript
import {
    identifyContract,
    analyzePerformanceObligations,
    calculateSSP,
    allocateTransactionPrice,
    scheduleRevenue,
    trackDeferredRevenue
} from 'afenda-revenue-recognition';

// Step 1: Identify contract
const contract = await identifyContract({
    orgId: 'org_123',
    salesOrderId: 'SO-2026-001',
    customerId: 'cust_saas_co',
    approvalDate: '2026-01-15',
    totalAmount: 60000
});

// Step 2: Identify performance obligations
const pos = await analyzePerformanceObligations({
    orgId: 'org_123',
    contractId: contract.contractId,
    lineItems: [
        { productId: 'prod_license', amount: 50000 },
        { productId: 'prod_support', amount: 10000 }
    ]
});

// Step 3: Calculate SSP for each PO
const sspResults = await Promise.all(
    pos.map(po => calculateSSP({
        orgId: 'org_123',
        productId: po.productId,
        method: 'observable'
    }))
);

// Step 4: Allocate transaction price
const allocation = await allocateTransactionPrice({
    orgId: 'org_123',
    contractId: contract.contractId,
    transactionPrice: 60000,
    performanceObligations: pos.map((po, i) => ({
        poId: po.poId,
        ssp: sspResults[i].ssp
    }))
});

// Step 5: Schedule revenue recognition
for (const po of allocation.allocatedPOs) {
    await scheduleRevenue({
        orgId: 'org_123',
        poId: po.poId,
        allocatedAmount: po.allocatedAmount,
        pattern: po.recognitionPattern,
        startDate: '2026-01-15',
        endDate: '2027-01-14'
    });
}

// Track deferred revenue
const deferred = await trackDeferredRevenue({
    orgId: 'org_123',
    contractId: contract.contractId,
    asOfDate: '2026-06-30'
});
console.log(`Deferred: $${deferred.totalDeferred}`);
```

---

## Future Enhancements

- **Variable consideration**: Estimate discounts, rebates, returns
- **Contract assets**: Right to consideration (unbilled revenue)
- **Contract costs**: Incremental costs to obtain contract (sales commissions)
- **Disclosure automation**: ASC 606 footnote disclosures for 10-K
- **Waterfall reporting**: Revenue recognized by quarter/year
- **Performance obligation library**: Pre-configured POs for common products

---

## References

- [ASC 606 Standard (FASB)](https://www.fasb.org/topic/606)
- [IFRS 15 Standard (IASB)](https://www.ifrs.org/issued-standards/list-of-standards/ifrs-15-revenue-from-contracts-with-customers/)
- [SEC Revenue Recognition Guidance](https://www.sec.gov/oca/acctguide/revrecog.pdf)
- [AICPA Revenue Recognition Guide](https://www.aicpa.org/resources/download/revenue-recognition-guide)
