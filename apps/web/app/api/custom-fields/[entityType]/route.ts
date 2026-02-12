import { NextRequest } from 'next/server';

import { loadFieldDefs } from 'afena-crud';

import { type AuthSession, withAuth } from '@/lib/api/with-auth';

export const CAPABILITIES = ['custom_fields.read'] as const;

/**
 * GET /api/custom-fields/:entityType
 *
 * Returns active custom field definitions for the given entity type.
 * Used by DynamicForm and DataTable to render custom fields.
 */
export const GET = withAuth(async (request: NextRequest, session: AuthSession) => {
  const entityType = request.nextUrl.pathname.split('/').pop();
  if (!entityType) {
    return { ok: false as const, code: 'VALIDATION_FAILED', message: 'entityType is required' };
  }

  const fieldDefs = await loadFieldDefs(session.orgId, entityType);
  return { ok: true as const, data: fieldDefs };
});
