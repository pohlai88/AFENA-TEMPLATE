import { sql } from 'drizzle-orm';
import { check, index, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

/**
 * Idempotency Keys — persisted request deduplication.
 *
 * K-10: If a client retries with the same idempotency_key, the kernel
 * returns the stored receipt without re-executing the mutation.
 *
 * Schema:
 *   - org_id + idempotency_key: unique composition
 *   - request_hash: SHA-256 of the full MutationSpec body — detects tampering
 *   - receipt: stored MutationReceipt JSON — returned on replay
 *   - expires_at: TTL (default 24h — enforced by background reaper)
 */
export const idempotencyKeys = pgTable(
  'idempotency_keys',
  {
    id: uuid('id').defaultRandom().notNull(),
    orgId: uuid('org_id').notNull(),
    idempotencyKey: text('idempotency_key').notNull(),
    actionType: text('action_type').notNull(),
    /** SHA-256 of the canonicalized MutationSpec — prevents replay of mutated bodies */
    requestHash: text('request_hash').notNull(),
    /** Stored MutationReceipt for replay */
    receipt: jsonb('receipt'),
    status: text('status').notNull().default('complete'), // 'in_flight' | 'complete' | 'failed'
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true })
      .notNull()
      .default(sql`now() + interval '24 hours'`),
  },
  (table) => [
    // Primary lookup: org_id + idempotency_key
    sql`CONSTRAINT idempotency_keys_unique UNIQUE (org_id, idempotency_key)`,
    index('idempotency_keys_expires_idx').on(table.expiresAt),
    check('idempotency_keys_org_not_empty', sql`org_id <> ''`),
    check('idempotency_keys_key_not_empty', sql`idempotency_key <> ''`),
  ],
);

export type IdempotencyKey = typeof idempotencyKeys.$inferSelect;
export type NewIdempotencyKey = typeof idempotencyKeys.$inferInsert;
