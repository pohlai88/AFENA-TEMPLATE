import { NextRequest } from 'next/server';

import {
  backfillSearchDocuments,
  backfillSearchDocumentsChunk,
  drainSearchOutbox,
  isBackfillComplete,
  isSearchDocumentsEmpty,
} from 'afenda-search';

import { requireCronSecret } from '@/lib/api/with-cron-secret';

/** Time budget for drain (leave headroom for function limit). Pro: 60s, Hobby: 10s. */
const DRAIN_TIME_BUDGET_MS = 25_000;

export const maxDuration = 30;

/**
 * GET/POST /api/internal/search/drain
 *
 * Vercel-native search worker: time-budgeted batch processing.
 * - Self-healing: if search_documents is empty, runs chunked backfill first
 * - Chunked backfill completes over multiple invocations (no timeout)
 * - Then drains search_outbox until time budget elapses
 *
 * Secured by CRON_SECRET. Invoked by:
 * - Vercel Cron (safety net)
 * - Poke after mutations (direct call, no HTTP)
 *
 * Requires SEARCH_WORKER_DATABASE_URL (BYPASSRLS) for multi-tenant processing.
 */
async function handleDrain(request: NextRequest) {
  const authError = requireCronSecret(request);
  if (authError) return authError;

  try {
    // Self-healing: chunked backfill if search_documents is empty
    const empty = await isSearchDocumentsEmpty();
    if (empty) {
      const backfillComplete = await isBackfillComplete();
      if (!backfillComplete) {
        try {
          const chunk = await backfillSearchDocumentsChunk();
          return Response.json({
            ok: true as const,
            data: {
              action: 'backfill_chunk',
              entityType: chunk.entityType,
              count: chunk.count,
              done: chunk.done,
              allDone: chunk.allDone,
              drained: { processed: 0, batches: 0 },
            },
          });
        } catch {
          // search_backfill_state may not exist (migration not run) — fallback to full backfill
        }
      }
      if (!(await isBackfillComplete())) {
        const backfill = await backfillSearchDocuments();
        return Response.json({
          ok: true as const,
          data: { action: 'backfill', ...backfill, drained: { processed: 0, batches: 0 } },
        });
      }
    }

    const { processed, batches } = await drainSearchOutbox(DRAIN_TIME_BUDGET_MS);

    return Response.json({
      ok: true as const,
      data: { action: 'drain', processed, batches },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json(
      { ok: false as const, error: { code: 'DRAIN_ERROR', message } },
      { status: 500 },
    );
  }
}

export const GET = handleDrain;
export const POST = handleDrain;
