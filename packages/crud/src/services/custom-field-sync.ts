import { DATA_TYPE_VALUE_COLUMN_MAP } from 'afena-canon';
import {
  db,
  customFields,
  customFieldValues,
  customFieldSyncQueue,
} from 'afena-database';
import { eq, and, sql } from 'drizzle-orm';

import type { DataType } from 'afena-canon';

/**
 * Sync a single entity's custom_data JSONB blob into the
 * typed custom_field_values rows.
 *
 * Called after a mutation that touches custom_data.
 * On failure, enqueues into custom_field_sync_queue for retry.
 */
export async function syncCustomFieldValues(
  orgId: string,
  entityType: string,
  entityId: string,
  customData: Record<string, unknown>,
): Promise<{ synced: number; errors: string[] }> {
  const errors: string[] = [];
  let synced = 0;

  // Load field definitions for this entity type
  const fieldDefs = await db
    .select()
    .from(customFields)
    .where(
      and(
        eq(customFields.orgId, orgId),
        eq(customFields.entityType, entityType),
        eq(customFields.isActive, true),
        eq(customFields.storageMode, 'indexed'),
      ),
    );

  for (const def of fieldDefs) {
    const value = customData[def.fieldName];
    if (value === undefined || value === null) {
      // Delete existing value row if field was cleared
      await db
        .delete(customFieldValues)
        .where(
          and(
            eq(customFieldValues.orgId, orgId),
            eq(customFieldValues.entityId, entityId),
            eq(customFieldValues.fieldId, def.id),
          ),
        );
      continue;
    }

    const valueColumn = DATA_TYPE_VALUE_COLUMN_MAP[def.fieldType as DataType];
    if (!valueColumn) {
      errors.push(`Unknown field type "${def.fieldType}" for field "${def.fieldName}"`);
      continue;
    }

    try {
      // Upsert: insert or update the typed value
      await db
        .insert(customFieldValues)
        .values({
          orgId,
          entityType,
          entityId,
          fieldId: def.id,
          [valueColumn]: value,
          source: 'system',
        })
        .onConflictDoUpdate({
          target: [
            customFieldValues.orgId,
            customFieldValues.entityId,
            customFieldValues.fieldId,
          ],
          set: {
            [valueColumn]: value,
            updatedAt: sql`now()`,
            source: 'system',
          },
        });
      synced++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`Failed to sync field "${def.fieldName}": ${msg}`);
    }
  }

  // If any errors, enqueue for retry
  if (errors.length > 0) {
    try {
      await db.insert(customFieldSyncQueue).values({
        orgId,
        entityType,
        entityId,
        lastError: errors.join('; '),
        nextRetryAt: sql`now() + interval '30 seconds'`,
      });
    } catch {
      // Best-effort enqueue — don't fail the main operation
    }
  }

  return { synced, errors };
}

/**
 * Process pending items in the sync retry queue.
 * Called by a background worker / cron job.
 */
export async function processSyncQueue(
  batchSize = 50,
  maxAttempts = 5,
): Promise<{ processed: number; failed: number }> {
  let processed = 0;
  let failed = 0;

  const pending = await db
    .select()
    .from(customFieldSyncQueue)
    .where(
      and(
        sql`${customFieldSyncQueue.completedAt} IS NULL`,
        sql`${customFieldSyncQueue.nextRetryAt} <= now()`,
        sql`${customFieldSyncQueue.attempts} < ${maxAttempts}`,
      ),
    )
    .limit(batchSize);

  for (const item of pending) {
    try {
      // Re-sync would need to read the entity's current custom_data
      // This is a placeholder — actual implementation depends on entity read logic
      await db
        .update(customFieldSyncQueue)
        .set({
          completedAt: sql`now()`,
        })
        .where(eq(customFieldSyncQueue.id, item.id));
      processed++;
    } catch {
      await db
        .update(customFieldSyncQueue)
        .set({
          attempts: sql`${customFieldSyncQueue.attempts} + 1`,
          nextRetryAt: sql`now() + interval '1 minute' * power(2, ${customFieldSyncQueue.attempts})`,
          lastError: 'Retry failed',
        })
        .where(eq(customFieldSyncQueue.id, item.id));
      failed++;
    }
  }

  return { processed, failed };
}
