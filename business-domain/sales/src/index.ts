/**
 * @afenda-sales
 * 
 * Enterprise sales order management with ATP/CTP and RMA processing.
 */

// Quotation management
export {
  createQuotation,
  reviseQuotation,
  convertQuoteToOrder,
  type QuotationParams,
  type QuotationRevision,
  type QuoteConversion,
} from './services/quotation-management.js';

// Order management  
export {
  createSalesOrder,
  amendSalesOrder,
  cancelSalesOrder,
  type SalesOrderParams,
  type OrderAmendment,
  type OrderCancellation,
} from './services/order-management.js';

// ATP/CTP
export {
  checkAvailableToPromise,
  checkCapableToPromise,
  reserveInventory,
  type ATPResult,
  type CTPResult,
  type InventoryReservation,
} from './services/atp-ctp.js';

// Order fulfillment
export {
  releaseOrder,
  createShipment,
  trackFulfillment,
  type OrderRelease,
  type ShipmentCreation,
  type FulfillmentStatus,
} from './services/order-fulfillment.js';

// RMA processing
export {
  createRMA,
  processReturn,
  authorizeRefund,
  type RMAParams,
  type ReturnProcessing,
  type RefundAuthorization,
} from './services/rma-processing.js';

// Sales analytics
export {
  calculateWinRate,
  analyzeOrderCycle,
  forecastRevenue,
  type WinRateMetrics,
  type OrderCycleAnalysis,
  type RevenueForecast,
} from './services/sales-analytics.js';
