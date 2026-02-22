import { NextRequest } from 'next/server';

import { backfillSearchDocuments } from 'afenda-search';

import { requireCronSecret } from '@/lib/api/with-cron-secret';

/**
 * POST /api/internal/search/bootstrap
 *
 * One-time backfill of search_documents from contacts and companies.
 * Idempotent (UPSERT) — safe to run multiple times.
 *
 * Secured by CRON_SECRET. Call from CI or manually after deploy:
 *   curl -X POST -H "Authorization: Bearer $CRON_SECRET" https://your-app.vercel.app/api/internal/search/bootstrap
 *
 * Requires DATABASE_URL with worker role (BYPASSRLS).
 */
export async function POST(request: NextRequest) {
  const authError = requireCronSecret(request);
  if (authError) return authError;

  try {
    const result = await backfillSearchDocuments();

    return Response.json({
      ok: true as const,
      data: result,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json(
      { ok: false as const, error: { code: 'BOOTSTRAP_ERROR', message } },
      { status: 500 },
    );
  }
}
