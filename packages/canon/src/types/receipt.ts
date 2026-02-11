import type { ErrorCode } from './errors';

/**
 * Append-only mutation receipt returned by mutate().
 *
 * K-07: status is deterministic (ok / rejected / error).
 * K-12: auditLogId, versionAfter, and entityId are null when status != 'ok' AND action is create.
 *       For update/delete/restore rejected: entityId is set (from spec), auditLogId and versionAfter null.
 */
export type ReceiptStatus = 'ok' | 'rejected' | 'error';

export interface Receipt {
  requestId: string;
  mutationId: string;
  batchId?: string | undefined;
  entityId: string | null;
  entityType: string;
  versionBefore: number | null;
  versionAfter: number | null;
  status: ReceiptStatus;
  auditLogId: string | null;
  errorCode?: ErrorCode | undefined;
}
