# @afenda-receiving

## Purpose

Enterprise goods receipt and inspection management supporting receiving
operations, quality inspection, return-to-vendor processing, and 2/3-way
matching.

## When to Use

- Recording goods receipts against purchase orders
- Performing quality inspections at receiving dock
- Processing returns to vendor (RTV) for defective/incorrect items
- Matching receipts to POs and invoices (2-way and 3-way matching)
- Managing put-away to warehouse locations
- Blind receiving (without PO reference)
- Processing advanced shipping notices (ASN)

## Key Concepts

### Goods Receipt Note (GRN)

GRNs document physical receipt of goods, capturing actual quantities received,
inspection results, and condition. Each GRN references a PO and updates
inventory balances upon acceptance.

### Quality Inspection

Incoming items undergo inspection based on predefined quality plans. Inspections
can result in accept, reject (RTV), or accept-with-exception (use-as-is,
rework). Failed inspections trigger vendor quality tracking.

### 2-Way and 3-Way Matching

- **2-way match**: GRN quantities/prices match PO (allow within tolerance)
- **3-way match**: GRN, PO, and invoice all reconcile before payment approval
- Variances exceeding tolerance require exception handling and approval

### Return to Vendor (RTV)

Defective, damaged, or incorrect items generate RTV authorization requiring
vendor acceptance. RTVs can result in replacement shipment, credit memo, or
repair.

### Put-Away

After acceptance, received items must be assigned warehouse storage locations
and physically moved (put-away task). Integration with warehouse management
tracks completion.

## Dependencies

- **afenda-canon**: Entity types for goods receipts, inspections, RTVs
- **afenda-database**: Schema for grns, grn_lines, inspections, rtv tables
- **afenda-inventory**: Inventory balance updates, lot/serial assignment
- **afenda-purchasing**: PO reference, delivery schedule validation
- **drizzle-orm**: Database query builder
- **zod**: Validation for receiving data

## Public API

```typescript
import {
  acceptReceipt,
  analyzeReceivingCycle,
  // Put-away
  assignStorageLocation,
  // Analytics
  calculateReceiptAccuracy,
  confirmPutAway,
  // Goods receipt
  createGoodsReceipt,
  // Return to vendor
  createReturnAuthorization,
  generatePutAwayTask,
  // Types
  type GoodsReceiptParams,
  type InspectionResult,
  inspectReceipt,
  type MatchResult,
  matchToInvoice,
  // Matching
  matchToOrder,
  processReturn,
  resolveMatchException,
  type ReturnAuthorization,
  trackInspectionRejects,
} from "afenda-receiving";
```

## Usage Examples

### Create and Inspect Goods Receipt

```typescript
import {
  acceptReceipt,
  createGoodsReceipt,
  inspectReceipt,
} from "afenda-receiving";
import { db } from "afenda-database";

// Receiver creates GRN from delivery
const grn = await createGoodsReceipt(db, orgId, {
  poId: "PO-2026-05678",
  receivedDate: "2026-02-20T10:30:00Z",
  carrierInfo: {
    carrier: "UPS",
    trackingNumber: "1Z999AA10123456789",
    deliveryNote: "DN-98765",
  },
  lines: [
    {
      poLineId: 1,
      productId: "PROD-LAPTOP-001",
      receivedQuantity: 5,
      packingSlipQty: 5,
      condition: "good",
    },
  ],
});
// Returns: { grnId: 'GRN-2026-01234', status: 'pending_inspection' }

// Quality inspector performs inspection
const inspection = await inspectReceipt(db, orgId, {
  grnId: grn.grnId,
  inspectorId: "EMP-QC-001",
  qualityChecks: [
    {
      lineId: 1,
      checkType: "visual_inspection",
      result: "pass",
      notes: "Packaging intact, labels correct",
    },
    {
      lineId: 1,
      checkType: "functional_test",
      result: "pass",
      sampleSize: 1, // Test 1 of 5 units
    },
  ],
});
// Returns: { status: 'passed', failedChecks: [], actionRequired: none }

// Accept receipt and update inventory
const acceptance = await acceptReceipt(db, orgId, {
  grnId: grn.grnId,
  warehouseLocation: "LOC-WAREHOUSE-01",
  binAssignments: [
    { lineId: 1, binLocation: "BIN-A12-03", quantity: 5 },
  ],
});
// Returns: { status: 'accepted', inventoryUpdated: true, putAwayTaskIds: ['PUT-001'] }
```

