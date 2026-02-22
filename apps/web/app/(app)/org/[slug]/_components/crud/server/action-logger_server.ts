import { createLogger, createComponentLogger } from 'afenda-logger';

import type { ActionEnvelope } from 'afenda-canon';
import type { Logger } from 'pino';

/**
 * ActionLogger — Pino wrappers for enterprise action observability.
 * Sealed API: logActionStart, logActionSuccess, logActionError.
 *
 * Required fields: orgId, userId, entityType, entityId, kind,
 *   updateMode?, fromStatus/toStatus?, clientActionId, durationMs.
 *
 * NEVER log raw `reason` content — log presence/length only (INV-4).
 */

const base: Logger = createComponentLogger(createLogger(), 'web');

export interface ActionLogExtra {
  userId: string;
  fromStatus?: string;
  toStatus?: string;
  [key: string]: unknown;
}

export function logActionStart(
  envelope: ActionEnvelope,
  extra: ActionLogExtra,
): void {
  base.info(
    {
      event: 'action.start',
      clientActionId: envelope.clientActionId,
      orgId: envelope.orgId,
      entityType: envelope.entityType,
      entityId: envelope.entityId,
      kind: envelope.kind,
      updateMode: envelope.updateMode,
      userId: extra.userId,
      reasonProvided: !!envelope.reason,
      reasonLength: envelope.reason?.length ?? 0,
    },
    `Action start: ${envelope.entityType}.${envelope.kind}`,
  );
}

export function logActionSuccess(
  envelope: ActionEnvelope,
  extra: ActionLogExtra & { durationMs: number },
): void {
  base.info(
    {
      event: 'action.success',
      clientActionId: envelope.clientActionId,
      orgId: envelope.orgId,
      entityType: envelope.entityType,
      entityId: envelope.entityId,
      kind: envelope.kind,
      updateMode: envelope.updateMode,
      userId: extra.userId,
      fromStatus: extra.fromStatus,
      toStatus: extra.toStatus,
      durationMs: extra.durationMs,
      reasonProvided: !!envelope.reason,
      reasonLength: envelope.reason?.length ?? 0,
    },
    `Action success: ${envelope.entityType}.${envelope.kind}`,
  );
}

export function logActionError(
  envelope: ActionEnvelope,
  error: unknown,
  extra: ActionLogExtra & { durationMs: number },
): void {
  const err = error instanceof Error ? error : new Error(String(error));
  base.error(
    {
      event: 'action.error',
      clientActionId: envelope.clientActionId,
      orgId: envelope.orgId,
      entityType: envelope.entityType,
      entityId: envelope.entityId,
      kind: envelope.kind,
      updateMode: envelope.updateMode,
      userId: extra.userId,
      durationMs: extra.durationMs,
      err,
      reasonProvided: !!envelope.reason,
      reasonLength: envelope.reason?.length ?? 0,
    },
    `Action error: ${envelope.entityType}.${envelope.kind}`,
  );
}
