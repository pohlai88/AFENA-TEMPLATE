/**
 * @afenda-supplier-portal
 * 
 * Enterprise supplier collaboration and self-service.
 */

export {
  acknowledgePO,
  submitASN,
  type POAcknowledgment,
  type AdvanceShipNotice,
} from './services/self-service.js';

export {
  respondToRFQ,
  submitECR,
  type RFQResponse,
  type EngineeringChangeRequest,
} from './services/collaboration.js';

export {
  generateScorecard,
  rateSupplier,
  type SupplierScorecard,
  type SupplierRating,
} from './services/performance-scorecards.js';

export {
  sendMessage,
  shareDocument,
  type SupplierMessage,
  type SharedDocument,
} from './services/communications.js';

export {
  trackUsage,
  measureEngagement,
  type PortalUsage,
  type EngagementMetrics,
} from './services/portal-analytics.js';
