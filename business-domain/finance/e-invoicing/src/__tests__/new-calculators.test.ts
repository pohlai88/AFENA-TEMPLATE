import { describe, expect, it } from 'vitest';

import { computeUblLine } from '../calculators/ubl-line-calc';
import { computeInvoiceTotals } from '../calculators/invoice-totals-calc';
import { computeTaxSubtotals } from '../calculators/tax-subtotal-calc';
import { checkFormatCompliance } from '../calculators/format-compliance-check';
import { evaluateSubmissionRetry } from '../calculators/submission-retry-calc';

describe('computeUblLine', () => {
  it('computes line totals correctly', () => {
    const { result } = computeUblLine({
      lineNo: 1, description: 'Widget', quantity: 10,
      unitPriceMinor: 1000, taxRate: 0.06,
    });
    expect(result.lineExtensionMinor).toBe(10_000);
    expect(result.taxAmountMinor).toBe(600);
    expect(result.lineInclusiveMinor).toBe(10_600);
  });

  it('applies allowance and charge', () => {
    const { result } = computeUblLine({
      lineNo: 1, description: 'Service', quantity: 1,
      unitPriceMinor: 50_000, taxRate: 0.10,
      allowanceMinor: 5_000, chargeMinor: 2_000,
    });
    expect(result.lineExtensionMinor).toBe(47_000);
    expect(result.taxAmountMinor).toBe(4_700);
    expect(result.lineInclusiveMinor).toBe(51_700);
  });

  it('throws on zero quantity', () => {
    expect(() => computeUblLine({
      lineNo: 1, description: 'X', quantity: 0,
      unitPriceMinor: 100, taxRate: 0.06,
    })).toThrow('Quantity must be positive');
  });

  it('throws on invalid tax rate', () => {
    expect(() => computeUblLine({
      lineNo: 1, description: 'X', quantity: 1,
      unitPriceMinor: 100, taxRate: 1.5,
    })).toThrow('Tax rate must be between');
  });
});

describe('computeInvoiceTotals', () => {
  it('computes document totals', () => {
    const { result } = computeInvoiceTotals({
      lineExtensionTotalMinor: 100_000, taxTotalMinor: 6_000,
    });
    expect(result.taxExclusiveAmountMinor).toBe(100_000);
    expect(result.taxInclusiveAmountMinor).toBe(106_000);
    expect(result.payableAmountMinor).toBe(106_000);
  });

  it('applies document allowance, charge, prepaid, rounding', () => {
    const { result } = computeInvoiceTotals({
      lineExtensionTotalMinor: 100_000, taxTotalMinor: 6_000,
      documentAllowanceMinor: 5_000, documentChargeMinor: 2_000,
      prepaidAmountMinor: 10_000, roundingMinor: -50,
    });
    expect(result.taxExclusiveAmountMinor).toBe(97_000);
    expect(result.taxInclusiveAmountMinor).toBe(103_000);
    expect(result.payableAmountMinor).toBe(92_950);
  });

  it('throws on negative line extension', () => {
    expect(() => computeInvoiceTotals({
      lineExtensionTotalMinor: -1, taxTotalMinor: 0,
    })).toThrow('cannot be negative');
  });
});

describe('computeTaxSubtotals', () => {
  it('groups by tax category', () => {
    const { result } = computeTaxSubtotals({
      lines: [
        { taxCategoryId: 'S', taxRate: 0.06, lineExtensionMinor: 50_000 },
        { taxCategoryId: 'S', taxRate: 0.06, lineExtensionMinor: 30_000 },
        { taxCategoryId: 'E', taxRate: 0, lineExtensionMinor: 20_000 },
      ],
      currency: 'MYR',
    });
    expect(result.subtotals).toHaveLength(2);
    expect(result.totalTaxAmountMinor).toBe(4_800);
    expect(result.categoryCount).toBe(2);
  });

  it('throws on empty lines', () => {
    expect(() => computeTaxSubtotals({ lines: [], currency: 'USD' }))
      .toThrow('At least one line');
  });
});

