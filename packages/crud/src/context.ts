import type { ActorRef } from 'afena-canon';

/**
 * Mutation context — populated from the request environment.
 * Passed to mutate() alongside the MutationSpec.
 */
export interface MutationContext {
  requestId: string;
  actor: ActorRef;
  ip?: string;
  userAgent?: string;
  channel?: string;
}
