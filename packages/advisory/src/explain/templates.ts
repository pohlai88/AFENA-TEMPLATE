import type { AdvisoryMethod } from '../types';

/**
 * Pure string templates per method, keyed by explain_version.
 * Deterministic: same params + score → same explanation. Always.
 */

type TemplateParams = Record<string, unknown>;
type TemplateFn = (params: TemplateParams, score: number | null) => string;

const V1_TEMPLATES: Record<AdvisoryMethod, TemplateFn> = {
  EWMA: (params, score) => {
    const alpha = params['alpha'] ?? '?';
    const window = params['window'] ?? '?';
    const threshold = params['threshold'] ?? '?';
    const residual = typeof score === 'number' ? score.toFixed(1) : '?';
    return `EWMA residual = ${residual}σ (alpha=${alpha}, window=${window}, threshold=${threshold}σ)`;
  },

  CUSUM: (params, _score) => {
    const direction = params['direction'] ?? 'unknown';
    const changePoint = params['changePoint'] ?? '?';
    const k = params['k'] ?? '?';
    const h = params['h'] ?? '?';
    return `CUSUM drift detected (direction=${direction}, change-point=${changePoint}, k=${k}, h=${h})`;
  },

  MAD: (params, score) => {
    const median = params['median'] ?? '?';
    const mad = params['mad'] ?? '?';
    const zScore = typeof score === 'number' ? score.toFixed(1) : '?';
    return `Modified z-score = ${zScore} (median=${median}, MAD=${mad})`;
  },

  SES: (params, _score) => {
    const alpha = params['alpha'] ?? '?';
    const horizon = params['horizon'] ?? '?';
    const mape = params['mape'] ?? '?';
    return `SES forecast (alpha=${alpha}, horizon=${horizon}, MAPE=${mape}%)`;
  },

  HOLT: (params, _score) => {
    const alpha = params['alpha'] ?? '?';
    const beta = params['beta'] ?? '?';
    const horizon = params['horizon'] ?? '?';
    const mape = params['mape'] ?? '?';
    return `Holt forecast (alpha=${alpha}, beta=${beta}, horizon=${horizon}, MAPE=${mape}%)`;
  },

  HOLT_WINTERS: (params, _score) => {
    const alpha = params['alpha'] ?? '?';
    const beta = params['beta'] ?? '?';
    const gamma = params['gamma'] ?? '?';
    const seasonLength = params['seasonLength'] ?? '?';
    const horizon = params['horizon'] ?? '?';
    const mape = params['mape'] ?? '?';
    return `Holt-Winters forecast (alpha=${alpha}, beta=${beta}, gamma=${gamma}, season=${seasonLength}, horizon=${horizon}, MAPE=${mape}%)`;
  },

  RULE: (params, _score) => {
    const ruleName = params['ruleName'] ?? 'Unknown rule';
    const message = params['message'] ?? '';
    return `Rule: ${ruleName}${message ? ` — ${message}` : ''}`;
  },
};

/** All template versions. */
export const TEMPLATES: Record<string, Record<AdvisoryMethod, TemplateFn>> = {
  v1: V1_TEMPLATES,
};
