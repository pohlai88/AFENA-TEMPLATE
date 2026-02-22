import { describe, expect, it } from 'vitest';
import { computeCreditNote } from '../calculators/credit-note';

describe('computeCreditNote', () => {
  it('computes credit note with tax', () => {
    const r = computeCreditNote({ originalInvoiceId: 'INV-1', creditNoteId: 'CN-1', lines: [{ description: 'Widget', quantityReturned: 2, unitPriceMinor: 1000, taxRateBps: 1000 }], reason: 'Defective' });
    expect(r.result.subtotalMinor).toBe(2000);
    expect(r.result.taxMinor).toBe(200);
    expect(r.result.totalMinor).toBe(2200);
    expect(r.result.lineCount).toBe(1);
  });

  it('handles multiple lines', () => {
    const r = computeCreditNote({ originalInvoiceId: 'INV-2', creditNoteId: 'CN-2', lines: [{ description: 'A', quantityReturned: 1, unitPriceMinor: 500, taxRateBps: 0 }, { description: 'B', quantityReturned: 3, unitPriceMinor: 200, taxRateBps: 500 }], reason: 'Return' });
    expect(r.result.subtotalMinor).toBe(1100);
    expect(r.result.lineCount).toBe(2);
  });

  it('throws on empty lines', () => {
    expect(() => computeCreditNote({ originalInvoiceId: 'X', creditNoteId: 'Y', lines: [], reason: 'x' })).toThrow('at least one line');
  });
});
