/**
 * @afenda-purchasing
 * 
 * Enterprise purchase order management and execution.
 * Handles PO lifecycle, approvals, vendor acknowledgment, and tracking.
 */

// PO creation & management
export {
  createPurchaseOrder,
  amendPurchaseOrder,
  closePurchaseOrder,
  type PurchaseOrderParams,
  type POAmendment,
  type POCloseResult,
} from './services/po-management.js';

// PO approval
export {
  submitForApproval,
  approvePurchaseOrder,
  escalatePurchaseOrder,
  type POApprovalResult,
  type ApprovalDecision,
  type EscalationResult,
} from './services/po-approval.js';

// Order tracking
export {
  acknowledgeOrder,
  updateDeliverySchedule,
  trackOrderStatus,
  type OrderAcknowledgment,
  type DeliveryScheduleUpdate,
  type OrderStatus,
} from './services/order-tracking.js';

// Expediting & follow-up
export {
  identifyOverdueOrders,
  sendVendorReminder,
  evaluateOnTimeDelivery,
  type OverdueOrder,
  type VendorReminder,
  type OnTimeDeliveryMetrics,
} from './services/expediting.js';

// PO analytics
export {
  analyzePurchaseLeadTime,
  calculatePurchaseCycle,
  trackPriceVariance,
  type LeadTimeAnalysis,
  type PurchaseCycleMetrics,
  type PriceVariance,
} from './services/po-analytics.js';
