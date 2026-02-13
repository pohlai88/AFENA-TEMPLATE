import { resolveActions } from '../../_components/crud/server/action-resolver_server';
import { COMPANIES_CONTRACT } from '../_components/company-contract';

import type { OrgContext } from '../../_server/org-context_server';
import type { DocStatus, ResolvedActions } from 'afena-canon';

export function resolveCompanyActions(
  ctx: OrgContext,
  entity: { docStatus?: string | null; isDeleted: boolean },
): ResolvedActions {
  return resolveActions({
    contract: COMPANIES_CONTRACT,
    docStatus: (entity.docStatus as DocStatus | undefined) ?? null,
    isDeleted: entity.isDeleted,
    isLocked: false,
    actor: { userId: ctx.actor.userId, roles: ctx.actor.roles, orgRole: ctx.actor.orgRole },
  });
}
