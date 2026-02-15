import { NextRequest } from 'next/server';

import { dbSearchWorker, sql } from 'afena-database';

import { requireCronSecret } from '@/lib/api/with-cron-secret';

/**
 * GET /api/internal/search/lag
 *
 * Lag metrics for search outbox (GAP-DB-004).
 * - oldest_unprocessed_age_seconds: age of oldest pending/failed event
 * - pending_count: number of unprocessed events
 * - last_completed_at: most recent completed event timestamp
 *
 * Secured by CRON_SECRET. Uses SEARCH_WORKER_DATABASE_URL.
 */
export async function GET(request: NextRequest) {
  const authError = requireCronSecret(request);
  if (authError) return authError;

  try {
    const result = await dbSearchWorker.execute(sql`
      WITH pending AS (
        SELECT
          EXTRACT(EPOCH FROM (now() - MIN(created_at)))::integer AS oldest_age_sec,
          COUNT(*)::integer AS pending_count
        FROM search_outbox
        WHERE status IN ('pending', 'failed')
          AND (next_retry_at IS NULL OR next_retry_at <= now())
          AND attempts < max_attempts
      ),
      last_done AS (
        SELECT MAX(completed_at) AS last_completed_at
        FROM search_outbox
        WHERE status = 'completed'
      )
      SELECT p.oldest_age_sec, p.pending_count, l.last_completed_at
      FROM pending p
      CROSS JOIN last_done l
    `);
    const rows = (result as unknown as { rows?: { oldest_age_sec: number | null; pending_count: number; last_completed_at: string | null }[] }).rows ?? [];
    const row = rows[0];

    const oldestAgeSec = row?.oldest_age_sec ?? null;
    const pendingCount = row?.pending_count ?? 0;
    const lastCompletedAt = row?.last_completed_at ?? null;

    return Response.json({
      ok: true as const,
      data: {
        oldest_unprocessed_age_seconds: oldestAgeSec,
        pending_count: pendingCount,
        last_completed_at: lastCompletedAt,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json(
      { ok: false as const, error: { code: 'LAG_ERROR', message } },
      { status: 500 },
    );
  }
}
