import { db, contacts, and, ilike, isNull, or } from 'afena-database';

import type { SearchResult } from '../types';

/**
 * Contacts search adapter.
 * Uses ILIKE fallback for now. When a tsvector GIN index is added,
 * switch to ftsWhere/ftsRank for ranked full-text search.
 */
export async function searchContacts(
  query: string,
  limit: number,
): Promise<SearchResult[]> {
  const pattern = `%${query.trim()}%`;

  const rows = await db
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
