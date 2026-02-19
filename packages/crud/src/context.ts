import { SYSTEM_ACTOR_USER_ID } from 'afenda-canon';

import type { ActorRef, Channel, SystemChannel } from 'afenda-canon';

/**
 * Mutation context — populated from the request environment.
 * Passed to mutate() alongside the MutationSpec.
 */
export interface MutationContext {
  requestId: string;
  /** Set by batch/job callers to correlate multiple mutations. Surfaces in receipts + audit logs. */
  mutationBatchId?: string;
  actor: ActorRef;
  ip?: string;
  userAgent?: string;
  channel?: Channel;
}

/**
 * Build a MutationContext for system-initiated mutations (background jobs, cron, workflow).
 * System bypass in policy engine requires SYSTEM_ACTOR_USER_ID + a system channel.
 */
export function buildSystemContext(
  orgId: string,
  channel: SystemChannel,
  options?: { mutationBatchId?: string },
): MutationContext {
  return {
    requestId: crypto.randomUUID(),
    actor: { userId: SYSTEM_ACTOR_USER_ID, orgId, roles: ['system'] },
    channel,
    ...(options?.mutationBatchId !== undefined ? { mutationBatchId: options.mutationBatchId } : {}),
  };
}

/**
 * Build a MutationContext for user-initiated mutations (web UI, API requests).
 *
 * Usage:
 *   const ctx = buildUserContext({ orgId, userId, channel: 'web_ui', ip, userAgent });
 *   await mutate(spec, ctx);
 */
export function buildUserContext(params: {
  orgId: string;
  userId: string;
  /** Display name — surfaced in audit logs. Defaults to null. */
  userName?: string;
  /** JWT roles from the session token. Defaults to []. */
  roles?: string[];
  /** Email address — stored in ActorRef for audit trail. */
  email?: string;
  /** Request channel. Defaults to 'web_ui'. */
  channel?: Channel;
  /** Originating IP for rate limiting + audit. */
  ip?: string;
  /** User-Agent header for audit trail. */
  userAgent?: string;
  /** Group ID for batch jobs — correlates multiple mutations in receipts + audit logs. */
  mutationBatchId?: string;
}): MutationContext {
  return {
    requestId: crypto.randomUUID(),
    actor: {
      userId: params.userId,
      orgId: params.orgId,
      roles: params.roles ?? [],
      ...(params.userName !== undefined ? { name: params.userName } : {}),
      ...(params.email !== undefined ? { email: params.email } : {}),
    },
    channel: params.channel ?? 'web_ui',
    ...(params.ip !== undefined ? { ip: params.ip } : {}),
    ...(params.userAgent !== undefined ? { userAgent: params.userAgent } : {}),
    ...(params.mutationBatchId !== undefined ? { mutationBatchId: params.mutationBatchId } : {}),
  };
}
