/**
 * @afenda-receiving
 * 
 * Enterprise goods receipt and inspection management.
 * Handles receiving operations, quality inspection, RTV, and 2/3-way matching.
 */

// Goods receipt
export {
  createGoodsReceipt,
  inspectReceipt,
  acceptReceipt,
  type GoodsReceiptParams,
  type GoodsReceiptResult,
  type InspectionResult,
  type AcceptanceResult,
} from './services/goods-receipt.js';

// Return to vendor
export {
  createReturnAuthorization,
  processReturn,
  type ReturnAuthorizationParams,
  type ReturnAuthorization,
  type ReturnProcessing,
} from './services/return-to-vendor.js';

// Receipt matching
export {
  matchToOrder,
  matchToInvoice,
  resolveMatchException,
  type MatchParams,
  type MatchResult,
  type MatchException,
} from './services/receipt-matching.js';

// Put-away & storage
export {
  assignStorageLocation,
  generatePutAwayTask,
  confirmPutAway,
  type StorageAssignment,
  type PutAwayTask,
  type PutAwayConfirmation,
} from './services/put-away.js';

// Receiving analytics
export {
  calculateReceiptAccuracy,
  trackInspectionRejects,
  analyzeReceivingCycle,
  type ReceiptAccuracyMetrics,
  type InspectionRejectMetrics,
  type ReceivingCycleAnalysis,
} from './services/receiving-analytics.js';
