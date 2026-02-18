/**
 * Dividend Declarations Service
 * 
 * Manage dividend declarations and approvals
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { z } from 'zod';
import { DividendType, DividendStatus, PaymentFrequency } from '../types/common.js';

// ── Schemas ────────────────────────────────────────────────────────

export const dividendDeclarationSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  dividendType: z.nativeEnum(DividendType),
  amountPerShare: z.number().positive(),
  declarationDate: z.coerce.date(),
  recordDate: z.coerce.date(),
  paymentDate: z.coerce.date(),
  exDividendDate: z.coerce.date(),
  status: z.nativeEnum(DividendStatus),
  totalAmount: z.number().positive(),
  sharesEligible: z.number().int().positive(),
  frequency: z.nativeEnum(PaymentFrequency),
  fiscalYear: z.number().int(),
  fiscalQuarter: z.number().int().min(1).max(4).optional(),
  notes: z.string().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type DividendDeclaration = z.infer<typeof dividendDeclarationSchema>;

export const createDeclarationSchema = dividendDeclarationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  totalAmount: true,
});

// ── Types ──────────────────────────────────────────────────────────

export type CreateDeclarationInput = z.infer<typeof createDeclarationSchema>;

// ── Functions ──────────────────────────────────────────────────────

/**
 * Create dividend declaration
 */
export async function createDividendDeclaration(
  db: NeonHttpDatabase,
  orgId: string,
  input: CreateDeclarationInput,
): Promise<DividendDeclaration> {
  const validated = createDeclarationSchema.parse(input);

  // Validate date sequence
  validateDividendDates(
    validated.declarationDate,
    validated.exDividendDate,
    validated.recordDate,
    validated.paymentDate,
  );

  // Calculate total amount
  const totalAmount = validated.amountPerShare * validated.sharesEligible;

  // TODO: Implement database logic
  // 1. Create declaration with PROPOSED status
  // 2. Calculate total amount
  // 3. Return declaration

  throw new Error('Not implemented');
}

/**
 * Approve dividend declaration
 */
export async function approveDividendDeclaration(
  db: NeonHttpDatabase,
  orgId: string,
  declarationId: string,
  approvedBy: string,
): Promise<DividendDeclaration> {
  // TODO: Implement database logic
  // 1. Get declaration
  // 2. Validate can be approved
  // 3. Update status to APPROVED
  // 4. Generate dividend payments for all eligible shareholders
  // 5. Return declaration

  throw new Error('Not implemented');
}

/**
 * Get all dividend declarations
 */
export async function getDividendDeclarations(
  db: NeonHttpDatabase,
  orgId: string,
  filters?: {
    fiscalYear?: number;
    status?: DividendStatus;
  },
): Promise<DividendDeclaration[]> {
  // TODO: Implement database query

  throw new Error('Not implemented');
}

/**
 * Cancel dividend declaration
 */
export async function cancelDividendDeclaration(
  db: NeonHttpDatabase,
  orgId: string,
  declarationId: string,
  reason: string,
): Promise<DividendDeclaration> {
  // TODO: Implement database logic
  // 1. Get declaration
  // 2. Validate can be cancelled
  // 3. Update status to CANCELLED
  // 4. Delete pending payments
  // 5. Return declaration

  throw new Error('Not implemented');
}

/**
 * Calculate dividend payout ratio
 */
export function calculatePayoutRatio(
  totalDividends: number,
  netIncome: number,
): number {
  if (netIncome <= 0) return 0;
  return (totalDividends / netIncome) * 100;
}

/**
 * Validate dividend date sequence
 */
export function validateDividendDates(
  declarationDate: Date,
  exDividendDate: Date,
  recordDate: Date,
  paymentDate: Date,
): void {
  // Declaration must be before ex-dividend date
  if (declarationDate >= exDividendDate) {
    throw new Error('Declaration date must be before ex-dividend date');
  }

  // Ex-dividend date must be before record date
  if (exDividendDate >= recordDate) {
    throw new Error('Ex-dividend date must be before record date');
  }

  // Record date must be before payment date
  if (recordDate >= paymentDate) {
    throw new Error('Record date must be before payment date');
  }
}

/**
 * Calculate ex-dividend date (typically 1-2 days before record date)
 */
export function calculateExDividendDate(
  recordDate: Date,
  daysBeforeRecord: number = 2,
): Date {
  const exDate = new Date(recordDate);
  exDate.setDate(exDate.getDate() - daysBeforeRecord);
  return exDate;
}
