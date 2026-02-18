# @afenda-purchasing

## Purpose

Enterprise purchase order management supporting PO creation, multi-level
approvals, vendor acknowledgment, delivery schedules, and EDI integration.

## When to Use

- Creating and managing purchase orders from approved requisitions or RFQ awards
- Routing POs through approval workflows based on amount thresholds
- Tracking vendor order confirmations and delivery commitments
- Amending POs with version control and change documentation
- Managing expediting and follow-up for overdue deliveries
- Analyzing purchase lead times and price variance
- Integrating with vendor EDI systems (850, 855, 856)

## Key Concepts

### PO Lifecycle

Purchase orders progress through states: draft → pending approval → approved →
acknowledged → in-transit → partially received → received → closed. Each
transition is tracked with timestamps and user attribution.

### PO Versioning

PO amendments create new versions while preserving the complete change history.
Material changes (quantity, price, delivery date) may require re-approval
depending on threshold rules.

### Approval Workflows

Multi-level approval routing based on PO amount, commodity type, or vendor risk
classification. Approvals can escalate automatically after timeout periods.

### Vendor Acknowledgment

Vendors acknowledge POs electronically (EDI 855 or portal) confirming
acceptance, pricing, and promised delivery dates. Discrepancies trigger
exception workflows.

### Delivery Schedules

POs support multi-line, multi-schedule deliveries where each line item can have
different delivery dates and ship-to locations.

## Dependencies

- **afenda-canon**: Entity types for purchase orders, PO lines, vendors
- **afenda-database**: Schema for pos, po_lines, po_approvals, po_versions
  tables
- **afenda-logger**: Audit logging for PO lifecycle events
- **afenda-workflow**: Approval routing and escalation rules
- **afenda-procurement**: Integration with requisitions and RFQ awards
- **drizzle-orm**: Database query builder
- **zod**: Validation for PO data

## Public API

```typescript
import {
  // Order tracking
  acknowledgeOrder,
  amendPurchaseOrder,
  // Analytics
  analyzePurchaseLeadTime,
  approvePurchaseOrder,
  calculatePurchaseCycle,
  closePurchaseOrder,
  // PO creation & management
  createPurchaseOrder,
  escalatePurchaseOrder,
  evaluateOnTimeDelivery,
  // Expediting
  identifyOverdueOrders,
  type LeadTimeAnalysis,
  type OrderStatus,
  type POApprovalResult,
  // Types
  type PurchaseOrderParams,
  sendVendorReminder,
  // PO approval
  submitForApproval,
  trackOrderStatus,
  trackPriceVariance,
  updateDeliverySchedule,
} from 'afenda-purchasing';
```

## Usage Examples

### Create PO from Requisition

```typescript
import { createPurchaseOrder } from 'afenda-purchasing';
import { db } from 'afenda-database';

const po = await createPurchaseOrder(db, orgId, {
  requisitionId: 'REQ-2026-00123',
  vendorId: 'VEND-DELL',
  items: [
    {
      requisitionLineId: 'REQ-LINE-001',
      productId: 'PROD-LAPTOP-001',
      description: 'Dell Latitude 5430, 16GB RAM, 512GB SSD',
      quantity: 5,
      unitPrice: 1150.0,
      deliveryDate: '2026-03-15',
      shipToLocationId: 'LOC-HQ',
    },
  ],
  terms: {
    paymentTerms: 'NET_30',
    shippingTerms: 'FOB_DESTINATION',
    currency: 'USD',
  },
});
// Returns: { poId: 'PO-2026-05678', status: 'draft', totalAmount: 5750.00 }
```

### Approval Workflow

