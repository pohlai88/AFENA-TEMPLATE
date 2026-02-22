import type { LegacyKey } from './legacy-key.js';
import type { MatchExplanation } from './match-explanation.js';
import type { EntityType } from './migration-job.js';

/**
 * Merge evidence for audit trail
 */
export interface MergeEvidence {
  conflictId: string;
  chosenCandidate: string;
  fieldDecisions: FieldDecision[];
  resolver: 'auto' | 'manual';
}

export interface FieldDecision {
  field: string;
  source: 'legacy' | 'afenda' | 'merged';
  value: unknown;
}

/**
 * Match candidate for conflict detection
 */
export interface MatchCandidate {
  entityId: string;
  entity: Record<string, unknown>;
  score: number;
  explanations?: MatchExplanation[];
}

/**
 * Upsert action discriminated union
 */
export type UpsertAction =
  | { kind: 'create'; legacyKey: LegacyKey; data: Record<string, unknown> }
  | { kind: 'update'; targetId: string; legacyKey: LegacyKey; data: Record<string, unknown> }
  | { kind: 'merge'; targetId: string; legacyKey: LegacyKey; data: Record<string, unknown>; evidence: MergeEvidence }
  | { kind: 'skip'; legacyKey: LegacyKey; reason: string }
  | { kind: 'manual'; legacyKey: LegacyKey; reason: string; candidates: MatchCandidate[] };

/**
 * Upsert plan - center of idempotency
 */
export interface UpsertPlan {
  jobId: string;
  entityType: EntityType;
  actions: UpsertAction[];
}

/**
 * Load result
 */
export interface LoadResult {
  created: Array<{ legacyId: string; afendaId: string }>;
  updated: Array<{ legacyId: string; afendaId: string }>;
  skipped: Array<{ legacyId: string; reason: string }>;
  failed: Array<{ legacyId: string; error: string }>;
}
