import { z } from 'zod';

/**
 * Shared enums and constants used across dividend management services
 */

export enum DividendType {
  CASH = 'CASH',
  STOCK = 'STOCK',
  PROPERTY = 'PROPERTY',
  SCRIPT = 'SCRIPT',
}

export enum DividendStatus {
  PROPOSED = 'PROPOSED',
  DECLARED = 'DECLARED',
  APPROVED = 'APPROVED',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

export enum PaymentFrequency {
  ANNUAL = 'ANNUAL',
  SEMI_ANNUAL = 'SEMI_ANNUAL',
  QUARTERLY = 'QUARTERLY',
  MONTHLY = 'MONTHLY',
  SPECIAL = 'SPECIAL',
}

// ── Cross-Service Types ────────────────────────────────────────────

export const dividendPolicySchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  targetPayoutRatio: z.number().min(0).max(100),
  minimumDividendPerShare: z.number().min(0).optional(),
  frequency: z.nativeEnum(PaymentFrequency),
  isActive: z.boolean().default(true),
  effectiveDate: z.coerce.date(),
  notes: z.string().optional(),
  createdAt: z.coerce.date(),
});

export type DividendPolicy = z.infer<typeof dividendPolicySchema>;

export interface DividendSummary {
  fiscalYear: number;
  totalDeclared: number;
  totalPaid: number;
  totalWithheld: number;
  payoutRatio: number;
  shareholdersCount: number;
  byQuarter: Array<{
    quarter: number;
    amount: number;
    amountPerShare: number;
    paymentDate: Date;
  }>;
}

export interface ShareholderDividendHistory {
  shareholderId: string;
  shareholderName: string;
  totalReceived: number;
  totalWithheld: number;
  netReceived: number;
  dividends: Array<{
    declarationDate: Date;
    paymentDate: Date;
    shares: number;
    amountPerShare: number;
    totalAmount: number;
    withholdingTax: number;
    netAmount: number;
  }>;
}
