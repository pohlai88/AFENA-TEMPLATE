/**
 * Contacts FTS Adapter Tests
 *
 * Verifies:
 * 1. Query ≥ 3 chars (no @) → FTS path used
 * 2. Query < 3 chars → ILIKE fallback used
 * 3. Query with @ → ILIKE fallback used
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Mock afena-database ────────────────────────────────────────
const selectFn = vi.fn();
const fromFn = vi.fn();
const whereFn = vi.fn();
const orderByFn = vi.fn();
const limitFn = vi.fn(() => Promise.resolve([]));

vi.mock('afena-database', () => ({
  db: {
    select: (...args: any[]) => {
      selectFn(...args);
      return {
        from: (...a: any[]) => {
          fromFn(...a);
          return {
            where: (...a2: any[]) => {
              whereFn(...a2);
              return {
                orderBy: (...a3: any[]) => {
                  orderByFn(...a3);
                  return { limit: limitFn };
                },
                limit: limitFn,
              };
            },
          };
        },
      };
    },
  },
  contacts: {
    id: 'id',
    name: 'name',
    email: 'email',
    company: 'company',
    deletedAt: 'deletedAt',
  },
  and: vi.fn((...args: any[]) => args),
  sql: (strings: TemplateStringsArray, ...values: any[]) => ({ strings, values }),
  ilike: vi.fn((_col: any, _pattern: string) => 'ilike'),
  isNull: vi.fn((_col: any) => 'isNull'),
  or: vi.fn((...args: any[]) => args),
  desc: vi.fn((col: any) => col),
}));

// ── Mock fts helpers ───────────────────────────────────────────
const ftsWhereSpy = vi.fn();
const ftsRankSpy = vi.fn();

vi.mock('../fts', () => ({
  ftsWhere: (...args: any[]) => {
    ftsWhereSpy(...args);
    return 'fts-where-clause';
  },
  ftsRank: (...args: any[]) => {
    ftsRankSpy(...args);
    return 'fts-rank';
  },
}));

// ── Tests ──────────────────────────────────────────────────────

describe('searchContacts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    limitFn.mockImplementation(() => Promise.resolve([]));
  });

  it('uses FTS path for queries ≥ 3 chars without @', async () => {
    const { searchContacts } = await import('../adapters/contacts');
    await searchContacts('john doe', 10);

    expect(ftsWhereSpy).toHaveBeenCalledTimes(1);
    expect(ftsRankSpy).toHaveBeenCalledTimes(1);
  });

  it('uses ILIKE fallback for queries < 3 chars', async () => {
    const { ilike } = await import('afena-database');
    const { searchContacts } = await import('../adapters/contacts');
    await searchContacts('ab', 10);

    expect(ftsWhereSpy).not.toHaveBeenCalled();
    expect(ilike).toHaveBeenCalled();
  });

  it('uses ILIKE fallback for queries containing @', async () => {
    const { ilike } = await import('afena-database');
    const { searchContacts } = await import('../adapters/contacts');
    await searchContacts('user@example.com', 10);

    expect(ftsWhereSpy).not.toHaveBeenCalled();
    expect(ilike).toHaveBeenCalled();
  });
});
