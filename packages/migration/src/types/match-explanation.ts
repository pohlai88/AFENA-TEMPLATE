/**
 * B2: Match explanation shape — ACC-05.
 * Detectors produce MatchExplanation[] alongside the score.
 * Persisted to migration_merge_explanations.reasons as JSON array.
 */
export interface MatchExplanation {
  field: string;
  matchType: 'exact' | 'normalized' | 'fuzzy';
  scoreContribution: number;
  legacyValue?: string;
  candidateValue?: string;
}
