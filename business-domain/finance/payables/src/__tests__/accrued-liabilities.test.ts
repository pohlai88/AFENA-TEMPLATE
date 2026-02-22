import { describe, expect, it } from 'vitest';

import { computeAccruedLiabilities } from '../calculators/accrued-liabilities';

describe('AP-10 — Accrued liabilities for uninvoiced GRs at period-end', () => {
  const grs = [
    { grId: 'GR-1', poNumber: 'PO-100', supplierId: 'S-1', receivedDateIso: '2025-12-15', expectedAmountMinor: 50_000, currency: 'USD' },
    { grId: 'GR-2', poNumber: 'PO-101', supplierId: 'S-2', receivedDateIso: '2025-12-28', expectedAmountMinor: 30_000, currency: 'USD' },
    { grId: 'GR-3', poNumber: 'PO-102', supplierId: 'S-1', receivedDateIso: '2026-01-05', expectedAmountMinor: 20_000, currency: 'EUR' },
  ];

  it('accrues only GRs received on or before period end', () => {
    const r = computeAccruedLiabilities(grs, '2025-12-31');
    expect(r.result.grCount).toBe(2);
    expect(r.result.totalAccrualMinor).toBe(80_000);
  });

  it('accrues all GRs when period end is after all dates', () => {
    const r = computeAccruedLiabilities(grs, '2026-02-01');
    expect(r.result.grCount).toBe(3);
    expect(r.result.totalAccrualMinor).toBe(100_000);
  });

  it('returns zero accrual when no GRs before period end', () => {
    const r = computeAccruedLiabilities(grs, '2025-01-01');
    expect(r.result.grCount).toBe(0);
    expect(r.result.totalAccrualMinor).toBe(0);
  });

  it('includes accrual entries with correct fields', () => {
    const r = computeAccruedLiabilities(grs, '2025-12-31');
    expect(r.result.accrualEntries[0]).toMatchObject({ grId: 'GR-1', poNumber: 'PO-100', accrualMinor: 50_000 });
  });

  it('throws on missing periodEndIso', () => {
    expect(() => computeAccruedLiabilities(grs, '')).toThrow('periodEndIso');
  });
});
