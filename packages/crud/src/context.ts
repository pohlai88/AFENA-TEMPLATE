import { SYSTEM_ACTOR_USER_ID } from 'afenda-canon';

import type { ActorRef, Channel, SystemChannel } from 'afenda-canon';

/**
 * Mutation context — populated from the request environment.
 * Passed to mutate() alongside the MutationSpec.
 */
export interface MutationContext {
  requestId: string;
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
): MutationContext {
  return {
    requestId: crypto.randomUUID(),
    actor: { userId: SYSTEM_ACTOR_USER_ID, orgId, roles: ['system'] },
    channel,
  };
}
