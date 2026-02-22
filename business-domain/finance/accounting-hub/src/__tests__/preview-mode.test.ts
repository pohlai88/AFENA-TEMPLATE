import { describe, expect, it } from 'vitest';
import { previewDerivation } from '../calculators/preview-mode';

describe('previewDerivation', () => {
  it('generates preview entries from events', () => {
    const r = previewDerivation([
      { eventId: 'E1', eventType: 'invoice', amountMinor: 10000, accountDebit: '1100', accountCredit: '4000', description: 'Sales invoice' },
      { eventId: 'E2', eventType: 'payment', amountMinor: 5000, accountDebit: '1000', accountCredit: '1100', description: 'Payment received' },
    ]);
    expect(r.result.entries.length).toBe(2);
    expect(r.result.isBalanced).toBe(true);
    expect(r.result.entries[0]!.isPreview).toBe(true);
  });

  it('throws on empty events', () => {
    expect(() => previewDerivation([])).toThrow();
  });
});
