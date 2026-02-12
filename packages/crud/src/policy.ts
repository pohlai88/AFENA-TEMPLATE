import type { MutationContext } from './context';
import type { MutationSpec } from 'afena-canon';

/**
 * Placeholder policy enforcement.
 * Phase 1: always passes. Phase 2+ will add real RBAC checks.
 */
export function enforcePolicy(
  _spec: MutationSpec,
  _ctx: MutationContext,
): void {
  // Phase 1: no policy checks beyond RLS (which is enforced at DB level)
}

/** Capture authority snapshot for audit log. */
export function captureAuthoritySnapshot(ctx: MutationContext): Record<string, unknown> {
  return {
    userId: ctx.actor.userId,
    orgId: ctx.actor.orgId,
    roles: ctx.actor.roles ?? [],
    channel: ctx.channel ?? 'web_ui',
  };
}
