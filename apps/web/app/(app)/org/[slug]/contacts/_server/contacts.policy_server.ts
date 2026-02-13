
import { resolveActions } from '../../_components/crud/server/action-resolver_server';
import { CONTACT_CONTRACT } from '../_components/contact-contract';

import type { OrgContext } from '../../_server/org-context_server';
import type { ResolvedActions } from 'afena-canon';

/**
 * Resolve contact actions for the current actor + entity state.
 * Server-only (INV-3: SoD enforcement is server-only).
 */
export function resolveContactActions(
  ctx: OrgContext,
  entity: {
    docStatus: string | null;
    isDeleted: boolean;
    isLocked?: boolean;
    submitterUserId?: string;
  },
): ResolvedActions {
  return resolveActions({
    contract: CONTACT_CONTRACT,
    docStatus: (entity.docStatus as 'draft' | 'submitted' | 'active' | 'cancelled' | 'amended') ?? null,
    isDeleted: entity.isDeleted,
    isLocked: entity.isLocked ?? false,
    actor: {
      userId: ctx.actor.userId,
      roles: ctx.actor.roles,
      orgRole: ctx.actor.orgRole,
    },
    ...(entity.submitterUserId ? { submitterUserId: entity.submitterUserId } : {}),
  });
}

/**
 * Resolve actions for a list of contacts — returns a serializable map.
 * Keeps the per-row resolution loop out of page.tsx.
 */
export function resolveContactListActions(
  ctx: OrgContext,
  rows: { id: string; doc_status: string | null; is_deleted: boolean }[],
): Record<string, ResolvedActions> {
  const result: Record<string, ResolvedActions> = {};
  for (const row of rows) {
    result[row.id] = resolveContactActions(ctx, {
      docStatus: row.doc_status,
      isDeleted: row.is_deleted,
    });
  }
  return result;
}
