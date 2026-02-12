import { NextRequest } from 'next/server';

import { dbRo, entityViews, entityViewFields, eq, and } from 'afena-database';

import { type AuthSession, withAuth } from '@/lib/api/with-auth';

export const CAPABILITIES = ['views.read'] as const;

/**
 * GET /api/views/:entityType
 *
 * Returns entity view definitions (columns, ordering, visibility)
 * for the given entity type. Used by DataTable to render configurable views.
 */
export const GET = withAuth(async (request: NextRequest, session: AuthSession) => {
  const entityType = request.nextUrl.pathname.split('/').pop();
  if (!entityType) {
    return { ok: false as const, code: 'VALIDATION_FAILED', message: 'entityType is required' };
  }

  const views = await dbRo
    .select()
    .from(entityViews)
    .where(
      and(
        eq(entityViews.orgId, session.orgId),
        eq(entityViews.entityType, entityType),
      ),
    );

  // For each view, load its fields
  const viewsWithFields = await Promise.all(
    views.map(async (view) => {
      const fields = await dbRo
        .select()
        .from(entityViewFields)
        .where(
          and(
            eq(entityViewFields.orgId, session.orgId),
            eq(entityViewFields.viewId, view.id),
          ),
        );

      return { ...view, fields };
    }),
  );

  return { ok: true as const, data: viewsWithFields };
});
