# afenda-inventory

Inventory and manufacturing domain services for the AFENDA-NEXUS ERP system.

## Purpose

`afenda-inventory` provides domain-specific business logic for inventory
management, manufacturing operations, procurement matching, and supply chain
traceability including UOM conversions, lot/batch recall, BOM explosion, WIP
costing, landed cost allocation, and three-way matching.

## When to Use This Package

Use `afenda-inventory` when you need to:

- Convert quantities between units of measure (UOM) with deterministic rounding
- Trace lot/batch/serial numbers forward or backward for recalls
- Explode bills of materials (BOM) for manufacturing orders
- Calculate WIP (work-in-progress) cost rollups for work orders
- Generate GL journal entries from manufacturing movements
- Allocate landed costs to receipt lines
- Evaluate 2-way or 3-way matches (PO–GRN–Invoice)

**Do NOT use directly** - Import through `afenda-crud` which provides
authorization and audit logging.

## Key Concepts

### UOM Conversion

- **Deterministic rounding**: Same inputs always produce same output
- **Product-specific overrides**: Product conversions take precedence over
  global
- **Bidirectional lookup**: Automatically inverts factors if reverse direction
  defined
- **Multiple rounding methods**: half_up, half_down, banker's, ceil, floor

### Lot Recall & Traceability

- **Forward trace**: Find all downstream movements (where did this lot go?)
- **Backward trace**: Find all upstream source movements (where did this come
  from?)
- **BFS traversal**: Breadth-first search with configurable max depth
- **DAG structure**: Uses `inventory_trace_links` for traceability graph

### Manufacturing Engine

- **BOM explosion**: Scale component quantities by order qty / yield qty
- **Waste percentage**: Apply waste factor to get gross requirements
- **Cost rollup**: Sum material, labor, overhead, scrap costs from WIP movements
- **WIP→GL journalization**: Generate double-entry journal specs for posting
  kernel
- **Unit cost calculation**: Total cost / completed qty with rounding

### Landed Cost Allocation

- **Allocation methods**: By quantity, value, or weight
- **Minor units**: Integer-only math (no floating-point drift)
- **Last line absorption**: Rounding remainders absorbed in final line
- **Multi-currency**: FX conversion to base currency

### Three-Way Match

- **2-way match**: PO vs Invoice (no GRN)
- **3-way match**: PO vs GRN vs Invoice
- **Tolerance thresholds**: Qty%, price%, and total amount tolerances
- **Exception handling**: Manual override workflow for variance approval

## Quick Start

```typescript
import { db } from "afenda-database";
import {
  allocateLandedCost,
  convertUom,
  explodeBomFromDb,
  matchDocumentLines,
  traceRecall,
} from "afenda-inventory";

// Convert 10 cases to units
const conversion = await convertUom(
  db,
  "org-123",
  "uom-case-456",
  "uom-unit-789",
  10,
  "product-abc",
);
// => { fromQty: 10, toQty: 240, factor: 24, roundingMethod: 'half_up' }

// Trace a recalled lot
const recall = await traceRecall(
  db,
  "org-123",
  "lot-tracking-xyz",
);
// => { lotTrackingId, trackingNo, affectedMovements: [...], totalAffected: 42 }

// Explode BOM for work order
const bom = await explodeBomFromDb(
  db,
  "org-123",
  "company-456",
  "product-finished-goods",
  100,
);
// => { bomId, productId, lines: [...], totalComponents: 5 }

// Allocate landed cost
const allocation = await allocateLandedCost(
  db,
  "org-123",
  "landed-cost-doc-123",
  50000, // $500.00 in minor units
  "value",
  [
    { receiptLineId: "line-1", qty: 10, valueMinor: 100000 },
    { receiptLineId: "line-2", qty: 5, valueMinor: 50000 },
  ],
);
// => { landedCostDocId, method: 'value', totalAllocated: 50000, lines: [...] }

// Evaluate 3-way match
const matchResult = await matchDocumentLines(
  db,
  "org-123",
  {
    companyId: "company-456",
    poLineId: "po-line-1",
    grnLineId: "grn-line-1",
    invoiceLineId: "inv-line-1",
    poQty: 100,
    poUnitPriceMinor: 1000,
    grnQty: 98,
    invoiceQty: 98,
    invoiceUnitPriceMinor: 1020,
  },
);
// => { matchResultId, evaluation: { matchType: 'three_way', status: 'exception', ... } }
```

## Dependencies

- `afenda-canon` - Entity types and schemas
- `afenda-database` - Database schema and ORM
- `drizzle-orm` - SQL query builder

## Related Packages

- [`afenda-crud`](../crud/README.md) - Orchestrates inventory services with auth
- [`afenda-accounting`](../accounting/README.md) - Financial services for GL
  integration
- [`afenda-workflow`](../workflow/README.md) - Triggers rules based on inventory
  events
- [`afenda-database`](../database/README.md) - Provides database schema

## Architecture

**Layer**: Domain Services (Layer 2)

This package implements pure business logic with no knowledge of HTTP, auth, or
UI. All services accept database handles and return typed results.

See: [ARCHITECTURE.md](../../ARCHITECTURE.md)

---

**Last Updated**: February 17, 2026
