import Fuse from 'fuse.js';

import type { MatchExplanation } from '../types/match-explanation.js';

/**
 * ACC-03: Fuzzy name matching using Fuse.js.
 *
 * Provides a configurable fuzzy matcher for name fields.
 * Returns a score (0–1, where 0 = perfect match) and a MatchExplanation.
 *
 * Designed to be composed into conflict detectors — not a standalone detector.
 */

export interface FuzzyMatchConfig {
  threshold?: number;
  scoreWeight?: number;
  field?: string;
}

export interface FuzzyMatchResult {
  candidateIndex: number;
  candidateValue: string;
  fuseScore: number;
  normalizedScore: number;
  explanation: MatchExplanation;
}

const DEFAULT_THRESHOLD = 0.4;
const DEFAULT_SCORE_WEIGHT = 20;
const DEFAULT_FIELD = 'name';

/**
 * Fuzzy-match a single legacy name against a list of candidate names.
 * Returns matches sorted by best score first.
 */
export function fuzzyMatchName(
  legacyValue: string,
  candidates: Array<{ index: number; value: string }>,
  config?: FuzzyMatchConfig,
): FuzzyMatchResult[] {
  const threshold = config?.threshold ?? DEFAULT_THRESHOLD;
  const scoreWeight = config?.scoreWeight ?? DEFAULT_SCORE_WEIGHT;
  const field = config?.field ?? DEFAULT_FIELD;

  if (!legacyValue || candidates.length === 0) return [];

  const fuse = new Fuse(
    candidates.map((c) => ({ idx: c.index, name: c.value })),
    {
      keys: ['name'],
      threshold,
      includeScore: true,
      isCaseSensitive: false,
    },
  );

  const results = fuse.search(legacyValue);

  return results.map((r) => {
    const fuseScore = r.score ?? 1;
    const normalizedScore = Math.round((1 - fuseScore) * scoreWeight);

    return {
      candidateIndex: r.item.idx,
      candidateValue: r.item.name,
      fuseScore,
      normalizedScore,
      explanation: {
        field,
        matchType: 'fuzzy' as const,
        scoreContribution: normalizedScore,
        legacyValue,
        candidateValue: r.item.name,
      },
    };
  });
}

/**
 * Batch fuzzy-match: match each legacy name against all candidates.
 * Returns a map of legacyIndex → best FuzzyMatchResult[].
 */
export function batchFuzzyMatchNames(
  legacyNames: Array<{ index: number; value: string }>,
  candidateNames: Array<{ index: number; value: string }>,
  config?: FuzzyMatchConfig,
): Map<number, FuzzyMatchResult[]> {
  const resultMap = new Map<number, FuzzyMatchResult[]>();

  for (const legacy of legacyNames) {
    if (!legacy.value) continue;
    const matches = fuzzyMatchName(legacy.value, candidateNames, config);
    if (matches.length > 0) {
      resultMap.set(legacy.index, matches);
    }
  }

  return resultMap;
}
