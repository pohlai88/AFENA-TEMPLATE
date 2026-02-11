import { TEMPLATES } from './templates';
import { EXPLAIN_VERSION } from './version';

import type { AdvisoryMethod } from '../types';

/**
 * Render a deterministic explanation from method + params + score.
 * Uses the current EXPLAIN_VERSION template.
 *
 * @returns { explanation, explainVersion }
 */
export function renderExplanation(
  method: AdvisoryMethod,
  params: Record<string, unknown>,
  score: number | null,
  version: string = EXPLAIN_VERSION,
): { explanation: string; explainVersion: string } {
  const versionTemplates = TEMPLATES[version];
  if (!versionTemplates) {
    return {
      explanation: `[Unknown template version: ${version}] method=${method}, score=${score}`,
      explainVersion: version,
    };
  }

  const template = versionTemplates[method];
  if (!template) {
    return {
      explanation: `[Unknown method: ${method}] score=${score}`,
      explainVersion: version,
    };
  }

  return {
    explanation: template(params, score),
    explainVersion: version,
  };
}