describe('checkFormatCompliance', () => {
  it('passes for compliant Peppol BIS invoice', () => {
    const { result } = checkFormatCompliance({
      format: 'peppol-bis',
      hasInvoiceNumber: true, hasIssueDate: true,
      hasBuyerReference: true, hasSellerTaxId: true,
      hasBuyerTaxId: false, hasPaymentMeans: true,
      hasTaxSubtotals: true, hasDocumentTotals: true,
      lineCount: 3,
    });
    expect(result.isCompliant).toBe(true);
    expect(result.violations).toHaveLength(0);
  });

  it('fails for missing mandatory fields', () => {
    const { result } = checkFormatCompliance({
      format: 'peppol-bis',
      hasInvoiceNumber: true, hasIssueDate: true,
      hasBuyerReference: false, hasSellerTaxId: false,
      hasBuyerTaxId: false, hasPaymentMeans: false,
      hasTaxSubtotals: true, hasDocumentTotals: true,
      lineCount: 1,
    });
    expect(result.isCompliant).toBe(false);
    expect(result.violations.length).toBe(3);
  });

  it('validates MyInvois format requires buyer tax ID', () => {
    const { result } = checkFormatCompliance({
      format: 'myinvois',
      hasInvoiceNumber: true, hasIssueDate: true,
      hasBuyerReference: false, hasSellerTaxId: true,
      hasBuyerTaxId: false, hasPaymentMeans: false,
      hasTaxSubtotals: true, hasDocumentTotals: true,
      lineCount: 1,
    });
    expect(result.isCompliant).toBe(false);
    expect(result.violations).toContain('Missing mandatory field: buyerTaxId');
  });

  it('throws on unsupported format', () => {
    expect(() => checkFormatCompliance({
      format: 'unknown' as 'ubl',
      hasInvoiceNumber: true, hasIssueDate: true,
      hasBuyerReference: false, hasSellerTaxId: false,
      hasBuyerTaxId: false, hasPaymentMeans: false,
      hasTaxSubtotals: false, hasDocumentTotals: false,
      lineCount: 0,
    })).toThrow('Unsupported e-invoice format');
  });
});

describe('evaluateSubmissionRetry', () => {
  it('retries on transient error', () => {
    const { result } = evaluateSubmissionRetry({
      submissionId: 's1', attemptCount: 2, maxRetries: 5,
      baseDelayMs: 1000, lastErrorCode: 'TIMEOUT', isTransient: true,
    });
    expect(result.shouldRetry).toBe(true);
    expect(result.nextDelayMs).toBe(4_000);
    expect(result.attemptsRemaining).toBe(3);
  });

  it('does not retry on permanent error', () => {
    const { result } = evaluateSubmissionRetry({
      submissionId: 's1', attemptCount: 1, maxRetries: 5,
      baseDelayMs: 1000, lastErrorCode: 'INVALID_FORMAT', isTransient: false,
    });
    expect(result.shouldRetry).toBe(false);
    expect(result.reason).toContain('permanent_error');
  });

  it('does not retry when max retries exceeded', () => {
    const { result } = evaluateSubmissionRetry({
      submissionId: 's1', attemptCount: 5, maxRetries: 5,
      baseDelayMs: 1000, lastErrorCode: 'TIMEOUT', isTransient: true,
    });
    expect(result.shouldRetry).toBe(false);
    expect(result.reason).toBe('max_retries_exceeded');
  });

  it('caps delay at 300s', () => {
    const { result } = evaluateSubmissionRetry({
      submissionId: 's1', attemptCount: 20, maxRetries: 25,
      baseDelayMs: 1000, lastErrorCode: 'TIMEOUT', isTransient: true,
    });
    expect(result.nextDelayMs).toBe(300_000);
  });

  it('throws on negative attempt count', () => {
    expect(() => evaluateSubmissionRetry({
      submissionId: 's1', attemptCount: -1, maxRetries: 5,
      baseDelayMs: 1000, lastErrorCode: 'X', isTransient: true,
    })).toThrow('cannot be negative');
  });
});
