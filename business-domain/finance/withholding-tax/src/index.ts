// ── Calculators ─────────────────────────────────────────
export { computeWht, validateWhtAmounts } from './calculators/wht-engine';
export type {
  WhtComputationInput,
  WhtComputationResult,
  WhtRateConfig
} from './calculators/wht-engine';

export { computeWhtCertificate } from './calculators/wht-certificate-generation';
export type { WhtCertificateInput, WhtCertificateResult } from './calculators/wht-certificate-generation';

export { computeWhtRemittance } from './calculators/wht-remittance-calc';
export type { WhtCertificateForRemittance, WhtRemittanceInput, WhtRemittanceResult } from './calculators/wht-remittance-calc';

export { evaluateWhtExemption } from './calculators/wht-exemption-check';
export type { WhtExemptionCheckInput, WhtExemptionCheckResult } from './calculators/wht-exemption-check';

export { computeWhtReconciliation } from './calculators/wht-reconciliation';
export type { WhtReconciliationInput, WhtReconciliationResult } from './calculators/wht-reconciliation';

// ── Queries ─────────────────────────────────────────────
export {
  getActiveWhtCodes,
  getCertificatesByPayee,
  getWhtCertificate,
  getWhtCode,
  getWhtRates
} from './queries/wht-query';
export type {
  WhtCertificateReadModel,
  WhtCodeReadModel,
  WhtRateReadModel
} from './queries/wht-query';

// ── Commands ────────────────────────────────────────────
export { buildIssueCertificateIntent, buildRemitIntent } from './commands/wht-intent';

// ── Service ─────────────────────────────────────────────
export {
  fetchCertificate,
  fetchCertificatesByPayee,
  fetchWhtCodes,
  fetchWhtRates,
  issueCertificate,
  remitToAuthority
} from './services/wht-service';

