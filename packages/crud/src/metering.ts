/**
 * Usage metering — fire-and-forget upserts to org_usage_daily.
 *
 * Spec §C3: Collect usage counters now, bill later.
 * Uses cheap upserts (INSERT ... ON CONFLICT DO UPDATE).
 *
 * All meter functions are fire-and-forget — errors are swallowed
 * so metering never blocks or fails the primary operation.
 */

import { db, orgUsageDaily, sql } from 'afenda-database';

/**
 * Get today's date as YYYY-MM-DD string (UTC).
 */
function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Increment api_requests counter for an org.
 * Called after every successful API request / mutation.
 */
export function meterApiRequest(orgId: string): void {
  if (!orgId) return;
  const day = todayUtc();

  void db
    .insert(orgUsageDaily)
    .values({ orgId, day, apiRequests: 1 })
    .onConflictDoUpdate({
      target: [orgUsageDaily.orgId, orgUsageDaily.day],
      set: {
        apiRequests: sql`${orgUsageDaily.apiRequests} + 1`,
      },
    })
    .catch(() => {
      // Metering must never fail the primary operation
    });
}

/**
 * Increment job_runs counter and add job duration for an org.
 * Called after a background job completes.
 */
export function meterJobRun(orgId: string, durationMs: number): void {
  if (!orgId) return;
  const day = todayUtc();
  const safeDuration = Number.isFinite(durationMs) && durationMs > 0 ? Math.round(durationMs) : 0;

  void db
    .insert(orgUsageDaily)
    .values({ orgId, day, jobRuns: 1, jobMs: safeDuration })
    .onConflictDoUpdate({
      target: [orgUsageDaily.orgId, orgUsageDaily.day],
      set: {
        jobRuns: sql`${orgUsageDaily.jobRuns} + 1`,
        jobMs: sql`${orgUsageDaily.jobMs} + ${sql.raw(String(safeDuration))}`,
      },
    })
    .catch(() => {
      // Metering must never fail the primary operation
    });
}

/**
 * Increment db_timeouts counter for an org.
 * Called when a statement_timeout or idle_in_transaction_session_timeout fires.
 */
export function meterDbTimeout(orgId: string): void {
  if (!orgId) return;
  const day = todayUtc();

  void db
    .insert(orgUsageDaily)
    .values({ orgId, day, dbTimeouts: 1 })
    .onConflictDoUpdate({
      target: [orgUsageDaily.orgId, orgUsageDaily.day],
      set: {
        dbTimeouts: sql`${orgUsageDaily.dbTimeouts} + 1`,
      },
    })
    .catch(() => {
      // Metering must never fail the primary operation
    });
}

/**
 * Add storage bytes for an org (e.g. file upload).
 * Called after a file is uploaded or attachment is created.
 */
export function meterStorageBytes(orgId: string, bytes: number): void {
  if (!orgId || !Number.isFinite(bytes) || bytes <= 0) return;
  const day = todayUtc();
  const safeBytes = Math.round(bytes);

  void db
    .insert(orgUsageDaily)
    .values({ orgId, day, storageBytes: safeBytes })
    .onConflictDoUpdate({
      target: [orgUsageDaily.orgId, orgUsageDaily.day],
      set: {
        storageBytes: sql`${orgUsageDaily.storageBytes} + ${sql.raw(String(safeBytes))}`,
      },
    })
    .catch(() => {
      // Metering must never fail the primary operation
    });
}
