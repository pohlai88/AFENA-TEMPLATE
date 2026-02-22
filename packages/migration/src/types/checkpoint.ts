import type { Cursor } from './cursor.js';

/**
 * B3: Step checkpoint contract — OPS-02.
 * Exactly one checkpoint per (job, entityType) — always overwritten via upsert.
 */
export interface StepCheckpoint {
  cursor: Cursor;
  batchIndex: number;
  loadedUpTo: number;
  transformVersion: string;
  planFingerprint?: string;
}
