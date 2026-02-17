/**
 * @afenda-trade-compliance
 *
 * Global trade and customs management.
 */

// Customs Declaration
export type {
  CustomsDeclaration,
  HSCodeClassification,
  DeclarationSubmission,
  DeclarationStatus,
} from './services/customs-declaration.js';

export {
  createCustomsDeclaration,
  classifyHSCode,
  submitDeclaration,
  getDeclarationStatus,
} from './services/customs-declaration.js';

// Landed Cost
export type {
  LandedCost,
  DutyAllocation,
  LandedCostPosting,
  LandedCostSummary,
} from './services/landed-cost.js';

export {
  calculateLandedCost,
  allocateDuty,
  postLandedCost,
  getLandedCostSummary,
} from './services/landed-cost.js';

// Restricted Party
export type {
  RestrictedPartyScreening,
  DeniedPartyListUpdate,
  ExportLicenseCheck,
  ScreeningHistory,
} from './services/restricted-party.js';

export {
  screenRestrictedParty,
  updateDeniedPartyList,
  checkExportLicense,
  getScreeningHistory,
} from './services/restricted-party.js';

// Trade Documentation
export type {
  TradeDocuments,
  CommercialInvoice,
  CertificateOfOrigin,
  DocumentStatus,
} from './services/trade-documentation.js';

export {
  generateTradeDocuments,
  createCommercialInvoice,
  generateCertificateOfOrigin,
  getDocumentStatus,
} from './services/trade-documentation.js';

// Analytics
export type {
  TradeMetrics,
  DutyCostAnalysis,
  ComplianceReport,
  TradeDashboard,
} from './services/trade-analytics.js';

export {
  getTradeMetrics,
  analyzeDutyCosts,
  getComplianceReport,
  getTradeDashboard,
} from './services/trade-analytics.js';
