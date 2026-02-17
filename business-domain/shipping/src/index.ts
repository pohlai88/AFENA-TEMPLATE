/**
 * @afenda-shipping
 * 
 * Enterprise multi-carrier shipping management.
 */

// Carrier management
export {
  getShippingRates,
  selectCarrier,
  type RateRequest,
  type ShippingRate,
  type CarrierSelection,
} from './services/carrier-management.js';

// Label generation
export {
  generateLabel,
  voidShipment,
  type LabelParams,
  type ShippingLabel,
  type VoidResult,
} from './services/label-generation.js';

// Shipment tracking
export {
  trackShipment,
  updateTrackingStatus,
  type TrackingInfo,
  type TrackingUpdate,
} from './services/shipment-tracking.js';

// Freight management
export {
  quoteFreight,
  generateBOL,
  type FreightQuote,
  type BillOfLading,
} from './services/freight-management.js';

// Shipping analytics
export {
  analyzeCarrierPerformance,
  calculateShippingCosts,
  type CarrierPerformance,
  type ShippingCostAnalysis,
} from './services/shipping-analytics.js';
