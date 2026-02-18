import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface Invoice {
  id: string;
  orgId: string;
  vendorId: string;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  status: 'PENDING' | 'APPROVED' | 'PAID' | 'CANCELLED';
  paymentTerms: string;
  lines: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
    accountId: string;
  }>;
}

export async function createInvoice(
  db: NeonHttpDatabase,
  data: Omit<Invoice, 'id' | 'status'>,
): Promise<Invoice> {
  // TODO: Insert into database with PENDING status
  throw new Error('Database integration pending');
}

export async function approveInvoice(
  db: NeonHttpDatabase,
  invoiceId: string,
  approvedBy: string,
): Promise<Invoice> {
  // TODO: Update status to APPROVED
  throw new Error('Database integration pending');
}

export async function getInvoicesDue(
  db: NeonHttpDatabase,
  orgId: string,
  asOfDate: Date,
): Promise<Invoice[]> {
  // TODO: Query invoices due by date
  throw new Error('Database integration pending');
}

export function calculate3WayMatch(
  invoice: Invoice,
  purchaseOrder: { lines: Array<{ quantity: number; unitPrice: number }> },
  receipt: { lines: Array<{ quantity: number }> },
): {
  matched: boolean;
  variances: Array<{ type: string; description: string; amount: number }>;
} {
  const variances: Array<{ type: string; description: string; amount: number }> = [];

  // Simplified 3-way match logic
  if (invoice.lines.length !== purchaseOrder.lines.length) {
    variances.push({
      type: 'LINE_COUNT',
      description: 'Line count mismatch',
      amount: 0,
    });
  }

  for (let i = 0; i < Math.min(invoice.lines.length, purchaseOrder.lines.length); i++) {
    const invLine = invoice.lines[i];
    const poLine = purchaseOrder.lines[i];
    const rcvLine = receipt.lines[i];

    // Price variance
    if (Math.abs(invLine.unitPrice - poLine.unitPrice) > 0.01) {
      variances.push({
        type: 'PRICE',
        description: `Price variance on line ${i + 1}`,
        amount: (invLine.unitPrice - poLine.unitPrice) * invLine.quantity,
      });
    }

    // Quantity variance
    if (invLine.quantity !== rcvLine?.quantity) {
      variances.push({
        type: 'QUANTITY',
        description: `Quantity variance on line ${i + 1}`,
        amount: (invLine.quantity - (rcvLine?.quantity || 0)) * invLine.unitPrice,
      });
    }
  }

  return {
    matched: variances.length === 0,
    variances,
  };
}

export function calculateAgingBuckets(invoices: Invoice[], asOfDate: Date): {
  current: number;
  days30: number;
  days60: number;
  days90: number;
  over90: number;
} {
  const buckets = { current: 0, days30: 0, days60: 0, days90: 0, over90: 0 };

  for (const invoice of invoices) {
    if (invoice.status === 'PAID') continue;

    const daysOverdue = Math.floor(
      (asOfDate.getTime() - invoice.dueDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysOverdue <= 0) buckets.current += invoice.totalAmount;
    else if (daysOverdue <= 30) buckets.days30 += invoice.totalAmount;
    else if (daysOverdue <= 60) buckets.days60 += invoice.totalAmount;
    else if (daysOverdue <= 90) buckets.days90 += invoice.totalAmount;
    else buckets.over90 += invoice.totalAmount;
  }

  return buckets;
}