### Handle Return to Vendor

```typescript
import { createReturnAuthorization, processReturn } from "afenda-receiving";

// Create RTV for defective items
const rtv = await createReturnAuthorization(db, orgId, {
  grnId: "GRN-2026-01235",
  lines: [
    {
      grnLineId: 2,
      quantity: 3,
      reason: "DEFECTIVE",
      description: "Units fail POST, display artifacts",
      photos: ["photo1.jpg", "photo2.jpg"],
    },
  ],
  vendorContact: "returns@vendor.com",
});
// Returns: { rtvId: 'RTV-2026-0089', status: 'pending_vendor_approval', rmaNumber: null }

// Process vendor response
const returnProcessing = await processReturn(db, orgId, {
  rtvId: rtv.rtvId,
  vendorDecision: "replacement",
  rmaNumber: "RMA-VEND-45678",
  expectedReplacementDate: "2026-03-05",
  creditMemoNumber: null, // No credit, replacement only
});
// Returns: { status: 'approved', disposition: 'replacement', shipmentTracking: null }
```

### 3-Way Matching

```typescript
import {
  matchToInvoice,
  matchToOrder,
  resolveMatchException,
} from "afenda-receiving";

// 2-way match: GRN vs PO
const poMatch = await matchToOrder(db, orgId, {
  grnId: "GRN-2026-01234",
  poId: "PO-2026-05678",
  tolerances: {
    quantityVariancePct: 0.05, // Allow 5% qty variance
    priceVariancePct: 0.02, // Allow 2% price variance
  },
});
// Returns: { matched: true, variances: [], exceptions: [] }

// 3-way match: GRN + PO + Invoice
const invoiceMatch = await matchToInvoice(db, orgId, {
  grnId: "GRN-2026-01234",
  invoiceId: "INV-VEND-9876",
  tolerances: {
    quantityVariancePct: 0.05,
    priceVariancePct: 0.02,
    totalAmountVariance: 50.00, // Allow $50 total variance
  },
});
// Returns: {
//   matched: false,
//   variances: [{ type: 'price', line: 1, poPrice: 1150.00, invoicePrice: 1175.00, variance: 25.00 }],
//   requiresApproval: true
// }

// Resolve variance exception
const resolution = await resolveMatchException(db, orgId, {
  matchId: invoiceMatch.matchId,
  resolution: "approve",
  approverId: "MGR-AP-001",
  reason:
    "Vendor corrected price for quantity discount, approved by Procurement",
});
// Returns: { status: 'resolved', invoiceApproved: true }
```

### Put-Away Management

```typescript
import { assignStorageLocation, generatePutAwayTask } from "afenda-receiving";

// System assigns optimal storage locations
const assignment = await assignStorageLocation(db, orgId, {
  grnId: "GRN-2026-01234",
  items: [
    { lineId: 1, productId: "PROD-LAPTOP-001", quantity: 5 },
  ],
  strategy: "ABC_CLASSIFICATION", // Fast-moving items near shipping
});
// Returns: {
//   assignments: [{ lineId: 1, binLocation: 'BIN-A12-03', priority: 'high' }]
// }

// Generate warehouse put-away tasks
const putAwayTasks = await generatePutAwayTask(db, orgId, {
  grnId: "GRN-2026-01234",
  assignments: assignment.assignments,
});
// Returns: { taskIds: ['PUT-001'], assignedTo: 'WORKER-012', estimatedDuration: '15m' }
```

## Architecture

This package is part of **Layer 2 (Domain Services)** and follows these rules:

- Depends only on Layer 1 (Foundation) + domain peers (inventory, purchasing)
- Contains pure business logic for receiving operations
- Uses source exports (no compilation step)
- Stateless functions receiving database connection as parameter
- No logging (logging happens at application layer)

## See Also

- [ARCHITECTURE.md](../../ARCHITECTURE.md) - Overall system architecture
- [GOVERNANCE.md](../GOVERNANCE.md) - Package governance rules
- [ENTERPRISE_DOMAIN_ARCHITECTURE.md](../../docs/ENTERPRISE_DOMAIN_ARCHITECTURE.md) -
  Full ERP domain
- Related packages: `afenda-purchasing`, `afenda-inventory`, `afenda-payables`,
  `afenda-warehouse`
