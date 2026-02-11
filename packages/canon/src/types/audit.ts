import type { ActionFamily } from './action';
import type { JsonValue } from './mutation';

/**
 * TypeScript representation of an audit_logs row.
 * 9W1H+Quant: Who, What, When, Where, Why, Which, How, How-much, Whom, Whence + Quantitative.
 *
 * Base fields + 3 JSONB payload columns (before, after, diff).
 */
export interface AuditLogEntry {
  id: string;
  orgId: string;
  actorUserId: string;
  actionType: string;
  actionFamily: ActionFamily;
  entityType: string;
  entityId: string;
  requestId: string | null;
  mutationId: string;
  batchId: string | null;
  versionBefore: number | null;
  versionAfter: number;
  channel: string;
  ip: string | null;
  userAgent: string | null;
  reason: string | null;
  authoritySnapshot: JsonValue | null;
  idempotencyKey: string | null;
  affectedCount: number;
  valueDelta: JsonValue | null;
  createdAt: string;

  // Payload (3 JSONB)
  before: JsonValue | null;
  after: JsonValue | null;
  diff: JsonValue | null;
}
