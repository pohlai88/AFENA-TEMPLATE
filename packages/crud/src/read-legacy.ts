/**
 * Legacy reference lookup from migration_lineage.
 * INV-LINEAGE-01: For any (org_id, entity_type, afena_id) there is at most 1 row total.
 * For non-committed states, afena_id MUST be NULL.
 */

import { and, eq, inArray, migrationLineage } from 'afena-database';
import type { DbInstance } from 'afena-database';
import type { EntityType } from 'afena-canon';

export type LegacyRef = { legacySystem: string; legacyId: string };

/**
 * Fetch legacy refs for given afena IDs from migration_lineage (committed rows only).
 * No ORDER BY — INV-LINEAGE-01 guarantees at most 1 row per afena_id.
 * Throws if duplicate afena_id appears (invariant violation alarm).
 */
export async function getLegacyRefs(
  conn: DbInstance,
  orgId: string,
  entityType: EntityType,
  afenaIds: string[],
): Promise<Map<string, LegacyRef>> {
  if (afenaIds.length === 0) return new Map();

  const rows = await conn
    .select({
      afenaId: migrationLineage.afenaId,
      legacySystem: migrationLineage.legacySystem,
      legacyId: migrationLineage.legacyId,
    })
    .from(migrationLineage)
    .where(
      and(
        eq(migrationLineage.orgId, orgId),
        eq(migrationLineage.entityType, entityType),
        inArray(migrationLineage.afenaId, afenaIds),
        eq(migrationLineage.state, 'committed'),
      ),
    );

  const map = new Map<string, LegacyRef>();
  for (const r of rows) {
    if (!r.afenaId) continue;
    if (map.has(r.afenaId)) {
      throw new Error('INV-LINEAGE-01 violated: duplicate afena_id');
    }
    map.set(r.afenaId, { legacySystem: r.legacySystem, legacyId: r.legacyId });
  }
  return map;
}
