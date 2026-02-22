import { describe, expect, it } from 'vitest';
import { evaluateWriteOff } from '../calculators/write-off';

describe('evaluateWriteOff', () => {
  it('auto-approves small write-offs', () => {
    const r = evaluateWriteOff({ invoiceId: 'INV-1', customerName: 'Acme', outstandingMinor: 5000, daysPastDue: 90, approverRole: 'auto', reason: 'Uncollectable' });
    expect(r.result.approved).toBe(true);
    expect(r.result.approvalLevel).toBe('auto');
    expect(r.result.writeOffMinor).toBe(5000);
  });

  it('requires manager for medium amounts', () => {
    const r = evaluateWriteOff({ invoiceId: 'INV-2', customerName: 'Beta', outstandingMinor: 50_000, daysPastDue: 180, approverRole: 'auto', reason: 'Bankrupt' });
    expect(r.result.approved).toBe(false);
    expect(r.result.approvalLevel).toBe('manager');
  });

  it('approves when approver rank meets requirement', () => {
    const r = evaluateWriteOff({ invoiceId: 'INV-3', customerName: 'Gamma', outstandingMinor: 50_000, daysPastDue: 180, approverRole: 'director', reason: 'Settled' });
    expect(r.result.approved).toBe(true);
  });

  it('throws on zero amount', () => {
    expect(() => evaluateWriteOff({ invoiceId: 'X', customerName: 'X', outstandingMinor: 0, daysPastDue: 10, approverRole: 'auto', reason: 'x' })).toThrow('positive');
  });
});
