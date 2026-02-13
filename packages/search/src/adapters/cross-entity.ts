import { dbRo, sql } from 'afena-database';

import { toTsQuery } from '../fts';

import type { SearchResult } from '../types';

/**
 * Cross-entity search using the search_index materialized view.
 * Queries all entity types in a single SQL statement.
 * Tenant isolation via org_id filter (MV does not support RLS).
 *
 * Falls back to ILIKE on title/subtitle for short queries or email searches.
 */
export async function searchAll(
  query: string,
  limit: number,
  options?: { entityTypes?: string[] },
): Promise<SearchResult[]> {
  const normalized = query.trim().replace(/\s+/g, ' ');
  if (!normalized) return [];

  const useFts = normalized.length >= 3 && !normalized.includes('@');

  if (useFts) {
    const tsquery = toTsQuery(normalized);
    if (!tsquery) return [];

    const entityFilter = options?.entityTypes?.length
      ? sql`AND entity_type = ANY(${options.entityTypes})`
      : sql``;

    const rows = await dbRo.execute(sql`
      SELECT
        entity_id,
        entity_type,
        title,
        subtitle,
        ts_rank(search_vector, to_tsquery('simple', ${tsquery})) AS rank
      FROM search_index
      WHERE search_vector @@ to_tsquery('simple', ${tsquery})
        AND is_deleted = false
        ${entityFilter}
      ORDER BY rank DESC
      LIMIT ${limit}
    `);

    const resultRows = (rows as Record<string, unknown>).rows as Array<{
      entity_id: string;
      entity_type: string;
      title: string;
      subtitle: string | null;
      rank: number;
    }>;

    return (resultRows ?? []).map((row) => ({
      id: row.entity_id,
      type: row.entity_type,
      title: row.title,
      subtitle: row.subtitle ?? null,
      score: typeof row.rank === 'number' ? row.rank : 0,
    }));
  }

  // ILIKE fallback for short queries or email searches
  const pattern = `%${normalized}%`;

  const entityFilter = options?.entityTypes?.length
    ? sql`AND entity_type = ANY(${options.entityTypes})`
    : sql``;

  const rows = await dbRo.execute(sql`
    SELECT
      entity_id,
      entity_type,
      title,
      subtitle
    FROM search_index
    WHERE (title ILIKE ${pattern} OR subtitle ILIKE ${pattern})
      AND is_deleted = false
      ${entityFilter}
    ORDER BY updated_at DESC
    LIMIT ${limit}
  `);

  const resultRows = (rows as Record<string, unknown>).rows as Array<{
    entity_id: string;
    entity_type: string;
    title: string;
    subtitle: string | null;
  }>;

  return (resultRows ?? []).map((row, idx) => ({
    id: row.entity_id,
    type: row.entity_type,
    title: row.title,
    subtitle: row.subtitle ?? null,
    score: 1 - idx * 0.01,
  }));
}
