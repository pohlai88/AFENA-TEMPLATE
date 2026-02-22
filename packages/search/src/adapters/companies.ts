import { dbRo, companies, and, sql, ilike, isNull, desc } from 'afenda-database';

import { ftsRank, ftsWhere } from '../fts';

import type { SearchResult } from '../types';

/**
 * Companies search adapter.
 * Uses tsvector FTS for queries >= 3 chars, ILIKE fallback otherwise.
 * TODO: Customize FTS columns and ILIKE patterns for this entity.
 */
export async function searchCompanies(
  query: string,
  limit: number,
): Promise<SearchResult[]> {
  const normalized = query.trim().replace(/\s+/g, ' ');
  if (!normalized) return [];

  const useFts = normalized.length >= 3 && !normalized.includes('@');

  if (useFts) {
    const tsvec = sql`"companies"."search_vector"`;
    const where = ftsWhere(tsvec, normalized);
    if (!where) return [];
    const rank = ftsRank(tsvec, normalized);
    const rows = await dbRo
      .select({ id: companies.id, rank })
      .from(companies)
      .where(and(isNull(companies.deletedAt), where))
      .orderBy(desc(rank))
      .limit(limit);
    return rows.map((row) => ({
      id: row.id,
      type: 'companies',
      title: row.id, // TODO: replace with display column
      subtitle: null,
      score: typeof row.rank === 'number' ? row.rank : 0,
    }));
  }

  // ILIKE fallback
  const pattern = `%${normalized}%`;
  const rows = await dbRo
    .select({ id: companies.id })
    .from(companies)
    .where(and(isNull(companies.deletedAt), ilike(companies.id, pattern)))
    .limit(limit);
  return rows.map((row, idx) => ({
    id: row.id,
    type: 'companies',
    title: row.id, // TODO: replace with display column
    subtitle: null,
    score: 1 - idx * 0.01,
  }));
}
