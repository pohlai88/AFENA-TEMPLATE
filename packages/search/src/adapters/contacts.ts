import { dbRo, contacts, and, sql, ilike, isNull, or, desc } from 'afenda-database';

import { ftsRank, ftsWhere } from '../fts';

import type { SearchResult } from '../types';

/**
 * Contacts search adapter.
 * Uses tsvector FTS for queries ≥ 3 chars (no @), ILIKE fallback otherwise.
 */
export async function searchContacts(
  query: string,
  limit: number,
): Promise<SearchResult[]> {
  const normalized = query.trim().replace(/\s+/g, ' ');
  if (!normalized) return [];

  const useFts = normalized.length >= 3 && !normalized.includes('@');

  if (useFts) {
    const tsvec = sql`"contacts"."search_vector"`;
    const where = ftsWhere(tsvec, normalized);
    if (!where) return [];

    const rank = ftsRank(tsvec, normalized);

    const rows = await dbRo
      .select({
        id: contacts.id,
        name: contacts.name,
        email: contacts.email,
        company: contacts.company,
        rank,
      })
      .from(contacts)
      .where(and(isNull(contacts.deletedAt), where))
      .orderBy(desc(rank))
      .limit(limit);

    return rows.map((row) => ({
      id: row.id,
      type: 'contacts',
      title: row.name,
      subtitle: [row.email, row.company].filter(Boolean).join(' · ') || null,
      score: typeof row.rank === 'number' ? row.rank : 0,
    }));
  }

  // ILIKE fallback for short queries or email searches
  const pattern = `%${normalized}%`;

  const rows = await dbRo
    .select({
      id: contacts.id,
      name: contacts.name,
      email: contacts.email,
      company: contacts.company,
    })
    .from(contacts)
    .where(
      and(
        isNull(contacts.deletedAt),
        or(
          ilike(contacts.name, pattern),
          ilike(contacts.email, pattern),
          ilike(contacts.company, pattern),
        ),
      ),
    )
    .limit(limit);

  return rows.map((row, idx) => ({
    id: row.id,
    type: 'contacts',
    title: row.name,
    subtitle: [row.email, row.company].filter(Boolean).join(' · ') || null,
    score: 1 - idx * 0.01,
  }));
}
