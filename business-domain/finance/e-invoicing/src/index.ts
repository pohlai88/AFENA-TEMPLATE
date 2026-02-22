/**
 * E-Invoicing — Peppol / MyInvois / UBL / Factur-X / XRechnung
 */

/** @see FIN-EINV-01 — E-invoice queries */
export { getEInvoice, listEInvoices, getSubmission } from './queries/einvoice-query';
export type { EInvoiceReadModel, EInvoiceSubmissionReadModel } from './queries/einvoice-query';

export { computeUblLine } from './calculators/ubl-line-calc';
export type { UblLineCalcInput, UblLineCalcResult } from './calculators/ubl-line-calc';

export { computeInvoiceTotals } from './calculators/invoice-totals-calc';
export type { InvoiceTotalsInput, InvoiceTotalsResult } from './calculators/invoice-totals-calc';

export { computeTaxSubtotals } from './calculators/tax-subtotal-calc';
export type { TaxSubtotalInput, TaxSubtotalResult, TaxSubtotalEntry } from './calculators/tax-subtotal-calc';

export { checkFormatCompliance } from './calculators/format-compliance-check';
export type { FormatComplianceInput, FormatComplianceResult } from './calculators/format-compliance-check';

export { evaluateSubmissionRetry } from './calculators/submission-retry-calc';
export type { SubmissionRetryInput, SubmissionRetryResult } from './calculators/submission-retry-calc';

export {
  buildEInvoiceIssueIntent,
  buildEInvoiceSubmitIntent,
  buildEInvoiceClearIntent,
} from './commands/einvoice-intent';

/** @see FIN-EINV-01 — E-invoice service: issue + submit + clearance */
export { issueEInvoice, submitEInvoice, recordClearance } from './services/einvoice-service';
