import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface Payment {
  id: string;
  orgId: string;
  paymentNumber: string;
  paymentDate: Date;
  vendorId: string;
  amount: number;
  currency: string;
  paymentMethod: 'CHECK' | 'ACH' | 'WIRE' | 'CARD';
  status: 'PENDING' | 'PROCESSED' | 'CLEARED' | 'FAILED';
  bankAccountId: string;
  invoices: Array<{
    invoiceId: string;
    amount: number;
  }>;
}

export async function createPayment(
  db: NeonHttpDatabase,
  data: Omit<Payment, 'id' | 'status'>,
): Promise<Payment> {
  // TODO: Insert into database with PENDING status
  throw new Error('Database integration pending');
}

export async function processPayment(
  db: NeonHttpDatabase,
  paymentId: string,
): Promise<Payment> {
  // TODO: Update status to PROCESSED and update invoice statuses
  throw new Error('Database integration pending');
}

export async function getPaymentRun(
  db: NeonHttpDatabase,
  orgId: string,
  asOfDate: Date,
  maxAmount?: number,
): Promise<Invoice[]> {
  // TODO: Query invoices for payment run
  throw new Error('Database integration pending');
}

export function optimizePaymentTiming(
  invoices: Array<Invoice & { discountTerms?: { days: number; percentage: number } }>,
  cashAvailable: number,
): Array<{
  invoice: Invoice;
  paymentDate: Date;
  amount: number;
  savingsIfPaid: number;
}> {
  const recommendations: Array<{
    invoice: Invoice;
    paymentDate: Date;
    amount: number;
    savingsIfPaid: number;
  }> = [];

  // Sort by discount benefit
  const sorted = invoices
    .map((inv) => {
      const savings = inv.discountTerms
        ? inv.totalAmount * (inv.discountTerms.percentage / 100)
        : 0;
      return { invoice: inv, savings };
    })
    .sort((a, b) => b.savings - a.savings);

  let remaining = cashAvailable;

  for (const { invoice, savings } of sorted) {
    if (remaining >= invoice.totalAmount) {
      recommendations.push({
        invoice,
        paymentDate: invoice.discountTerms 
          ? new Date(invoice.invoiceDate.getTime() + invoice.discountTerms.days * 24 * 60 * 60 * 1000)
          : invoice.dueDate,
        amount: invoice.totalAmount,
        savingsIfPaid: savings,
      });
      remaining -= invoice.totalAmount;
    }
  }

  return recommendations;
}
