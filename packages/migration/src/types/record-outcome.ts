/**
 * B1: Terminal outcome type — authoritative.
 * Every record processed by the engine MUST end in exactly one terminal state.
 */
export type TerminalStatus = 'loaded' | 'quarantined' | 'manual_review' | 'skipped';

export interface RecordOutcome {
  entityType: string;
  legacyId: string;
  status: TerminalStatus;

  action?: 'create' | 'update' | 'merge' | 'skip';
  targetId?: string;
  score?: number;

  attemptId?: string;
  failureStage?: 'extract' | 'transform' | 'detect' | 'reserve' | 'load' | 'snapshot';
  errorCode?: string;
  errorClass?: 'transient' | 'permanent';
}
