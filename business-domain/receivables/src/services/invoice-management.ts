import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface CustomerInvoice {
  id: string;
  orgId: string;
  customerId: string;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  status: 'DRAFT' | 'SENT' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  paymentTerms: string;
  lines: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
    revenueAccountId: string;
  }>;
}

export async function createCustomerInvoice(
  db: NeonHttpDatabase,
  data: Omit<CustomerInvoice, 'id' | 'status'>,
): Promise<CustomerInvoice> {
  // TODO: Insert into database with DRAFT status
  throw new Error('Database integration pending');
}

export async function sendInvoice(
  db: NeonHttpDatabase,
  invoiceId: string,
): Promise<CustomerInvoice> {
  // TODO: Update status to SENT and send email
  throw new Error('Database integration pending');
}

export async function getOverdueInvoices(
  db: NeonHttpDatabase,
  orgId: string,
): Promise<CustomerInvoice[]> {
  // TODO: Query invoices past due date
  throw new Error('Database integration pending');
}

export function calculateARAgingBuckets(invoices: CustomerInvoice[], asOfDate: Date): {
  current: number;
  days30: number;
  days60: number;
  days90: number;
  over90: number;
  total: number;
} {
  const buckets = { current: 0, days30: 0, days60: 0, days90: 0, over90: 0, total: 0 };

  for (const invoice of invoices) {
    if (invoice.status === 'PAID' || invoice.status === 'CANCELLED') continue;

    const daysOverdue = Math.floor(
      (asOfDate.getTime() - invoice.dueDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    const outstanding = invoice.totalAmount; // TODO: Calculate remaining balance

    if (daysOverdue <= 0) buckets.current += outstanding;
    else if (daysOverdue <= 30) buckets.days30 += outstanding;
    else if (daysOverdue <= 60) buckets.days60 += outstanding;
    else if (daysOverdue <= 90) buckets.days90 += outstanding;
    else buckets.over90 += outstanding;

    buckets.total += outstanding;
  }

  return buckets;
}

export function prioritizeCollections(
  invoices: CustomerInvoice[],
): Array<{
  invoice: CustomerInvoice;
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  reason: string;
}> {
  return invoices
    .filter((inv) => inv.status !== 'PAID' && inv.status !== 'CANCELLED')
    .map((invoice) => {
      const daysOverdue = Math.floor(
        (Date.now() - invoice.dueDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      let priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
      let reason = '';

      if (daysOverdue > 90 || invoice.totalAmount > 100000) {
        priority = 'URGENT';
        reason = daysOverdue > 90 
          ? `${daysOverdue} days overdue` 
          : 'High value invoice';
      } else if (daysOverdue > 60 || invoice.totalAmount > 50000) {
        priority = 'HIGH';
        reason = `${daysOverdue} days overdue`;
      } else if (daysOverdue > 30) {
        priority = 'MEDIUM';
        reason = `${daysOverdue} days overdue`;
      } else {
        priority = 'LOW';
        reason = 'Within normal terms';
      }

      return { invoice, priority, reason };
    })
    .sort((a, b) => {
      const priorityOrder = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
}

export function calculateDSO(
  totalAR: number,
  totalRevenue: number,
  days: number = 90,
): number {
  return totalRevenue > 0 ? (totalAR / totalRevenue) * days : 0;
}
