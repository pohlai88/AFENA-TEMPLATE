import { describe, expect, it } from 'vitest';
import { detectDuplicateInvoices } from '../calculators/duplicate-invoice-detector';
import type { InvoiceCandidate } from '../calculators/duplicate-invoice-detector';

const existing: InvoiceCandidate[] = [
  { invoiceId: 'ex-1', supplierId: 'sup-A', invoiceNumber: 'INV-001', amountMinor: 50000, invoiceDate: '2026-01-10' },
  { invoiceId: 'ex-2', supplierId: 'sup-B', invoiceNumber: 'INV-100', amountMinor: 30000, invoiceDate: '2026-01-15' },
  { invoiceId: 'ex-3', supplierId: 'sup-A', invoiceNumber: 'INV-002', amountMinor: 75000, invoiceDate: '2026-01-20' },
];

describe('detectDuplicateInvoices', () => {
  it('detects exact duplicate (same supplier + invoice# + amount)', () => {
    const incoming: InvoiceCandidate[] = [
      { invoiceId: 'new-1', supplierId: 'sup-A', invoiceNumber: 'INV-001', amountMinor: 50000, invoiceDate: '2026-02-01' },
    ];

    const { result } = detectDuplicateInvoices(existing, incoming);

    expect(result.hasDuplicates).toBe(true);
    expect(result.duplicates).toHaveLength(1);
    expect(result.duplicates[0]).toMatchObject({
      matchType: 'exact',
      existingInvoiceId: 'ex-1',
      newInvoiceId: 'new-1',
      amountDifferenceMinor: 0,
    });
  });

  it('returns no duplicates for unique invoices', () => {
    const incoming: InvoiceCandidate[] = [
      { invoiceId: 'new-2', supplierId: 'sup-C', invoiceNumber: 'INV-999', amountMinor: 10000, invoiceDate: '2026-02-01' },
    ];

    const { result } = detectDuplicateInvoices(existing, incoming);

    expect(result.hasDuplicates).toBe(false);
    expect(result.duplicates).toHaveLength(0);
  });

  it('does not match same invoice# from different supplier', () => {
    const incoming: InvoiceCandidate[] = [
      { invoiceId: 'new-3', supplierId: 'sup-X', invoiceNumber: 'INV-001', amountMinor: 50000, invoiceDate: '2026-02-01' },
    ];

    const { result } = detectDuplicateInvoices(existing, incoming);

    expect(result.hasDuplicates).toBe(false);
  });

  it('detects near-duplicate within tolerance', () => {
    const incoming: InvoiceCandidate[] = [
      { invoiceId: 'new-4', supplierId: 'sup-A', invoiceNumber: 'INV-001', amountMinor: 50500, invoiceDate: '2026-02-01' },
    ];

    const { result } = detectDuplicateInvoices(existing, incoming, 1000);

    expect(result.hasDuplicates).toBe(true);
    expect(result.duplicates[0]).toMatchObject({
      matchType: 'near',
      amountDifferenceMinor: 500,
    });
  });

  it('ignores near-duplicate outside tolerance', () => {
    const incoming: InvoiceCandidate[] = [
      { invoiceId: 'new-5', supplierId: 'sup-A', invoiceNumber: 'INV-001', amountMinor: 52000, invoiceDate: '2026-02-01' },
    ];

    const { result } = detectDuplicateInvoices(existing, incoming, 1000);

    expect(result.hasDuplicates).toBe(false);
  });

  it('handles case-insensitive invoice number matching', () => {
    const incoming: InvoiceCandidate[] = [
      { invoiceId: 'new-6', supplierId: 'sup-A', invoiceNumber: 'inv-001', amountMinor: 50000, invoiceDate: '2026-02-01' },
    ];

    const { result } = detectDuplicateInvoices(existing, incoming);

    expect(result.hasDuplicates).toBe(true);
  });

  it('handles multiple incoming invoices', () => {
    const incoming: InvoiceCandidate[] = [
      { invoiceId: 'new-7', supplierId: 'sup-A', invoiceNumber: 'INV-001', amountMinor: 50000, invoiceDate: '2026-02-01' },
      { invoiceId: 'new-8', supplierId: 'sup-B', invoiceNumber: 'INV-100', amountMinor: 30000, invoiceDate: '2026-02-01' },
      { invoiceId: 'new-9', supplierId: 'sup-C', invoiceNumber: 'INV-NEW', amountMinor: 10000, invoiceDate: '2026-02-01' },
    ];

    const { result } = detectDuplicateInvoices(existing, incoming);

    expect(result.checkedCount).toBe(3);
    expect(result.duplicates).toHaveLength(2);
  });

  it('returns explanation with counts', () => {
    const incoming: InvoiceCandidate[] = [
      { invoiceId: 'new-10', supplierId: 'sup-A', invoiceNumber: 'INV-001', amountMinor: 50000, invoiceDate: '2026-02-01' },
    ];

    const calc = detectDuplicateInvoices(existing, incoming);

    expect(calc.explanation).toContain('1 duplicates found');
    expect(calc.explanation).toContain('1 exact');
  });
});
