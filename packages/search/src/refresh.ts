import { db, sql } from 'afena-database';

/**
 * Refresh the search_index materialized view.
 *
 * PRD Phase A #3 — Search MV freshness is correctness-critical.
 *
 * Uses CONCURRENTLY to avoid blocking reads during refresh.
 * CONCURRENTLY requires a unique index on the MV (search_index_uidx exists).
 *
 * V1 strategy: fire-and-forget after every mutation via kernel hook.
 * Phase B upgrade: debounce to per-N-mutations or 30s timer.
 *
 * Uses the write DB (not dbRo) because REFRESH requires write access.
 */
export async function refreshSearchIndex(): Promise<void> {
  await db.execute(sql`REFRESH MATERIALIZED VIEW CONCURRENTLY search_index`);
}
