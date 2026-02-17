/**
 * Payment Application Service
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface PaymentApplication {
  paymentId: string;
  appliedAmount: number;
  unappliedAmount: number;
  applications: Array<{ invoiceId: string; amount: number }>;
}

export interface PaymentMatch {
  paymentId: string;
  matched: boolean;
  invoiceIds: string[];
}

export async function applyPayment(
  db: NeonHttpDatabase,
  orgId: string,
  params: {
    paymentId: string;
    amount: number;
    invoiceId?: string;
  },
): Promise<PaymentApplication> {
  // TODO: Apply payment to invoice(s)
  return {
    paymentId: params.paymentId,
    appliedAmount: params.amount,
    unappliedAmount: 0,
    applications: params.invoiceId ? [{ invoiceId: params.invoiceId, amount: params.amount }] : [],
  };
}

export async function matchPayment(
  db: NeonHttpDatabase,
  orgId: string,
  params: { paymentId: string; customerId: string },
): Promise<PaymentMatch> {
  // TODO: Auto-match payment to open invoices
  return {
    paymentId: params.paymentId,
    matched: true,
    invoiceIds: ['INV-2025-00001'],
  };
}
