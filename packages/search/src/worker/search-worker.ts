import { dbSearchWorker, sql, withDbRetry } from 'afenda-database';
import { getLogger } from 'afenda-logger';

/**
 * Search outbox worker (GAP-DB-004).
 *
 * Polls search_outbox with FOR UPDATE SKIP LOCKED, processes events,
 * UPSERTs into search_documents (or DELETE for delete action).
 *
 * Requires a DB connection that can read/write search_outbox and search_documents
 * (e.g. service role or BYPASSRLS for multi-tenant polling).
 */

const BATCH_SIZE = 50;
const RETRY_BASE_MS = 1000;
const MAX_ATTEMPTS = 5;

export interface SearchWorkerConfig {
  batchSize?: number;
  pollIntervalMs?: number;
}

export interface SearchOutboxEvent {
  id: string;
  createdAt: string;
  orgId: string;
  entityType: string;
  entityId: string;
  action: 'upsert' | 'delete';
  attempts: number;
  maxAttempts: number;
}

async function pollOutbox(batchSize: number): Promise<SearchOutboxEvent[]> {
  const result = await dbSearchWorker.execute(sql`
    SELECT
      id, created_at AS "createdAt", org_id AS "orgId",
      entity_type AS "entityType", entity_id AS "entityId",
      action, attempts, max_attempts AS "maxAttempts"
    FROM search_outbox
    WHERE status IN ('pending', 'failed')
      AND (next_retry_at IS NULL OR next_retry_at <= now())
      AND attempts < max_attempts
    ORDER BY created_at ASC
    LIMIT ${batchSize}
    FOR UPDATE SKIP LOCKED
  `);

  const rows = (result as unknown as { rows?: SearchOutboxEvent[] }).rows;
  return rows ?? [];
}

async function markProcessing(id: string, createdAt: string): Promise<void> {
  await dbSearchWorker.execute(sql`
    UPDATE search_outbox
    SET status = 'processing', attempts = attempts + 1
    WHERE id = ${id}::uuid AND created_at = ${createdAt}::timestamptz
  `);
}

async function markCompleted(id: string, createdAt: string): Promise<void> {
  await dbSearchWorker.execute(sql`
    UPDATE search_outbox
    SET status = 'completed', completed_at = now(), error = NULL
    WHERE id = ${id}::uuid AND created_at = ${createdAt}::timestamptz
  `);
}

async function markFailed(
  id: string,
  createdAt: string,
  error: string,
  nextRetryIntervalMs: number | null,
): Promise<void> {
  const nextRetryExpr =
    nextRetryIntervalMs != null
      ? sql`now() + (${String(nextRetryIntervalMs)} || ' milliseconds')::interval`
      : null;
  await dbSearchWorker.execute(sql`
    UPDATE search_outbox
    SET status = 'failed', error = ${error}, next_retry_at = ${nextRetryExpr}
    WHERE id = ${id}::uuid AND created_at = ${createdAt}::timestamptz
  `);
}

async function markDeadLetter(id: string, createdAt: string, error: string): Promise<void> {
  await dbSearchWorker.execute(sql`
    UPDATE search_outbox
    SET status = 'dead_letter', error = ${error}
    WHERE id = ${id}::uuid AND created_at = ${createdAt}::timestamptz
  `);
}

