/**
 * @afenda-transportation
 * 
 * Enterprise transportation management and logistics.
 */

export {
  planLoad,
  consolidateShipments,
  type LoadPlan,
  type ShipmentConsolidation,
} from './services/load-planning.js';

export {
  optimizeRoute,
  calculateDistance,
  type RouteOptimization,
  type DistanceCalculation,
} from './services/route-optimization.js';

export {
  rateShop,
  tenderToCarrier,
  type RateComparison,
  type CarrierTender,
} from './services/carrier-selection.js';

export {
  auditFreightBill,
  fileClaim,
  type FreightAudit,
  type FreightClaim,
} from './services/freight-audit.js';

export {
  analyzeCosts,
  measurePerformance,
  type TransportCostAnalysis,
  type CarrierPerformance,
} from './services/tms-analytics.js';
