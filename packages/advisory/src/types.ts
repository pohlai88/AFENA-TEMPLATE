// ── Advisory Type Taxonomy ──────────────────────────────────
// Locked pattern: {category}.{metric}.{scope}
// Enforced at DB level via CHECK constraint regex.

/** Advisory category prefixes. */
export type AdvisoryCategory = 'anomaly' | 'forecast' | 'rule';

/** Severity levels. */
export type Severity = 'info' | 'warn' | 'critical';

/** Advisory status lifecycle. */
export type AdvisoryStatus = 'open' | 'ack' | 'dismissed';

/** Detection/forecast methods. */
export type AdvisoryMethod = 'EWMA' | 'CUSUM' | 'MAD' | 'SES' | 'HOLT' | 'HOLT_WINTERS' | 'RULE';

/** Evidence types. */
export type EvidenceType = 'query' | 'snapshot' | 'metric_series' | 'calculation';

// ── Time Series ─────────────────────────────────────────────

/** A single data point in a time series. */
export interface TimeSeriesPoint {
  t: number; // epoch ms or index
  value: number;
}

// ── Detector Results ────────────────────────────────────────

export interface EwmaResult {
  isAnomaly: boolean;
  residual: number;
  ewmaValue: number;
  sigma: number;
  zScore: number;
  series: { t: number; value: number; ewma: number }[];
}

export interface CusumResult {
  driftDetected: boolean;
  changePoint: number | null; // index where drift started
  cumulativeSumPos: number;
  cumulativeSumNeg: number;
  direction: 'up' | 'down' | 'none';
}

export interface MadOutlier {
  index: number;
  value: number;
  score: number; // modified z-score
}

export interface MadResult {
  outliers: MadOutlier[];
  median: number;
  mad: number;
}

// ── Forecaster Results ──────────────────────────────────────

export interface SesResult {
  forecast: number[];
  fitted: number[];
  alpha: number;
  mape: number;
  mase: number;
}

export interface HoltResult {
  forecast: number[];
  level: number;
  trend: number;
  alpha: number;
  beta: number;
  mape: number;
}

export interface HoltWintersResult {
  forecast: number[];
  level: number;
  trend: number;
  seasonal: number[];
  quantiles: { p10: number[]; p50: number[]; p90: number[] };
  alpha: number;
  beta: number;
  gamma: number;
  mape: number;
}

// ── Scoring Results ─────────────────────────────────────────

export interface ZScoreResult {
  zScore: number;
  mean: number;
  stdDev: number;
}

export interface RobustZScoreResult {
  modifiedZScore: number;
  median: number;
  mad: number;
}

export interface ConfidenceBand {
  p10: number;
  p50: number;
  p90: number;
}

// ── Rule Check ──────────────────────────────────────────────

export interface RuleCheckResult {
  triggered: boolean;
  ruleId: string;
  ruleName: string;
  message: string;
  score: number | null;
  metadata: Record<string, unknown>;
}

export interface RuleCheck {
  id: string;
  name: string;
  evaluate: (data: Record<string, unknown>) => RuleCheckResult;
}

// ── Advisory Output ─────────────────────────────────────────

/** Input to the advisory writer. */
export interface AdvisoryInput {
  orgId: string;
  type: string; // must match taxonomy regex
  severity: Severity;
  entityType?: string | undefined;
  entityId?: string | undefined;
  summary: string;
  method: AdvisoryMethod;
  params: Record<string, unknown>;
  score: number | null;
  recommendedActions?: unknown[] | undefined;
  windowStart?: Date | undefined;
  windowEnd?: Date | undefined;
  runId?: string | undefined;
}

/** Evidence to attach to an advisory. */
export interface EvidenceInput {
  evidenceType: EvidenceType;
  source: string;
  payload: Record<string, unknown>;
}
