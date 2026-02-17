# @afenda-procurement

## Purpose

Enterprise procurement and sourcing management for purchase requisitions,
RFQ/RFP processes, vendor qualification, and spend analytics.

## When to Use

- Creating and managing purchase requisitions with approval workflows
- Running competitive bidding (RFQ/RFP) with vendor evaluation
- Qualifying and ranking vendors based on performance criteria
- Managing blanket purchase agreements and call-off orders
- Analyzing spend by category and identifying cost savings opportunities
- Enforcing procurement policies and tracking maverick spend

## Key Concepts

### Requisition Management

Purchase requisitions capture internal purchase needs from employees/departments
before creating formal purchase orders. Requisitions route through approval
chains based on amount thresholds and budget availability.

### Sourcing & RFQ

Request for Quotation (RFQ) processes enable competitive bidding where multiple
vendors submit proposals. Proposals are evaluated using weighted scoring
criteria (price, quality, delivery, terms) to select the optimal supplier.

### Vendor Qualification

Vendors undergo qualification assessments against criteria (financial stability,
quality certifications, capacity, insurance) before being approved as preferred
suppliers. Performance is continuously monitored via scorecards.

### Contract Management

Blanket purchase orders establish long-term agreements with pre-negotiated
pricing and terms. Individual releases (call-offs) are made against the contract
as needed, with compliance tracking against committed spend.

### Spend Analytics

Procurement spend is analyzed across multiple dimensions (category, supplier,
department, GL account) to identify consolidation opportunities, price
benchmarks, and policy violations.

## Dependencies

- **afenda-canon**: Entity type definitions for requisitions, RFQs, vendors,
  contracts
- **afenda-database**: Schema access for procurement tables (requisitions, rfqs,
  vendor_qualifications, contracts)
- **afenda-logger**: Structured logging for procurement events and approval
  workflows
- **afenda-workflow**: Approval routing, escalation, and procurement policy
  enforcement
- **afenda-crm**: Budget enforcement integration for requisition approval
- **drizzle-orm**: Database query builder
- **zod**: Runtime validation for procurement data

## Public API

```typescript
import {
  // Spend analytics
  analyzeSpendByCategory,
  assessVendorPerformance,
  awardRFQ,
  type BidEvaluation,
  consolidateRequisitions,
  // Contract management
  createPurchaseContract,
  // Requisition management
  createRequisition,
  // Sourcing & RFQ
  createRFQ,
  evaluateBids,
  identifySavingsOpportunities,
  // Vendor management
  qualifyVendor,
  rankVendors,
  releaseFromContract,
  // Types
  type RequisitionParams,
  type RFQParams,
  routeForApproval,
  type SpendAnalysis,
  trackContractCompliance,
  trackMaverickSpend,
  type VendorQualification,
} from "afenda-procurement";
```

## Usage Examples

### Create and Route Requisition

```typescript
import { createRequisition, routeForApproval } from "afenda-procurement";
import { db } from "afenda-database";

// Create requisition from employee request
const requisition = await createRequisition(db, orgId, {
  requesterId: "EMP-001",
  department: "DEPT-IT",
  items: [
    {
      productId: "PROD-LAPTOP-001",
      quantity: 5,
      unitPrice: 1200.00,
      description: "Dell Latitude 5430",
      budgetAccountId: "GL-5100-EQUIPMENT",
    },
  ],
  justification: "Replace end-of-life laptops for engineering team",
  requiredByDate: "2026-03-15",
  budgetCheck: true,
});
// Returns: { reqId: 'REQ-2026-00123', status: 'draft', totalAmount: 6000.00 }

// Submit for approval workflow
const workflow = await routeForApproval(db, orgId, {
  reqId: requisition.reqId,
  approvalChain: ["MGR-IT", "DIR-OPS", "CFO"], // Auto-determined by amount
});
// Returns: { workflowId: 'WF-REQ-00123', currentApprover: 'MGR-IT', status: 'pending' }
```

### Run RFQ and Award to Best Bidder

