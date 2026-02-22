import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see AR-07 — Credit note / return handling
 */
export type CreditNoteInput = {
  originalInvoiceId: string;
  creditNoteId: string;
  lines: CreditNoteLine[];
  reason: string;
};

export type CreditNoteLine = {
  description: string;
  quantityReturned: number;
  unitPriceMinor: number;
  taxRateBps: number;
};

export type CreditNoteResult = {
  subtotalMinor: number;
  taxMinor: number;
  totalMinor: number;
  lineCount: number;
};

export function computeCreditNote(
  input: CreditNoteInput,
): CalculatorResult<CreditNoteResult> {
  if (input.lines.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'Credit note must have at least one line');
  }

  let subtotal = 0;
  let tax = 0;

  for (const line of input.lines) {
    if (line.quantityReturned <= 0) {
      throw new DomainError('VALIDATION_FAILED', `Quantity must be positive for "${line.description}"`);
    }
    const lineAmount = line.quantityReturned * line.unitPriceMinor;
    const lineTax = Math.round((lineAmount * line.taxRateBps) / 10_000);
    subtotal += lineAmount;
    tax += lineTax;
  }

  return {
    result: {
      subtotalMinor: subtotal,
      taxMinor: tax,
      totalMinor: subtotal + tax,
      lineCount: input.lines.length,
    },
    inputs: { originalInvoiceId: input.originalInvoiceId, creditNoteId: input.creditNoteId },
    explanation: `Credit note ${input.creditNoteId} against invoice ${input.originalInvoiceId}: ${input.lines.length} lines, subtotal ${subtotal}, tax ${tax}, total ${subtotal + tax}. Reason: ${input.reason}.`,
  };
}
