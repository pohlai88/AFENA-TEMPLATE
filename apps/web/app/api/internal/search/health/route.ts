import { NextRequest } from 'next/server';

import { dbSearchWorker, sql } from 'afena-database';

import { requireCronSecret } from '@/lib/api/with-cron-secret';

/**
 * GET /api/internal/search/health
 *
 * Search health check (GAP-DB-004).
 * - total_documents: count of search_documents
 * - org_count: number of orgs with at least one document (sanity: > 0 when warmed)
 *
 * Secured by CRON_SECRET. Uses SEARCH_WORKER_DATABASE_URL.
 */
export async function GET(request: NextRequest) {
  const authError = requireCronSecret(request);
  if (authError) return authError;

  try {
    const result = await dbSearchWorker.execute(sql`
      SELECT
        COUNT(*)::integer AS total_documents,
        COUNT(DISTINCT org_id)::integer AS org_count
      FROM search_documents
    `);
    const rows = (result as unknown as { rows?: { total_documents: number; org_count: number }[] }).rows ?? [];
    const row = rows[0];

    const totalDocuments = row?.total_documents ?? 0;
    const orgCount = row?.org_count ?? 0;

    return Response.json({
      ok: true as const,
      data: {
        total_documents: totalDocuments,
        org_count: orgCount,
        healthy: totalDocuments > 0,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json(
      { ok: false as const, error: { code: 'HEALTH_ERROR', message } },
      { status: 500 },
    );
  }
}
