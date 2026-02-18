# @afenda-payables

Enterprise accounts payable and invoice processing.

## Features

- **Invoice Management**: Capture, validate, code invoices
- **Approval Routing**: Multi-level, budget checks, early payment discounts
- **Payment Execution**: Proposals, runs, file generation (ACH/Wire/Check)
- **Vendor Statements**: Reconciliation, aging, credit management
- **AP Analytics**: Aging, DPO, discount capture, cash flow forecasts

## Usage

```typescript
import { captureInvoice, generatePaymentFile, submitForApproval } from 'afenda-payables';

// Capture supplier invoice
const invoice = await captureInvoice(db, orgId, {
  vendorId: 'VENDOR-001',
  invoiceNumber: 'INV-2025-001',
  invoiceDate: '2025-01-15',
  dueDate: '2025-02-15',
  totalAmount: 5000.0,
  currency: 'USD',
  lines: [
    { poLineId: 1, description: 'Widgets', amount: 4500.0, glAccount: '5010' },
    { description: 'Freight', amount: 500.0, glAccount: '5150' },
  ],
  paymentTerms: '2/10 Net 30', // 2% discount if paid in 10 days
});

// Route for approval
await submitForApproval(db, orgId, {
  invoiceId: invoice.invoiceId,
  approverId: 'USER-123',
  checkBudget: true,
});

// Generate payment batch
const payment = await generatePaymentFile(db, orgId, {
  paymentRunId: 'PAY-RUN-001',
  format: 'ACH',
  bankAccount: 'BANK-001',
});
```

## Architecture

**Layer**: 2 (Domain Services)\
**Dependencies**: canon, database, workflow, receiving, drizzle-orm, zod
