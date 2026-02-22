/**
 * ACC-04: Configurable confidence thresholds for conflict resolution.
 *
 * Persisted into the signed report so audits can explain decisions later.
 */
export interface ConflictThresholds {
  autoMerge: number;
  manualReview: number;
}

export const DEFAULT_CONFLICT_THRESHOLDS: ConflictThresholds = {
  autoMerge: 60,
  manualReview: 30,
};
