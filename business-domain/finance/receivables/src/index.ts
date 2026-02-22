/**
 * @see FIN-AR-INV-01 — AR invoice posting generates GL entries, respects credit policy
 */

export { computeAging } from './calculators/aging';
export type { AgingBucket, AgingReport } from './calculators/aging';

export { getReceivablesAging, postArInvoice } from './services/receivables-service';
export type { OutstandingInvoice } from './services/receivables-service';

export { buildArInvoicePostIntent } from './commands/receivables-intent';
export type { ArInvoicePostPayload } from './commands/receivables-intent';

export { evaluateFactoring } from './calculators/factoring';
export type { FactoringInput, FactoringResult } from './calculators/factoring';

export { planCollectionActions } from './calculators/collection-tracking';
export type {
  CollectionPlan,
  CollectionPlanResult,
  OverdueInvoice,
} from './calculators/collection-tracking';

export { classifyContractBalances } from './calculators/revenue-ar-bridge';
export type {
  ContractBalanceClassification,
  ContractRevenueData,
  RevenueBridgeResult,
} from './calculators/revenue-ar-bridge';

export { evaluateWriteOff } from './calculators/write-off';
export type { WriteOffRequest, WriteOffResult } from './calculators/write-off';

export { computeCreditNote } from './calculators/credit-note';
export type { CreditNoteInput, CreditNoteLine, CreditNoteResult } from './calculators/credit-note';

export { matchIcReceivables } from './calculators/ic-receivable-match';
export type { IcMatchResult, IcReceivableEntry } from './calculators/ic-receivable-match';

// ── Payments ────────────────────────────────────────────────
export { buildPaymentCreateIntent } from './commands/payment-intent';
export type { PaymentReadModel } from './queries/payment-query';
export {
  createPayment,
  getPayment,
  listBankAccountPayments,
  listPartyPayments,
} from './services/payment-service';
