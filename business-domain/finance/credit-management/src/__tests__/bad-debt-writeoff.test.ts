import { describe, expect, it } from 'vitest';
import { evaluateBadDebtWriteOffs } from '../calculators/bad-debt-writeoff';

describe('evaluateBadDebtWriteOffs', () => {
  it('recommends write-off for stage 3 past threshold', () => {
    const r = evaluateBadDebtWriteOffs([{ invoiceId: 'INV-1', customerId: 'C1', outstandingMinor: 10000, daysPastDue: 200, eclStage: 3, collateralMinor: 0 }]);
    expect(r.result.candidates[0]!.recommendation).toBe('write_off');
    expect(r.result.totalWriteOffMinor).toBe(10000);
  });

  it('recommends partial write-off when collateral exists', () => {
    const r = evaluateBadDebtWriteOffs([{ invoiceId: 'INV-2', customerId: 'C2', outstandingMinor: 10000, daysPastDue: 200, eclStage: 3, collateralMinor: 3000 }]);
    expect(r.result.candidates[0]!.recommendation).toBe('partial_write_off');
    expect(r.result.candidates[0]!.writeOffMinor).toBe(7000);
  });

  it('holds stage 1/2 items', () => {
    const r = evaluateBadDebtWriteOffs([{ invoiceId: 'INV-3', customerId: 'C3', outstandingMinor: 5000, daysPastDue: 300, eclStage: 2, collateralMinor: 0 }]);
    expect(r.result.candidates[0]!.recommendation).toBe('hold');
  });

  it('throws on empty candidates', () => {
    expect(() => evaluateBadDebtWriteOffs([])).toThrow('at least one');
  });
});
