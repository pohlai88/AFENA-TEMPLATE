import type { CalculatorResult } from 'afenda-canon';

/**
 * AP-09 — Duplicate Invoice Detection
 *
 * Detects potential duplicate supplier invoices based on composite key:
 * (supplierId + invoiceNumber + amountMinor). Also flags near-duplicates
 * where amount differs by ≤ tolerance.
 *
 * Pure function — no I/O.
 */

export type InvoiceCandidate = {
  invoiceId: string;
  supplierId: string;
  invoiceNumber: string;
  amountMinor: number;
  invoiceDate: string;
};

export type DuplicateMatch = {
  existingInvoiceId: string;
  newInvoiceId: string;
  matchType: 'exact' | 'near';
  supplierId: string;
  invoiceNumber: string;
  amountDifferenceMinor: number;
};

export type DuplicateDetectionResult = {
  duplicates: DuplicateMatch[];
  hasDuplicates: boolean;
  checkedCount: number;
};

/**
 * Check a batch of new invoices against existing invoices for duplicates.
 *
 * @param existing       - Invoices already in the system
 * @param incoming       - New invoices to check
 * @param toleranceMinor - Amount tolerance for near-duplicate detection (default: 0 = exact only)
 */
export function detectDuplicateInvoices(
  existing: InvoiceCandidate[],
  incoming: InvoiceCandidate[],
  toleranceMinor: number = 0,
): CalculatorResult<DuplicateDetectionResult> {
  const duplicates: DuplicateMatch[] = [];

  const existingIndex = new Map<string, InvoiceCandidate[]>();
  for (const inv of existing) {
    const key = compositeKey(inv.supplierId, inv.invoiceNumber);
    const group = existingIndex.get(key) ?? [];
    group.push(inv);
    existingIndex.set(key, group);
  }

  for (const inc of incoming) {
    const key = compositeKey(inc.supplierId, inc.invoiceNumber);
    const matches = existingIndex.get(key);
    if (!matches) continue;

    for (const ex of matches) {
      const diff = Math.abs(ex.amountMinor - inc.amountMinor);
      if (diff === 0) {
        duplicates.push({
          existingInvoiceId: ex.invoiceId,
          newInvoiceId: inc.invoiceId,
          matchType: 'exact',
          supplierId: inc.supplierId,
          invoiceNumber: inc.invoiceNumber,
          amountDifferenceMinor: 0,
        });
      } else if (toleranceMinor > 0 && diff <= toleranceMinor) {
        duplicates.push({
          existingInvoiceId: ex.invoiceId,
          newInvoiceId: inc.invoiceId,
          matchType: 'near',
          supplierId: inc.supplierId,
          invoiceNumber: inc.invoiceNumber,
          amountDifferenceMinor: diff,
        });
      }
    }
  }

  return {
    result: {
      duplicates,
      hasDuplicates: duplicates.length > 0,
      checkedCount: incoming.length,
    },
    inputs: { existingCount: existing.length, incomingCount: incoming.length, toleranceMinor },
    explanation: `Checked ${incoming.length} invoices: ${duplicates.length} duplicates found (${duplicates.filter((d) => d.matchType === 'exact').length} exact, ${duplicates.filter((d) => d.matchType === 'near').length} near)`,
  };
}

function compositeKey(supplierId: string, invoiceNumber: string): string {
  return `${supplierId}|${invoiceNumber.trim().toLowerCase()}`;
}