async function processUpsert(event: SearchOutboxEvent): Promise<void> {
  const { orgId, entityType, entityId } = event;

  if (entityType === 'contacts') {
    // Single-statement: upsert from contacts, or delete from search_documents if not found
    await dbSearchWorker.execute(sql`
      WITH src AS (
        SELECT
          c.name AS title,
          COALESCE(c.email, '') || ' ' || COALESCE(c.company, '') AS subtitle,
          to_tsvector('simple',
            COALESCE(c.name, '') || ' ' ||
            COALESCE(c.email, '') || ' ' ||
            COALESCE(c.company, '') || ' ' ||
            COALESCE(c.phone, '')
          ) AS search_vector,
          c.updated_at AS updated_at,
          c.is_deleted AS is_deleted
        FROM contacts c
        WHERE c.org_id = ${orgId} AND c.id = ${entityId}::uuid
        LIMIT 1
      ),
      deleted AS (
        DELETE FROM search_documents d
        WHERE d.org_id = ${orgId} AND d.entity_type = ${entityType} AND d.entity_id = ${entityId}
          AND NOT EXISTS (SELECT 1 FROM src)
      )
      INSERT INTO search_documents (org_id, entity_type, entity_id, title, subtitle, search_vector, updated_at, is_deleted)
      SELECT ${orgId}, ${entityType}, ${entityId}, s.title, s.subtitle, s.search_vector, s.updated_at, s.is_deleted
      FROM src s
      ON CONFLICT (org_id, entity_type, entity_id)
      DO UPDATE SET
        title = EXCLUDED.title,
        subtitle = EXCLUDED.subtitle,
        search_vector = EXCLUDED.search_vector,
        updated_at = EXCLUDED.updated_at,
        is_deleted = EXCLUDED.is_deleted
    `);
    return;
  }

  if (entityType === 'companies') {
    await dbSearchWorker.execute(sql`
      WITH src AS (
        SELECT
          co.name AS title,
          COALESCE(co.legal_name, '') || ' ' || COALESCE(co.registration_no, '') AS subtitle,
          to_tsvector('simple',
            COALESCE(co.name, '') || ' ' ||
            COALESCE(co.legal_name, '') || ' ' ||
            COALESCE(co.registration_no, '') || ' ' ||
            COALESCE(co.tax_id, '')
          ) AS search_vector,
          co.updated_at AS updated_at,
          co.is_deleted AS is_deleted
        FROM companies co
        WHERE co.org_id = ${orgId} AND co.id = ${entityId}::uuid
        LIMIT 1
      ),
      deleted AS (
        DELETE FROM search_documents d
        WHERE d.org_id = ${orgId} AND d.entity_type = ${entityType} AND d.entity_id = ${entityId}
          AND NOT EXISTS (SELECT 1 FROM src)
      )
      INSERT INTO search_documents (org_id, entity_type, entity_id, title, subtitle, search_vector, updated_at, is_deleted)
      SELECT ${orgId}, ${entityType}, ${entityId}, s.title, s.subtitle, s.search_vector, s.updated_at, s.is_deleted
      FROM src s
      ON CONFLICT (org_id, entity_type, entity_id)
      DO UPDATE SET
        title = EXCLUDED.title,
        subtitle = EXCLUDED.subtitle,
        search_vector = EXCLUDED.search_vector,
        updated_at = EXCLUDED.updated_at,
        is_deleted = EXCLUDED.is_deleted
    `);
    return;
  }

  throw new Error(`Unknown entity type: ${entityType}`);
}

async function processDelete(event: SearchOutboxEvent): Promise<void> {
  const { orgId, entityType, entityId } = event;
  await dbSearchWorker.execute(sql`
    DELETE FROM search_documents
    WHERE org_id = ${orgId} AND entity_type = ${entityType} AND entity_id = ${entityId}
  `);
}

function computeNextRetryMs(attempts: number): number {
  return RETRY_BASE_MS * Math.pow(2, attempts);
}

/**
 * Drain search outbox with a time budget (for Vercel serverless).
 * Processes batches until timeBudgetMs elapses or no more events.
 * Returns { processed, batches }.
 */
export async function drainSearchOutbox(
  timeBudgetMs: number,
  config?: SearchWorkerConfig,
): Promise<{ processed: number; batches: number }> {
  const batchSize = config?.batchSize ?? BATCH_SIZE;
  const deadline = Date.now() + timeBudgetMs;
  let totalProcessed = 0;
  let batches = 0;

  while (Date.now() < deadline) {
    const n = await withDbRetry(() =>
      processSearchOutboxBatch({ ...config, batchSize }),
      { maxRetries: 2, baseMs: 100 },
    );
    totalProcessed += n;
    batches += 1;
    if (n === 0) break;
  }

  return { processed: totalProcessed, batches };
}

/**
 * Process a single batch of outbox events.
 * Returns the number of events processed.
 */
export async function processSearchOutboxBatch(
  config?: SearchWorkerConfig,
): Promise<number> {
  const batchSize = config?.batchSize ?? BATCH_SIZE;
  const events = await pollOutbox(batchSize);
  if (events.length === 0) return 0;

  for (const event of events) {
    try {
      await markProcessing(event.id, event.createdAt);

      if (event.action === 'delete') {
        await processDelete(event);
      } else {
        await processUpsert(event);
      }

      await markCompleted(event.id, event.createdAt);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      const attempts = event.attempts + 1;

      if (attempts >= (event.maxAttempts ?? MAX_ATTEMPTS)) {
        await markDeadLetter(event.id, event.createdAt, errorMsg);
      } else {
        const nextRetryMs = computeNextRetryMs(attempts);
        await markFailed(event.id, event.createdAt, errorMsg, nextRetryMs);
      }
    }
  }

  return events.length;
}

/**
 * Run the search worker in a loop until stopped.
 */
export async function runSearchWorker(
  config?: SearchWorkerConfig & { signal?: AbortSignal | undefined },
): Promise<void> {
  const pollIntervalMs = config?.pollIntervalMs ?? 5000;
  const signal = config?.signal;

  while (!signal?.aborted) {
    try {
      const processed = await processSearchOutboxBatch(config);
      if (processed === 0) {
        await new Promise((r) => setTimeout(r, pollIntervalMs));
      }
    } catch (err) {
      getLogger().warn({ err }, '[search-worker] Batch error');
      await new Promise((r) => setTimeout(r, pollIntervalMs));
    }
  }
}
