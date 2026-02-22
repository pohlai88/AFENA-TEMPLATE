import { NextRequest } from 'next/server';

import { searchAll } from 'afenda-search';

import { withAuth } from '@/lib/api/with-auth';

import type { RouteMetaStrict } from '@/lib/api/route-types';

export const ROUTE_META = {
  path: '/api/search',
  methods: ['GET'],
  tier: 'bff',
  exposeInOpenApi: false,
} as const satisfies RouteMetaStrict;

export const CAPABILITIES = ['search.global', 'contacts.search'] as const;

/**
 * GET /api/search?q=<query>&limit=<n>&types=contacts,companies
 *
 * Cross-entity search endpoint using the search_index materialized view.
 * Supports optional entity type filtering via `types` query param.
 * Tenant isolation enforced via org_id filter in the MV query.
 */
export const GET = withAuth(async (request: NextRequest) => {
  const q = request.nextUrl.searchParams.get('q')?.trim();
  const limit = Math.min(
    Number(request.nextUrl.searchParams.get('limit') ?? '10'),
    25,
  );
  const typesParam = request.nextUrl.searchParams.get('types');
  const entityTypes = typesParam ? typesParam.split(',').map((t) => t.trim()).filter(Boolean) : undefined;

  if (!q || q.length < 1) {
    return { ok: true as const, data: [] };
  }

  const results = await searchAll(q, limit, entityTypes ? { entityTypes } : undefined);
  return { ok: true as const, data: results };
});
