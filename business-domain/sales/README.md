# @afenda-sales

Enterprise sales order management with ATP/CTP and RMA processing.

## Features

- **Quotations**: Create, configure pricing, convert to orders
- **Order Management**: Create orders, ATP/CTP allocation, backorder handling
- **Order Fulfillment**: Release, pick/pack coordination, shipment creation
- **RMA Processing**: Return authorizations, refunds/replacements, restocking
- **Sales Analytics**: Win rates, order cycle, revenue forecasting

## Usage

```typescript
import { checkAvailableToPromise, createQuotation, createSalesOrder } from 'afenda-sales';

// Create quote
const quote = await createQuotation(db, orgId, {
  customerId: 'CUST-001',
  validUntil: '2025-03-15',
  items: [{ productId: 'PROD-123', quantity: 100, unitPrice: 50.0 }],
});

// Check ATP before order
const atp = await checkAvailableToPromise(db, orgId, {
  productId: 'PROD-123',
  requestedQuantity: 100,
  requestedDate: '2025-02-20',
});

// Create order
const order = await createSalesOrder(db, orgId, {
  customerId: 'CUST-001',
  items: [{ productId: 'PROD-123', quantity: 100, unitPrice: 50.0 }],
});
```

## Architecture

**Layer**: 2 (Domain Services)\
**Dependencies**: canon, database, workflow, inventory, crm, drizzle-orm, zod
