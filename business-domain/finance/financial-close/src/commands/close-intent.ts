/**
 * Financial Close Intent Builders
 *
 * Constructs DomainIntent objects for close operations.
 * Intent types: close.task.complete, close.run.finalize,
 *               close.adjustment.post, close.lock.hard
 */
import type {
  CloseAdjustmentPostPayload,
  CloseLockHardPayload,
  CloseRunFinalizePayload,
  CloseTaskCompletePayload,
  DomainIntent,
} from 'afenda-canon';
import { stableCanonicalJson } from 'afenda-canon';

export function buildCompleteTaskIntent(
  payload: CloseTaskCompletePayload,
  idempotencyKey?: string,
): DomainIntent {
  return {
    type: 'close.task.complete',
    payload,
    idempotencyKey:
      idempotencyKey ??
      stableCanonicalJson({ closeRunId: payload.closeRunId, taskId: payload.taskId }),
  };
}

export function buildFinalizeRunIntent(
  payload: CloseRunFinalizePayload,
  idempotencyKey?: string,
): DomainIntent {
  return {
    type: 'close.run.finalize',
    payload,
    idempotencyKey:
      idempotencyKey ??
      stableCanonicalJson({
        closeRunId: payload.closeRunId,
        periodKey: payload.periodKey,
        companyId: payload.companyId,
      }),
  };
}

export function buildAdjustmentPostIntent(
  payload: CloseAdjustmentPostPayload,
  idempotencyKey?: string,
): DomainIntent {
  return {
    type: 'close.adjustment.post',
    payload,
    idempotencyKey:
      idempotencyKey ??
      stableCanonicalJson({
        closeRunId: payload.closeRunId,
        journalId: payload.journalId,
      }),
  };
}

export function buildHardLockIntent(
  payload: CloseLockHardPayload,
  idempotencyKey?: string,
): DomainIntent {
  return {
    type: 'close.lock.hard',
    payload,
    idempotencyKey:
      idempotencyKey ??
      stableCanonicalJson({
        closeRunId: payload.closeRunId,
        periodKey: payload.periodKey,
        ledgerId: payload.ledgerId,
      }),
  };
}
