import { sql } from 'drizzle-orm';

import type { SQL } from 'drizzle-orm';

/**
 * Build a PostgreSQL tsquery from a user search string.
 * Splits on whitespace, adds :* prefix matching to each term,
 * and joins with & (AND) for multi-word queries.
 *
 * Example: "john doe" → "john:* & doe:*"
 */
export function toTsQuery(input: string): string {
  const terms = input
    .trim()
    .split(/\s+/)
    .filter((t) => t.length > 0)
    .map((t) => t.replace(/[^\w]/g, ''))
    .filter((t) => t.length > 0);

  if (terms.length === 0) return '';
  return terms.map((t) => `${t}:*`).join(' & ');
}

/**
 * Build a SQL fragment for full-text search using tsvector.
 * Uses the 'english' text search configuration.
 *
 * @param columns - Array of column SQL references to search across
 * @param query - Raw user query string
 * @returns SQL condition for WHERE clause, or null if query is empty
 */
export function ftsWhere(
  tsvectorColumn: SQL,
  query: string,
): SQL | null {
  const tsquery = toTsQuery(query);
  if (!tsquery) return null;

  return sql`${tsvectorColumn} @@ to_tsquery('english', ${tsquery})`;
}

/**
 * Build a SQL fragment for ts_rank scoring.
 * Higher rank = more relevant result.
 */
export function ftsRank(
  tsvectorColumn: SQL,
  query: string,
): SQL<number> {
  const tsquery = toTsQuery(query);
  if (!tsquery) return sql<number>`0`;

  return sql<number>`ts_rank(${tsvectorColumn}, to_tsquery('english', ${tsquery}))`;
}

/**
 * Build a SQL fragment for ILIKE fallback search.
 * Used when FTS tsvector column is not available.
 * Searches across multiple text columns with OR.
 */
export function ilikeFallback(
  columns: SQL[],
  query: string,
): SQL | null {
  const trimmed = query.trim();
  if (!trimmed) return null;

  const pattern = `%${trimmed}%`;
  const conditions = columns.map((col) => sql`${col} ILIKE ${pattern}`);

  if (conditions.length === 0) return null;
  if (conditions.length === 1) return conditions[0]!;

  return sql.join(conditions, sql` OR `);
}
