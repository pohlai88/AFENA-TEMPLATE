/**
 * @see FIN-AP-INV-01 — AP invoice posting produces governed GL entries
 * @see FIN-AP-PAY-01 — Payments are controlled (maker-checker) and bank files hashable
 */

export { buildPaymentBatch } from './calculators/payment-scheduling';
export type { PaymentBatch, PaymentScheduleEntry } from './calculators/payment-scheduling';

export { generatePain001 } from './calculators/pain001-generator';
export type { Pain001Creditor, Pain001Header, Pain001Result } from './calculators/pain001-generator';

export { detectDuplicateInvoices } from './calculators/duplicate-invoice-detector';
export type { DuplicateDetectionResult, DuplicateMatch, InvoiceCandidate } from './calculators/duplicate-invoice-detector';

export { reconcileSupplierStatement } from './calculators/supplier-statement-recon';
export type { ReconDiscrepancy, SupplierReconResult, SupplierStatementLine } from './calculators/supplier-statement-recon';

export { computeAccruedLiabilities } from './calculators/accrued-liabilities';
export type { AccrualResult, UninvoicedGr } from './calculators/accrued-liabilities';

export { approveApInvoice, approvePaymentRun, postApInvoice, schedulePayments } from './services/payables-service';

export {
    buildApInvoiceApproveIntent,
    buildApInvoicePostIntent,
    buildPaymentApproveIntent
} from './commands/payables-intent';
export type { PayablesInvoiceApprovePayload, PayablesInvoicePostPayload, PayablesPaymentApprovePayload } from './commands/payables-intent';

