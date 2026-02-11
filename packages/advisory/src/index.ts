// ── Types ────────────────────────────────────────────────
export type {
  AdvisoryCategory,
  AdvisoryInput,
  AdvisoryMethod,
  AdvisoryStatus,
  ConfidenceBand,
  CusumResult,
  EvidenceInput,
  EvidenceType,
  EwmaResult,
  HoltResult,
  HoltWintersResult,
  MadOutlier,
  MadResult,
  RobustZScoreResult,
  RuleCheck,
  RuleCheckResult,
  SesResult,
  Severity,
  TimeSeriesPoint,
  ZScoreResult,
} from './types';

// ── Fingerprint ──────────────────────────────────────────
export { buildFingerprint, sha256Hex, stableStringify } from './fingerprint';

// ── Detectors ────────────────────────────────────────────
export { detectEwma } from './detectors/ewma';
export { detectCusum } from './detectors/cusum';
export { detectMad } from './detectors/mad';

// ── Forecasters ──────────────────────────────────────────
export { forecastSes } from './forecasters/ses';
export { forecastHolt } from './forecasters/holt';
export { forecastHoltWinters } from './forecasters/holt-winters';

// ── Scoring ──────────────────────────────────────────────
export { zScore, zScoreFromArray, robustZScore, computeStats } from './scoring/z-score';
export { confidenceBands, predictionInterval } from './scoring/confidence';

// ── Rules ────────────────────────────────────────────────
export {
  registerRuleCheck,
  unregisterRuleCheck,
  getRegisteredRuleChecks,
  clearRuleChecks,
  evaluateRuleChecks,
  creditLimitRule,
  agingThresholdRule,
} from './rules/rule-detector';

// ── Evidence ─────────────────────────────────────────────
export { buildEvidence, verifyEvidenceHash } from './evidence';

// ── Explain ──────────────────────────────────────────────
export { renderExplanation } from './explain/render';
export { EXPLAIN_VERSION } from './explain/version';
export { TEMPLATES } from './explain/templates';

// ── Writer ───────────────────────────────────────────────
export { writeAdvisory } from './writer';
export type { WriteAdvisoryResult } from './writer';
