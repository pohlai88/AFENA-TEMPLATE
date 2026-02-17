/**
 * @afenda-payables  
 * 
 * Enterprise accounts payable and invoice processing.
 * Handles invoice capture, approval routing, payment execution, and AP analytics.
 */

// Invoice management
export {
  captureInvoice,
  validateInvoice,
  codeInvoice,
  type InvoiceParams,
  type InvoiceValidation,
  type InvoiceCoding,
} from './services/invoice-management.js';

// Approval routing
export {
  submitForApproval,
  approveInvoice,
  calculateEarlyPaymentDiscount,
  type ApprovalParams,
  type ApprovalResult,
  type DiscountCalculation,
} from './services/invoice-approval.js';

// Payment execution
export {
  createPaymentProposal,
  executePaymentRun,
  generatePaymentFile,
  type PaymentProposal,
  type PaymentRun,
  type PaymentFile,
} from './services/payment-execution.js';

// Vendor statements
export {
  reconcileVendorStatement,
  generateAgingReport,
  manageCreditLimit,
  type StatementReconciliation,
  type AgingReport,
  type CreditLimit,
} from './services/vendor-statements.js';

// AP analytics
export {
  calculateDPO,
  trackDiscountCapture,
  forecastCashflow,
  type DPOMetrics,
  type DiscountMetrics,
  type CashflowForecast,
} from './services/payables-analytics.js';
