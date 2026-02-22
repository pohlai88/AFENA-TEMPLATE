/**
 * E-Invoice Format Compliance Checker
 *
 * Validates that an e-invoice document meets the mandatory field
 * requirements for a given format (UBL 2.1, Peppol BIS 3.0,
 * MyInvois, Factur-X, XRechnung).
 *
 * Returns a compliance result with pass/fail and list of violations.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type FormatComplianceInput = {
  format: 'ubl' | 'peppol-bis' | 'myinvois' | 'factur-x' | 'xrechnung';
  hasInvoiceNumber: boolean;
  hasIssueDate: boolean;
  hasBuyerReference: boolean;
  hasSellerTaxId: boolean;
  hasBuyerTaxId: boolean;
  hasPaymentMeans: boolean;
  hasTaxSubtotals: boolean;
  hasDocumentTotals: boolean;
  lineCount: number;
};

export type FormatComplianceResult = {
  isCompliant: boolean;
  format: string;
  violations: string[];
  mandatoryFieldsChecked: number;
  explanation: string;
};

const FORMAT_RULES: Record<string, string[]> = {
  'ubl': ['invoiceNumber', 'issueDate', 'documentTotals', 'lines'],
  'peppol-bis': ['invoiceNumber', 'issueDate', 'buyerReference', 'sellerTaxId', 'paymentMeans', 'taxSubtotals', 'documentTotals', 'lines'],
  'myinvois': ['invoiceNumber', 'issueDate', 'sellerTaxId', 'buyerTaxId', 'taxSubtotals', 'documentTotals', 'lines'],
  'factur-x': ['invoiceNumber', 'issueDate', 'sellerTaxId', 'documentTotals', 'lines'],
  'xrechnung': ['invoiceNumber', 'issueDate', 'buyerReference', 'sellerTaxId', 'paymentMeans', 'taxSubtotals', 'documentTotals', 'lines'],
};

export function checkFormatCompliance(
  inputs: FormatComplianceInput,
): CalculatorResult<FormatComplianceResult> {
  const { format, lineCount } = inputs;

  const rules = FORMAT_RULES[format];
  if (!rules) {
    throw DomainError.validation(`Unsupported e-invoice format: ${format}`);
  }

  const fieldMap: Record<string, boolean> = {
    invoiceNumber: inputs.hasInvoiceNumber,
    issueDate: inputs.hasIssueDate,
    buyerReference: inputs.hasBuyerReference,
    sellerTaxId: inputs.hasSellerTaxId,
    buyerTaxId: inputs.hasBuyerTaxId,
    paymentMeans: inputs.hasPaymentMeans,
    taxSubtotals: inputs.hasTaxSubtotals,
    documentTotals: inputs.hasDocumentTotals,
    lines: lineCount > 0,
  };

  const violations: string[] = [];
  for (const rule of rules) {
    if (!fieldMap[rule]) {
      violations.push(`Missing mandatory field: ${rule}`);
    }
  }

  const isCompliant = violations.length === 0;

  const explanation = isCompliant
    ? `E-invoice compliant with ${format} — all ${rules.length} mandatory fields present`
    : `E-invoice non-compliant with ${format} — ${violations.length} violation(s): ${violations.join('; ')}`;

  return {
    result: {
      isCompliant,
      format,
      violations,
      mandatoryFieldsChecked: rules.length,
      explanation,
    },
    inputs: { ...inputs },
    explanation,
  };
}
