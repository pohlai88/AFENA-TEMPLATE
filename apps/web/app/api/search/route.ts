import { NextRequest } from 'next/server';

import { searchContacts } from 'afena-search';

import { withAuth } from '@/lib/api/with-auth';

export const CAPABILITIES = ['search.global', 'contacts.search'] as const;

/**
 * GET /api/search?q=<query>&limit=<n>
 *
 * Cross-entity search endpoint. Delegates to packages/search adapters.
 * RLS enforces tenant isolation automatically.
 */
export const GET = withAuth(async (request: NextRequest) => {
  const q = request.nextUrl.searchParams.get('q')?.trim();
  const limit = Math.min(
    Number(request.nextUrl.searchParams.get('limit') ?? '10'),
    25,
  );

  if (!q || q.length < 1) {
    return { ok: true as const, data: [] };
  }

  const results = await searchContacts(q, limit);
  return { ok: true as const, data: results };
});
