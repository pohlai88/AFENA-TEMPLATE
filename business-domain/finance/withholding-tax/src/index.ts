// ── Calculators ─────────────────────────────────────────
export { computeWht, validateWhtAmounts } from './calculators/wht-engine';
export type {
  WhtComputationInput,
  WhtComputationResult,
  WhtRateConfig,
} from './calculators/wht-engine';

// ── Queries ─────────────────────────────────────────────
export {
  getActiveWhtCodes,
  getCertificatesByPayee,
  getWhtCertificate,
  getWhtCode,
  getWhtRates,
} from './queries/wht-query';
export type {
  WhtCertificateReadModel,
  WhtCodeReadModel,
  WhtRateReadModel,
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
  remitToAuthority,
} from './services/wht-service';
