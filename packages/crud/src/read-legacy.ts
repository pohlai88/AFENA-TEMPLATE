/**
 * Legacy reference lookup from migration_lineage.
 * INV-LINEAGE-01: For any (org_id, entity_type, afenda_id) there is at most 1 row total.
 * For non-committed states, afenda_id MUST be NULL.
 */

import { and, eq, inArray, migrationLineage } from 'afenda-database';
import type { DbInstance } from 'afenda-database';
import type { EntityType } from 'afenda-canon';

export type LegacyRef = { legacySystem: string; legacyId: string };

/**
 * Fetch legacy refs for given afenda IDs from migration_lineage (committed rows only).
 * No ORDER BY — INV-LINEAGE-01 guarantees at most 1 row per afenda_id.
 * Throws if duplicate afenda_id appears (invariant violation alarm).
 */
export async function getLegacyRefs(
  conn: DbInstance,
  orgId: string,
  entityType: EntityType,
  afendaIds: string[],
): Promise<Map<string, LegacyRef>> {
  if (afendaIds.length === 0) return new Map();

  const rows = await conn
    .select({
      afendaId: migrationLineage.afendaId,
      legacySystem: migrationLineage.legacySystem,
      legacyId: migrationLineage.legacyId,
    })
    .from(migrationLineage)
    .where(
      and(
        eq(migrationLineage.orgId, orgId),
        eq(migrationLineage.entityType, entityType),
        inArray(migrationLineage.afendaId, afendaIds),
        eq(migrationLineage.state, 'committed'),
      ),
    );

  const map = new Map<string, LegacyRef>();
  for (const r of rows) {
    if (!r.afendaId) continue;
    if (map.has(r.afendaId)) {
      throw new Error('INV-LINEAGE-01 violated: duplicate afenda_id');
    }
    map.set(r.afendaId, { legacySystem: r.legacySystem, legacyId: r.legacyId });
  }
  return map;
}
