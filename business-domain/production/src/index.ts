/**
 * @afenda-production
 * 
 * Enterprise production and manufacturing execution.
 */

export {
  createWorkOrder,
  releaseWorkOrder,
  type WorkOrder,
  type WorkOrderRelease,
} from './services/work-orders.js';

export {
  createRouting,
  validateRouting,
  type Routing,
  type RoutingValidation,
} from './services/routing.js';

export {
  scheduleProduction,
  generateDispatchList,
  type ProductionSchedule,
  type DispatchList,
} from './services/scheduling.js';

export {
  reportLabor,
  issueInventory,
  type LaborReport,
  type InventoryIssue,
} from './services/shop-floor-control.js';

export {
  calculateOEE,
  analyzeThroughput,
  type OEE,
  type ThroughputAnalysis,
} from './services/production-analytics.js';
