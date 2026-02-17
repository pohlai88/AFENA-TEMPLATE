/**
 * @afenda-receivables
 * 
 * Enterprise accounts receivable and collections management.
 */

// Invoice processing
export {
  generateCustomerInvoice,
  createCreditMemo,
  type CustomerInvoiceParams,
  type CustomerInvoice,
  type CreditMemo,
} from './services/invoice-processing.js';

// Payment application
export {
  applyPayment,
  matchPayment,
  type PaymentApplication,
  type PaymentMatch,
} from './services/payment-application.js';

// Collections
export {
  createDunningWorkflow,
  generateCollectionLetter,
  type DunningWorkflow,
  type CollectionLetter,
} from './services/collections.js';

// Credit management
export {
  evaluateCreditLimit,
  placeCreditHold,
  type CreditEvaluation,
  type CreditHold,
} from './services/credit-management.js';

// AR analytics
export {
  calculateDSO,
  generateAgingReport,
  type DSOMetrics,
  type ARAgingReport,
} from './services/receivables-analytics.js';
