/**
 * E-Invoice Service
 *
 * Read ops: fetchEInvoice, listEInvoices
 * Write ops: issue, submit, recordClearance
 */
import type { DomainContext, DomainResult } from 'afenda-canon';
import { stableCanonicalJson } from 'afenda-canon';

import { computeInvoiceTotals } from '../calculators/invoice-totals-calc';
import { computeTaxSubtotals } from '../calculators/tax-subtotal-calc';
import { checkFormatCompliance } from '../calculators/format-compliance-check';
import {
  buildEInvoiceClearIntent,
  buildEInvoiceIssueIntent,
  buildEInvoiceSubmitIntent,
} from '../commands/einvoice-intent';

/* ---------- Write Operations ---------- */

export async function issueEInvoice(
  _ctx: DomainContext,
  input: {
    invoiceId: string;
    format: 'ubl' | 'peppol-bis' | 'myinvois' | 'factur-x' | 'xrechnung';
    recipientId: string;
    currency: string;
    issueDate: string;
    lines: Array<{
      lineNo: number;
      description: string;
      quantityMinor: number;
      unitPriceMinor: number;
      taxCode: string;
      taxRate: number;
      taxAmountMinor: number;
    }>;
    hasPaymentMeans: boolean;
    hasBuyerReference: boolean;
    sellerTaxId: string;
    buyerTaxId?: string;
  },
): Promise<DomainResult> {
  const taxSubtotalResult = computeTaxSubtotals({
    lines: input.lines.map((l) => ({
      taxCategoryId: l.taxCode,
      taxRate: l.taxRate,
      lineExtensionMinor: Math.round(l.quantityMinor * l.unitPriceMinor),
    })),
    currency: input.currency,
  });

  const lineExtensionTotal = input.lines.reduce(
    (sum, l) => sum + Math.round(l.quantityMinor * l.unitPriceMinor),
    0,
  );

  const totalsResult = computeInvoiceTotals({
    lineExtensionTotalMinor: lineExtensionTotal,
    taxTotalMinor: taxSubtotalResult.result.totalTaxAmountMinor,
  });

  const complianceResult = checkFormatCompliance({
    format: input.format,
    hasInvoiceNumber: true,
    hasIssueDate: true,
    hasBuyerReference: input.hasBuyerReference,
    hasSellerTaxId: !!input.sellerTaxId,
    hasBuyerTaxId: !!input.buyerTaxId,
    hasPaymentMeans: input.hasPaymentMeans,
    hasTaxSubtotals: taxSubtotalResult.result.subtotals.length > 0,
    hasDocumentTotals: true,
    lineCount: input.lines.length,
  });

  if (!complianceResult.result.isCompliant) {
    return {
      kind: 'read',
      data: {
        issued: false,
        violations: complianceResult.result.violations,
        explanation: complianceResult.result.explanation,
      },
    };
  }

  return {
    kind: 'intent',
    intents: [
      buildEInvoiceIssueIntent(
        {
          invoiceId: input.invoiceId,
          format: input.format,
          recipientId: input.recipientId,
          totalMinor: totalsResult.result.payableAmountMinor,
          currency: input.currency,
          issueDate: input.issueDate,
          lines: input.lines.map((l) => ({
            lineNo: l.lineNo,
            description: l.description,
            quantityMinor: l.quantityMinor,
            unitPriceMinor: l.unitPriceMinor,
            taxCode: l.taxCode,
            taxAmountMinor: l.taxAmountMinor,
          })),
        },
        stableCanonicalJson({ invoiceId: input.invoiceId }),
      ),
    ],
  };
}

export async function submitEInvoice(
  _ctx: DomainContext,
  input: {
    invoiceId: string;
    submissionId: string;
    accessPoint: string;
    submittedAt: string;
  },
): Promise<DomainResult> {
  return {
    kind: 'intent',
    intents: [
      buildEInvoiceSubmitIntent({
        invoiceId: input.invoiceId,
        submissionId: input.submissionId,
        accessPoint: input.accessPoint,
        submittedAt: input.submittedAt,
      }),
    ],
  };
}

export async function recordClearance(
  _ctx: DomainContext,
  input: {
    invoiceId: string;
    submissionId: string;
    clearanceStatus: 'cleared' | 'rejected' | 'pending';
    validationErrors?: string[];
    clearedAt?: string;
  },
): Promise<DomainResult> {
  return {
    kind: 'intent',
    intents: [
      buildEInvoiceClearIntent({
        invoiceId: input.invoiceId,
        submissionId: input.submissionId,
        clearanceStatus: input.clearanceStatus,
        ...(input.validationErrors ? { validationErrors: input.validationErrors } : {}),
        ...(input.clearedAt ? { clearedAt: input.clearedAt } : {}),
      }),
    ],
  };
}