```typescript
import { approvePurchaseOrder, submitForApproval } from 'afenda-purchasing';

// Submit PO for approval
const workflow = await submitForApproval(db, orgId, { poId: 'PO-2026-05678' });
// Returns: { workflowId: 'WF-PO-05678', approvers: ['MGR-001', 'DIR-001'], status: 'pending' }

// Manager approves
const approval = await approvePurchaseOrder(db, orgId, {
  poId: 'PO-2026-05678',
  approverId: 'MGR-001',
  comments: 'Approved, urgent need for engineering team',
  glCoding: [{ lineId: 1, glAccountId: 'GL-5100-EQUIPMENT', amount: 5750.0 }],
});
// Returns: { status: 'approved', nextApprover: 'DIR-001', timestamp: '2026-02-17T14:30:00Z' }
```

### Track Vendor Acknowledgment

```typescript
import { acknowledgeOrder, updateDeliverySchedule } from 'afenda-purchasing';

// Vendor acknowledges PO (via EDI 855 or portal)
const ack = await acknowledgeOrder(db, orgId, {
  poId: 'PO-2026-05678',
  vendorConfirmation: {
    acknowledgedDate: '2026-02-18T09:00:00Z',
    confirmedLines: [
      {
        lineId: 1,
        confirmedQty: 5,
        confirmedPrice: 1150.0,
        promisedDate: '2026-03-12',
      },
    ],
    vendorPoNumber: 'VEND-PO-98765',
  },
});
// Returns: { status: 'acknowledged', discrepancies: [] }

// Vendor requests delivery reschedule
const reschedule = await updateDeliverySchedule(db, orgId, {
  poId: 'PO-2026-05678',
  lineId: 1,
  newDeliveryDate: '2026-03-18',
  reason: 'Component shortage, 3-day delay',
  requiresApproval: true,
});
// Returns: { approved: false, escalatedTo: 'BUYER-001', newStatus: 'pending_reschedule' }
```

### Expedite Overdue Orders

```typescript
import { identifyOverdueOrders, sendVendorReminder } from 'afenda-purchasing';

// Find late orders
const overdue = await identifyOverdueOrders(db, orgId, {
  threshold: 3, // days overdue
});
// Returns: [
//   { poId: 'PO-2026-05600', vendorId: 'VEND-XYZ', daysLate: 5, lineCount: 3 },
//   ...
// ]

// Send automated reminder
for (const order of overdue) {
  await sendVendorReminder(db, orgId, {
    poId: order.poId,
    messageTemplate: 'OVERDUE_DELIVERY',
    method: 'email', // or 'edi'
    escalationLevel: order.daysLate > 7 ? 'urgent' : 'normal',
  });
}
```

### PO Analytics

```typescript
import { analyzePurchaseLeadTime, trackPriceVariance } from 'afenda-purchasing';

// Analyze lead time by category
const leadTime = await analyzePurchaseLeadTime(db, orgId, {
  category: 'IT Equipment',
  vendorId: 'VEND-DELL',
  period: { from: '2025-01-01', to: '2025-12-31' },
});
// Returns: { avgLeadTime: 12.5, stdDev: 3.2, minLeadTime: 7, maxLeadTime: 21, unit: 'days' }

// Track price changes/variance
const variance = await trackPriceVariance(db, orgId, {
  poId: 'PO-2026-05678',
  compareToQuote: 'RFQ-2026-0045',
});
// Returns: {
//   variances: [{ lineId: 1, quotedPrice: 1200.00, poPrice: 1150.00, variance: -4.17, favorable: true }],
//   totalVariance: -250.00,
//   variancePct: -4.17
// }
```

## Architecture

This package is part of **Layer 2 (Domain Services)** and follows these rules:

- Depends only on Layer 1 (Foundation) packages + afenda-procurement
- Contains pure business logic for PO lifecycle management
- Uses source exports (no compilation step)
- Stateless functions receiving database connection as parameter

## See Also

- [ARCHITECTURE.md](../../ARCHITECTURE.md) - Overall system architecture
- [GOVERNANCE.md](../GOVERNANCE.md) - Package governance rules
- [ENTERPRISE_DOMAIN_ARCHITECTURE.md](../../docs/ENTERPRISE_DOMAIN_ARCHITECTURE.md) -
  Full ERP domain
- Related packages: `afenda-procurement`, `afenda-receiving`, `afenda-payables`
