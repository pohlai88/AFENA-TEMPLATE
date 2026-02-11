/**
 * A single search result returned by the search helpers.
 */
export interface SearchResult {
  id: string;
  type: string;
  title: string;
  subtitle: string | null;
  score: number;
}

/**
 * Options for cross-entity search.
 */
export interface SearchOptions {
  query: string;
  entityTypes?: string[];
  limit?: number;
  includeDeleted?: boolean;
}

/**
 * Configuration for a searchable entity.
 * Registered via registerSearchableEntity().
 */
export interface SearchableEntityConfig {
  entityType: string;
  searchFn: (query: string, limit: number) => Promise<SearchResult[]>;
}