```typescript
import { awardRFQ, createRFQ, evaluateBids } from "afenda-procurement";

// Create RFQ package from consolidated requisitions
const rfq = await createRFQ(db, orgId, {
  reqIds: ["REQ-2026-00123", "REQ-2026-00124"],
  vendors: ["VEND-DELL", "VEND-HP", "VEND-LENOVO"],
  responseDeadline: "2026-02-28T17:00:00Z",
  evaluationCriteria: [
    { criterion: "price", weight: 0.40 },
    { criterion: "delivery", weight: 0.30 },
    { criterion: "warranty", weight: 0.20 },
    { criterion: "payment_terms", weight: 0.10 },
  ],
});
// Returns: { rfqId: 'RFQ-2026-0045', status: 'sent', bidCount: 0 }

// After bid deadline, evaluate proposals
const evaluation = await evaluateBids(db, orgId, {
  rfqId: "RFQ-2026-0045",
  criteria: rfq.evaluationCriteria,
  weights: [0.40, 0.30, 0.20, 0.10],
  bids: [
    { vendorId: "VEND-DELL", scores: [85, 90, 95, 80] },
    { vendorId: "VEND-HP", scores: [90, 85, 90, 85] },
    { vendorId: "VEND-LENOVO", scores: [80, 95, 85, 90] },
  ],
});
// Returns: { rankings: [{ vendorId: 'VEND-DELL', totalScore: 87.5, rank: 1 }, ...] }

// Award to winning vendor
const award = await awardRFQ(db, orgId, {
  rfqId: "RFQ-2026-0045",
  vendorId: "VEND-DELL",
  items: rfq.items,
  createPO: true,
});
// Returns: { awardId: 'AWD-2026-0045', poDraftId: 'PO-DRAFT-5678', status: 'awarded' }
```

### Vendor Qualification and Performance

```typescript
import { assessVendorPerformance, qualifyVendor } from "afenda-procurement";

// Qualify new vendor
const qualification = await qualifyVendor(db, orgId, {
  vendorId: "VEND-NEW-001",
  criteria: [
    { name: "financial_stability", required: true, passed: true },
    { name: "iso_9001_certified", required: true, passed: true },
    {
      name: "insurance_coverage",
      required: true,
      passed: true,
      value: "2M USD",
    },
    { name: "capacity_check", required: false, passed: true },
  ],
});
// Returns: { status: 'approved', approvedCategories: ['electronics', 'IT equipment'], validUntil: '2027-02-17' }

// Assess ongoing performance
const performance = await assessVendorPerformance(db, orgId, {
  vendorId: "VEND-DELL",
  metrics: {
    onTimeDelivery: 0.95, // 95% OTD
    qualityRejectRate: 0.02, // 2% defect rate
    priceCompetitiveness: 0.88, // 88% of market benchmark
    responsiveness: 0.90, // Response time score
  },
  period: "2025-Q4",
});
// Returns: { overallScore: 87.5, rating: 'preferred', recommendations: ['Continue partnership'] }
```

### Spend Analysis

```typescript
import {
  analyzeSpendByCategory,
  identifySavingsOpportunities,
} from "afenda-procurement";

// Analyze spend across dimensions
const analysis = await analyzeSpendByCategory(db, orgId, {
  period: { from: "2025-01-01", to: "2025-12-31" },
  dimensions: ["category", "vendor", "department"],
  minAmount: 10000, // Focus on material spend
});
// Returns: {
//   byCategory: [{ category: 'IT Equipment', spend: 450000, vendors: 5, orders: 45 }, ...],
//   byVendor: [{ vendorId: 'VEND-DELL', spend: 180000, categories: 2 }, ...],
//   totalSpend: 2500000
// }

// Identify consolidation opportunities
const savings = await identifySavingsOpportunities(db, orgId, {
  analysisData: analysis,
  strategies: [
    "vendor_consolidation",
    "volume_discounts",
    "contract_renegotiation",
  ],
});
// Returns: {
//   opportunities: [
//     { type: 'vendor_consolidation', category: 'Office Supplies', potential: 15000, vendors: [3, 'reduce to', 1] },
//     { type: 'volume_discount', vendor: 'VEND-DELL', potential: 25000, volumeIncrease: '20%' },
//   ],
//   totalPotential: 125000
// }
```

## Architecture

This package is part of **Layer 2 (Domain Services)** and follows these rules:

- Depends only on Layer 1 (Foundation) packages
- Contains pure business logic, no UI or infrastructure concerns
- Uses source exports (no compilation step)
- Stateless functions receiving database connection as parameter

## See Also

- [ARCHITECTURE.md](../../ARCHITECTURE.md) - Overall system architecture
- [GOVERNANCE.md](../GOVERNANCE.md) - Package governance rules
- [ENTERPRISE_DOMAIN_ARCHITECTURE.md](../../docs/ENTERPRISE_DOMAIN_ARCHITECTURE.md) -
  Full ERP domain structure
- Related packages: `afenda-purchasing`, `afenda-payables`, `afenda-workflow`
