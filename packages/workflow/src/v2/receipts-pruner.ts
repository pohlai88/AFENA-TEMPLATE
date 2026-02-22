/**
 * Receipts pruner — deletes receipts for completed workflow instances
 * older than a configurable retention period.
 *
 * PRD § Receipts Pruning:
 * > Delete receipts for completed instances > N days (configurable, default 90).
 * > Weekly via pg_cron or Graphile Worker.
 * > Safe: completed instances never re-run same idempotency key.
 */

export interface ReceiptsPrunerDbAdapter {
  /**
   * Delete step receipts for completed instances older than the cutoff date.
   *
   * ```sql
   * DELETE FROM workflow_step_receipts sr
   * WHERE sr.instance_id IN (
   *   SELECT wi.id FROM workflow_instances wi
   *   WHERE wi.status IN ('completed', 'cancelled', 'failed')
   *     AND wi.completed_at < :cutoffDate
   * )
   * ```
   *
   * Returns the number of deleted rows.
   */
  pruneStepReceipts(cutoffDate: string): Promise<number>;

  /**
   * Delete outbox receipts for completed instances older than the cutoff date.
   *
   * ```sql
   * DELETE FROM workflow_outbox_receipts obr
   * WHERE obr.instance_id IN (
   *   SELECT wi.id FROM workflow_instances wi
   *   WHERE wi.status IN ('completed', 'cancelled', 'failed')
   *     AND wi.completed_at < :cutoffDate
   * )
   * ```
   *
   * Returns the number of deleted rows.
   */
  pruneOutboxReceipts(cutoffDate: string): Promise<number>;

  /**
   * Delete completed outbox events older than the cutoff date.
   *
   * ```sql
   * DELETE FROM workflow_events_outbox
   * WHERE status = 'completed'
   *   AND created_at < :cutoffDate
   * ```
   */
  pruneCompletedOutboxEvents(cutoffDate: string): Promise<number>;

  /**
   * Delete completed side-effect outbox events older than the cutoff date.
   */
  pruneCompletedSideEffects(cutoffDate: string): Promise<number>;
}

export interface PrunerConfig {
  retentionDays: number;
}

const DEFAULT_CONFIG: PrunerConfig = {
  retentionDays: 90,
};

export interface PruneResult {
  stepReceiptsPruned: number;
  outboxReceiptsPruned: number;
  outboxEventsPruned: number;
  sideEffectsPruned: number;
  cutoffDate: string;
}

/**
 * Run the receipts pruning job.
 *
 * Deletes receipts and completed outbox rows for terminal instances
 * older than the retention period.
 */
export async function pruneReceipts(
  db: ReceiptsPrunerDbAdapter,
  config: Partial<PrunerConfig> = {},
): Promise<PruneResult> {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const cutoffDate = new Date(Date.now() - cfg.retentionDays * 24 * 60 * 60 * 1000).toISOString();

  const stepReceiptsPruned = await db.pruneStepReceipts(cutoffDate);
  const outboxReceiptsPruned = await db.pruneOutboxReceipts(cutoffDate);
  const outboxEventsPruned = await db.pruneCompletedOutboxEvents(cutoffDate);
  const sideEffectsPruned = await db.pruneCompletedSideEffects(cutoffDate);

  return {
    stepReceiptsPruned,
    outboxReceiptsPruned,
    outboxEventsPruned,
    sideEffectsPruned,
    cutoffDate,
  };
}
