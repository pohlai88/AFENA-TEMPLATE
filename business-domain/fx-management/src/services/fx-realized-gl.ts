/**
 * FX Realized G/L Service
 *
 * Calculates realized FX gains/losses on payment settlement.
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { z } from 'zod';

// Schemas
export const calculateRealizedGLSchema = z.object({
  documentId: z.string().uuid(),
  originalAmount: z.number().int(),
  originalRate: z.string().regex(/^\d+\.\d{6}$/),
  settlementAmount: z.number().int(),
  settlementRate: z.string().regex(/^\d+\.\d{6}$/),
  baseCurrency: z.string().length(3),
});

export type CalculateRealizedGLInput = z.infer<typeof calculateRealizedGLSchema>;

// Types
export interface RealizedGLResult {
  documentId: string;
  originalAmount: number;
  originalRate: string;
  settlementAmount: number;
  settlementRate: string;
  baseCurrency: string;
  originalBaseAmount: number;
  settlementBaseAmount: number;
  realizedGainLoss: number;
  isGain: boolean;
  journalEntryId: string | null;
}

/**
 * Calculate realized FX gain/loss on settlement
 *
 * Occurs when invoice/payment settled at different rate than booked.
 *
 * Example:
 * - Invoice booked: €100,000 @ 1.10 = $110,000
 * - Payment received: €100,000 @ 1.12 = $112,000
 * - Realized gain = $2,000
 */
export async function calculateRealizedGainLoss(
  db: NeonHttpDatabase,
  orgId: string,
  input: CalculateRealizedGLInput,
): Promise<RealizedGLResult> {
  const validated = calculateRealizedGLSchema.parse(input);

  const originalBaseAmount = Math.round(
    validated.originalAmount * parseFloat(validated.originalRate),
  );

  const settlementBaseAmount = Math.round(
    validated.settlementAmount * parseFloat(validated.settlementRate),
  );

  const realizedGainLoss = settlementBaseAmount - originalBaseAmount;
  const isGain = realizedGainLoss > 0;

  // TODO: Generate journal entry:
  //       If gain:
  //         Dr. Cash (settlement amount)
  //         Cr. AR (original amount)
  //         Cr. Realized FX Gain (difference)
  //       If loss:
  //         Dr. Cash (settlement amount)
  //         Dr. Realized FX Loss (difference)
  //         Cr. AR (original amount)

  return {
    documentId: validated.documentId,
    originalAmount: validated.originalAmount,
    originalRate: validated.originalRate,
    settlementAmount: validated.settlementAmount,
    settlementRate: validated.settlementRate,
    baseCurrency: validated.baseCurrency,
    originalBaseAmount,
    settlementBaseAmount,
    realizedGainLoss,
    isGain,
    journalEntryId: null,
  };
}

/**
 * Allocate realized FX G/L across partial payments
 *
 * When paying €100k invoice in 2 installments of €50k each,
 * realized G/L is calculated and recognized incrementally.
 */
export function allocateRealizedGL(
  totalOriginalAmount: number,
  originalRate: string,
  paymentAllocations: Array<{ amount: number; rate: string }>,
): Array<{ amount: number; realizedGL: number }> {
  return paymentAllocations.map((allocation) => {
    const originalBase = Math.round(
      allocation.amount * parseFloat(originalRate),
    );
    const settlementBase = Math.round(
      allocation.amount * parseFloat(allocation.rate),
    );
    const realizedGL = settlementBase - originalBase;

    return {
      amount: allocation.amount,
      realizedGL,
    };
  });
}
