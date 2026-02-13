/**
 * Reserved user ID for system-initiated mutations (background jobs, cron, workflow).
 * System bypass in policy engine requires this userId + a system channel.
 */
export const SYSTEM_ACTOR_USER_ID = 'system';

/**
 * Identity of the actor performing a mutation.
 * Populated from JWT claims + request context.
 */
export interface ActorRef {
  userId: string;
  orgId: string;
  roles?: string[];
  email?: string;
  name?: string;
}
