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
