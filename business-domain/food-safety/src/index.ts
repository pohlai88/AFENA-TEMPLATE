export * from './types/common.js';

// HACCP Management
export {
  createHACCPPlan,
  getHACCPPlans,
  performHazardAnalysis,
  identifyCriticalControlPoints,
  type HACCPPlan,
} from './services/haccp-management';

// Traceability
export {
  createTraceabilityRecord,
  traceLotUpstream,
  traceLotDownstream,
  generateLotNumber,
  calculateTraceabilityScore,
  type TraceabilityRecord,
} from './services/traceability';

// Recall Management
export {
  initiateRecall,
  getActiveRecalls,
  identifyAffectedProducts,
  calculateRecallEffectiveness,
  generateRecallNotification,
  type Recall,
} from './services/recall-management';

// Allergen Control
export {
  createAllergenControl,
  getAllergenControls,
  validateAllergenDeclaration,
  type AllergenControl,
} from './services/allergen-control';

// Halal Certification
export {
  createCertification,
  getCertifications,
  submitProductForHalalReview,
  getProductHalalStatus,
  validateIngredientCompliance,
  assessProductionProcess,
  determineHalalStatus,
  generateHalalReport,
  checkCertificationRenewal,
  identifyHaramIngredients,
  type HalalCertification,
  type HalalCompliance,
} from './services/halal-certification';

// GMP Compliance
export {
  createGMPAudit,
  getGMPAudits,
  recordNonConformance,
  getNonConformances,
  calculateGMPScore,
  generateGMPChecklist,
  assessComplianceGap,
  prioritizeNonConformances,
  generateGMPDashboard,
  type GMPAudit,
  type GMPNonConformance,
} from './services/gmp-compliance';

