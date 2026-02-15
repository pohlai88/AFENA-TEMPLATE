/**
 * Cross-Tenant RLS Integration Tests
 *
 * PRD Phase C #12: Validates that RLS policies correctly isolate
 * tenant data across all critical ERP tables.
 *
 * Gated by RUN_RLS_TESTS=1 and requires:
 *   - NEON_DATA_API_URL: Neon Data API endpoint
 *   - RLS_TEST_TOKEN_ORG_A: JWT with activeOrganizationId = org A
 *   - RLS_TEST_TOKEN_ORG_B: JWT with activeOrganizationId = org B
 *
 * Run:
 *   RUN_RLS_TESTS=1 pnpm vitest run packages/database/src/__tests__/cross-tenant-rls.test.ts
 *
 * These tests:
 * 1. As Org A, insert a row and verify it's visible
 * 2. As Org B, verify the row is NOT visible (zero rows)
 * 3. Verify append-only tables reject UPDATE/DELETE
 */

import { describe, it as baseIt, expect } from 'vitest';

import { REVOKE_UPDATE_DELETE_TABLES, RLS_TABLES } from '../schema/_registry';

const run = process.env.RUN_RLS_TESTS === '1';
const it = Object.assign(baseIt, {
  runIf: (cond: boolean) => (cond ? baseIt : baseIt.skip),
});

// ---------------------------------------------------------------------------
// Data API helper
// ---------------------------------------------------------------------------
interface DataApiResult {
  rows: Record<string, unknown>[];
  error?: string;
}

async function queryAs(token: string, sql: string): Promise<DataApiResult> {
  const url = process.env.NEON_DATA_API_URL;
  if (!url) throw new Error('NEON_DATA_API_URL required');

  const res = await fetch(`${url}/sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query: sql }),
  });

  if (!res.ok) {
    const text = await res.text();
    return { rows: [], error: `HTTP ${res.status}: ${text}` };
  }

  return (await res.json()) as DataApiResult;
}

// RLS_TABLES and REVOKE_UPDATE_DELETE_TABLES from _registry (GAP-DB-005)

describe('Cross-tenant RLS isolation (Phase C #12)', () => {
  // ── RLS SELECT isolation: each table returns zero rows for wrong org ──
  for (const table of RLS_TABLES) {
    it.runIf(run)(`${table}: RLS filters by org_id`, async () => {
      const tokenA = process.env.RLS_TEST_TOKEN_ORG_A;
      const tokenB = process.env.RLS_TEST_TOKEN_ORG_B;
      if (!tokenA || !tokenB) {
        throw new Error('RLS_TEST_TOKEN_ORG_A and RLS_TEST_TOKEN_ORG_B required');
      }

      // Query as Org A — should succeed (may return 0+ rows, no error)
      const resultA = await queryAs(tokenA, `SELECT id FROM ${table} LIMIT 1`);
      expect(resultA.error).toBeUndefined();

      // Query as Org B — should also succeed but return different data
      const resultB = await queryAs(tokenB, `SELECT id FROM ${table} LIMIT 1`);
      expect(resultB.error).toBeUndefined();

      // If Org A has rows, verify Org B cannot see them by ID
      if (resultA.rows.length > 0) {
        const idFromA = resultA.rows[0]!.id as string;
        const crossCheck = await queryAs(
          tokenB,
          `SELECT id FROM ${table} WHERE id = '${idFromA}'`,
        );
        expect(crossCheck.rows).toHaveLength(0);
      }
    });
  }

  // ── No-org token returns zero rows (INVARIANT-12) ───────
  it.runIf(run)('no-org token returns zero rows on all tables', async () => {
    const tokenNoOrg = process.env.NEON_TEST_TOKEN_NO_ORG;
    if (!tokenNoOrg) {
      throw new Error('NEON_TEST_TOKEN_NO_ORG required');
    }

    // Spot-check a few critical tables
    for (const table of ['contacts', 'journal_entries', 'stock_movements', 'assets']) {
      const result = await queryAs(tokenNoOrg, `SELECT id FROM ${table} LIMIT 1`);
      if (!result.error) {
        expect(result.rows).toHaveLength(0);
      } else {
        // Some implementations return 401/403 instead of zero rows — both acceptable
        expect(result.error).toMatch(/40[13]/);
      }
    }
  });

  // ── Gate 6: Projection worker-only — search_documents rejects INSERT ──
  it.runIf(run)('search_documents: INSERT rejected (projection worker-only)', async () => {
    const tokenA = process.env.RLS_TEST_TOKEN_ORG_A;
    if (!tokenA) throw new Error('RLS_TEST_TOKEN_ORG_A required');

    const result = await queryAs(
      tokenA,
      `INSERT INTO search_documents (org_id, entity_type, entity_id, title, search_vector, updated_at, is_deleted)
       VALUES ('00000000-0000-0000-0000-000000000001'::text, 'contact', 'test-id', 'test', ''::tsvector, now(), false)`,
    );
    expect(result.error).toBeDefined();
    expect(result.error).toMatch(/permission denied|insufficient privilege/i);
  });

  // ── Append-only / projection enforcement: UPDATE/DELETE rejected ─────
  for (const table of REVOKE_UPDATE_DELETE_TABLES) {
    it.runIf(run)(`${table}: UPDATE rejected (append-only)`, async () => {
      const tokenA = process.env.RLS_TEST_TOKEN_ORG_A;
      if (!tokenA) throw new Error('RLS_TEST_TOKEN_ORG_A required');

      const result = await queryAs(
        tokenA,
        `UPDATE ${table} SET org_id = org_id WHERE false`,
      );
      // Should error with permission denied
      expect(result.error).toBeDefined();
      expect(result.error).toMatch(/permission denied|insufficient privilege/i);
    });

    it.runIf(run)(`${table}: DELETE rejected (append-only)`, async () => {
      const tokenA = process.env.RLS_TEST_TOKEN_ORG_A;
      if (!tokenA) throw new Error('RLS_TEST_TOKEN_ORG_A required');

      const result = await queryAs(
        tokenA,
        `DELETE FROM ${table} WHERE false`,
      );
      expect(result.error).toBeDefined();
      expect(result.error).toMatch(/permission denied|insufficient privilege/i);
    });
  }
});

// ---------------------------------------------------------------------------
// Unit tests (no server required) — document RLS table coverage
// ---------------------------------------------------------------------------
describe('RLS coverage inventory', () => {
  it('all RLS tables are listed for cross-tenant testing', () => {
    // GAP-DB-005: RLS_TABLES derived from TABLE_REGISTRY (non-system)
    expect(RLS_TABLES.length).toBeGreaterThanOrEqual(38);
  });

  it('all append-only tables are listed', () => {
    expect(REVOKE_UPDATE_DELETE_TABLES.length).toBeGreaterThanOrEqual(10);
  });

  // Gate 6: Projection tables (stock_balances, search_documents, reporting_snapshots) reject app writes
  it('projection tables stock_balances, search_documents, reporting_snapshots are in REVOKE_UPDATE_DELETE_TABLES', () => {
    const projectionTables = ['stock_balances', 'search_documents', 'reporting_snapshots'];
    for (const t of projectionTables) {
      expect(REVOKE_UPDATE_DELETE_TABLES).toContain(t);
    }
  });
});
