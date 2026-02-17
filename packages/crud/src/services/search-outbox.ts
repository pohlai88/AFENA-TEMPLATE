import { sql } from 'afenda-database';

/**
 * Enqueue a search index update in the mutate() transaction (GAP-DB-004).
 *
 * Same TX as entity write → guaranteed delivery to search worker.
 * Worker polls search_outbox → UPSERT search_documents.
 */

const SEARCHABLE_ENTITY_TYPES = new Set(['contacts', 'companies']);

export async function enqueueSearchOutboxEvent(
  tx: { execute: (q: ReturnType<typeof sql>) => Promise<unknown> },
  params: {
    orgId: string;
    entityType: string;
    entityId: string;
    action: 'upsert' | 'delete';
  },
): Promise<{ written: boolean }> {
  if (!SEARCHABLE_ENTITY_TYPES.has(params.entityType)) {
    return { written: false };
  }

  await tx.execute(sql`
    INSERT INTO search_outbox (org_id, entity_type, entity_id, action)
    VALUES (${params.orgId}, ${params.entityType}, ${params.entityId}, ${params.action})
  `);

  return { written: true };
}
