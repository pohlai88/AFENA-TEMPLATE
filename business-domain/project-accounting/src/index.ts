/**
 * @afenda-project-accounting
 * 
 * Enterprise project accounting and cost management.
 */

export {
  createWorkBreakdownStructure,
  updateWBSElement,
  type WorkBreakdownStructure,
  type WBSElement,
} from './services/wbs.js';

export {
  recordProjectCost,
  allocateCost,
  type ProjectCost,
  type CostAllocation,
} from './services/cost-tracking.js';

export {
  generateProjectInvoice,
  recognizeRevenue,
  type ProjectInvoice,
  type RevenueRecognition,
} from './services/billing.js';

export {
  createChangeOrder,
  approveChangeOrder,
  type ChangeOrder,
  type ChangeOrderApproval,
} from './services/change-orders.js';

export {
  calculateEarnedValue,
  forecastProjectCompletion,
  type EarnedValueMetrics,
  type CompletionForecast,
} from './services/project-analytics.js';
