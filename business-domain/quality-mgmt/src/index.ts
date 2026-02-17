/**
 * @afenda-quality-mgmt
 * 
 * Enterprise quality management and compliance.
 */

export {
  createInspectionPlan,
  performInspection,
  type InspectionPlan,
  type InspectionResult,
} from './services/inspections.js';

export {
  createNCR,
  disposeNCR,
  type NCR,
  type NCRDisposition,
} from './services/ncr-management.js';

export {
  initiateCAPA,
  verifyEffectiveness,
  type CAPA,
  type EffectivenessCheck,
} from './services/capa.js';

export {
  generateCOA,
  verifyCertification,
  type CertificateOfAnalysis,
  type CertificationVerification,
} from './services/certifications.js';

export {
  analyzeDefects,
  calculateCOQ,
  type DefectAnalysis,
  type CostOfQuality,
} from './services/quality-analytics.js';
