import { DATA_TYPE_VALUE_COLUMN_MAP } from 'afenda-canon';
import {
  db,
  customFields,
  customFieldValues,
  customFieldSyncQueue,
} from 'afenda-database';
import { eq, and, sql, inArray } from 'drizzle-orm';

import type { DataType } from 'afenda-canon';

/** Map snake_case value column to Drizzle camelCase. */
const VALUE_COL_CAMEL: Record<string, 'valueText' | 'valueInt' | 'valueNumeric' | 'valueBool' | 'valueDate' | 'valueTs' | 'valueJson' | 'valueUuid'> = {
  value_text: 'valueText',
  value_int: 'valueInt',
  value_numeric: 'valueNumeric',
  value_bool: 'valueBool',
  value_date: 'valueDate',
  value_ts: 'valueTs',
  value_json: 'valueJson',
  value_uuid: 'valueUuid',
};

/**
 * Sync a single entity's custom_data JSONB blob into the
 * typed custom_field_values rows.
 *
 * Called after a mutation that touches custom_data.
 * On failure, enqueues into custom_field_sync_queue for retry.
 *
 * DEV-3: Batch delete + batch upsert (replaces per-field loop).
 */
export async function syncCustomFieldValues(
  orgId: string,
  entityType: string,
  entityId: string,
  customData: Record<string, unknown>,
): Promise<{ synced: number; errors: string[] }> {
  const errors: string[] = [];

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

  const toDelete: string[] = [];
  const upsertRows: Array<{
    def: (typeof fieldDefs)[number];
    valueColumn: string;
    value: unknown;
  }> = [];

  for (const def of fieldDefs) {
    const value = customData[def.fieldName];
    if (value === undefined || value === null) {
      toDelete.push(def.id);
      continue;
    }

    const valueColumn = DATA_TYPE_VALUE_COLUMN_MAP[def.fieldType as DataType];
    if (!valueColumn) {
      errors.push(`Unknown field type "${def.fieldType}" for field "${def.fieldName}"`);
      continue;
    }
    upsertRows.push({ def, valueColumn, value });
  }

  try {
    // Batch delete cleared fields
    if (toDelete.length > 0) {
      await db
        .delete(customFieldValues)
        .where(
          and(
            eq(customFieldValues.orgId, orgId),
            eq(customFieldValues.entityId, entityId),
            inArray(customFieldValues.fieldId, toDelete),
          ),
        );
    }

    // Batch upsert (single round-trip)
    if (upsertRows.length > 0) {
      type InsertRow = typeof customFieldValues.$inferInsert;
      const batch: InsertRow[] = upsertRows.map(({ def, valueColumn, value }) => {
        const camel = VALUE_COL_CAMEL[valueColumn];
        const row: InsertRow = {
          orgId,
          entityType,
          entityId,
          fieldId: def.id,
          source: 'system',
        } as InsertRow;
        if (camel) (row as Record<string, unknown>)[camel] = value;
        return row;
      });

      await db
        .insert(customFieldValues)
        .values(batch)
        .onConflictDoUpdate({
          target: [
            customFieldValues.orgId,
            customFieldValues.entityId,
            customFieldValues.fieldId,
          ],
          set: {
            valueText: sql`COALESCE(excluded.value_text, custom_field_values.value_text)`,
            valueInt: sql`COALESCE(excluded.value_int, custom_field_values.value_int)`,
            valueNumeric: sql`COALESCE(excluded.value_numeric, custom_field_values.value_numeric)`,
            valueBool: sql`COALESCE(excluded.value_bool, custom_field_values.value_bool)`,
            valueDate: sql`COALESCE(excluded.value_date, custom_field_values.value_date)`,
            valueTs: sql`COALESCE(excluded.value_ts, custom_field_values.value_ts)`,
            valueJson: sql`COALESCE(excluded.value_json, custom_field_values.value_json)`,
            valueUuid: sql`COALESCE(excluded.value_uuid, custom_field_values.value_uuid)`,
            updatedAt: sql`now()`,
            source: sql`'system'`,
          },
        });
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(`Failed to sync custom fields: ${msg}`);
  }

  const synced = upsertRows.length;

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
