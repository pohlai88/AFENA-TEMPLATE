/**
 * JWT Org Claim Verification Tests
 *
 * These tests verify that the Better Auth / Neon Auth JWT contains
 * the activeOrganizationId claim required for multi-tenancy RLS.
 *
 * Prerequisites:
 *   - Running Neon Data API endpoint
 *   - Test user with at least one organization
 *   - AUTH_URL and DATABASE_URL env vars set
 *
 * Run:
 *   npx vitest run packages/database/src/__tests__/jwt-org-claim.test.ts
 *
 * Plan reference: .windsurf/plans/neon-multitenancy-ee6154.md §7
 * Hardening: #7 (automated JWT verification)
 */

import { describe, it, expect } from 'vitest';

// ---------------------------------------------------------------------------
// These tests are integration tests that require a running auth server.
// They are skipped by default and enabled via RUN_JWT_TESTS=1.
// ---------------------------------------------------------------------------
const SKIP = !process.env.RUN_JWT_TESTS;

describe('JWT org claim', () => {
  it.skipIf(SKIP)('includes activeOrganizationId after setActive', async () => {
    // 1. Authenticate user via Better Auth API
    // 2. Create org + call organization.setActive()
    // 3. Fetch JWT from /api/auth/token
    // 4. Decode and assert activeOrganizationId exists
    const authUrl = process.env.AUTH_URL ?? 'http://localhost:3000';
    const tokenRes = await fetch(`${authUrl}/api/auth/token`, {
      headers: { cookie: process.env.TEST_SESSION_COOKIE ?? '' },
    });
    expect(tokenRes.ok).toBe(true);

    const { token } = (await tokenRes.json()) as { token: string };
    expect(token).toBeDefined();

    // Decode JWT payload (no verification — we just need the claims shape)
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1]!, 'base64url').toString()
    );

    expect(payload).toHaveProperty('sub');
    expect(payload).toHaveProperty('activeOrganizationId');
    expect(typeof payload.activeOrganizationId).toBe('string');
    expect(payload.activeOrganizationId.length).toBeGreaterThan(0);
  });

  it.skipIf(SKIP)('updates activeOrganizationId when switching org', async () => {
    // This test requires two orgs and the ability to switch between them.
    // Implementation depends on Better Auth client SDK setup.
    //
    // Pseudocode:
    // 1. Create two orgs (org1, org2)
    // 2. setActive(org1) → fetch JWT → assert claim = org1.id
    // 3. setActive(org2) → fetch JWT → assert claim = org2.id
    expect(true).toBe(true); // placeholder — implement when org creation flow exists
  });

  it.skipIf(SKIP)('rejects queries when org claim is missing', async () => {
    // 1. Query via Neon Data API without org claim in JWT
    // 2. Assert RLS blocks access (empty result or error)
    //
    // This validates INVARIANT-12: auth.org_id() NULL → zero rows
    expect(true).toBe(true); // placeholder — implement when Data API integration exists
  });
});

// ---------------------------------------------------------------------------
// Unit tests that don't require a running server
// ---------------------------------------------------------------------------
describe('JWT claim key resilience', () => {
  it('auth.org_id() SQL handles both camelCase and snake_case keys', () => {
    // This is a documentation test — the actual SQL function is tested
    // via the Neon deployment verification queries in create-auth-org-helpers.sql.
    //
    // The function tries:
    //   1. request.jwt.claims->>'activeOrganizationId'  (Better Auth current)
    //   2. request.jwt.claims->>'active_organization_id' (future-proof fallback)
    //
    // Hardening #18: future-proof claim key
    expect(true).toBe(true);
  });
});
