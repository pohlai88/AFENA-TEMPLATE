import { NextRequest, NextResponse } from 'next/server';

import { searchContacts } from 'afena-search';

import { auth } from '@/lib/auth/server';

/**
 * GET /api/search?q=<query>&limit=<n>
 *
 * Cross-entity search endpoint. Delegates to packages/search adapters.
 * RLS enforces tenant isolation automatically.
 */
export async function GET(request: NextRequest) {
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const q = request.nextUrl.searchParams.get('q')?.trim();
  const limit = Math.min(
    Number(request.nextUrl.searchParams.get('limit') ?? '10'),
    25,
  );

  if (!q || q.length < 1) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchContacts(q, limit);
    return NextResponse.json({ results });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Search failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
