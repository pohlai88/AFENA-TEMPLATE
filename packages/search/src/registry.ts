import type { SearchableEntityConfig, SearchOptions, SearchResult } from './types';

/**
 * Registry of searchable entities.
 * Each entity type registers a search function that knows how to query its table.
 * Cross-entity search fans out to all registered entities in parallel.
 */
const registry = new Map<string, SearchableEntityConfig>();

export function registerSearchableEntity(config: SearchableEntityConfig): void {
  registry.set(config.entityType, config);
}

export function getRegisteredEntityTypes(): string[] {
  return Array.from(registry.keys());
}

/**
 * Cross-entity search — fans out to all registered entities (or a filtered subset).
 * Results are merged, sorted by score descending, and capped at the requested limit.
 */
export async function crossEntitySearch(options: SearchOptions): Promise<SearchResult[]> {
  const { query, entityTypes, limit = 10 } = options;

  if (!query.trim()) return [];

  const targets = entityTypes
    ? Array.from(registry.values()).filter((c) => entityTypes.includes(c.entityType))
    : Array.from(registry.values());

  if (targets.length === 0) return [];

  const perEntityLimit = Math.ceil(limit / targets.length) + 2;

  const batches = await Promise.all(
    targets.map((config) =>
      config.searchFn(query, perEntityLimit).catch(() => [] as SearchResult[]),
    ),
  );

  return batches
    .flat()
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
