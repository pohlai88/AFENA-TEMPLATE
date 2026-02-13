import { updateTag } from 'next/cache';

/**
 * Canonical cache tag builders.
 * Single source of truth for tag format — used by server actions and query loaders.
 *
 * Read classification convention:
 *   - Truth reads (entity detail, list): `noStore()` — always fresh
 *   - Reference reads (currencies, UOMs, roles): `unstable_cache()` with `tag.entity()` tag
 *   - Dashboards: `unstable_cache()` with `tag.org()` + short TTL
 */
export const tag = {
  org: (orgId: string): string => `org:${orgId}`,
  entity: (orgId: string, entityType: string): string => `org:${orgId}:${entityType}`,
  record: (orgId: string, entityType: string, id: string): string =>
    `org:${orgId}:${entityType}:${id}`,
} as const;

/**
 * Invalidation target returned by action handlers.
 * `withActionAuth()` calls `invalidateEntity()` automatically after successful mutations.
 */
export interface InvalidationTarget {
  entityType: string;
  entityId?: string;
}

/**
 * Revalidate cache tags for an entity mutation.
 * Always invalidates the entity-list tag; optionally invalidates the record tag.
 *
 * Called automatically by `withActionAuth()` — actions never need to call this directly.
 */
export function invalidateEntity(
  orgId: string,
  entityType: string,
  entityId?: string,
): void {
  updateTag(tag.entity(orgId, entityType));
  if (entityId) {
    updateTag(tag.record(orgId, entityType, entityId));
  }
}
