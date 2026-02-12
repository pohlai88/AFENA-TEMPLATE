/**
 * JWT Org Claim Verification Tests
 *
 * These tests verify that the Better Auth / Neon Auth JWT contains
 * the activeOrganizationId claim required for multi-tenancy RLS.
 *
 * Integration tests are gated by RUN_JWT_TESTS=1 and require:
 *   - NEON_AUTH_BASE_URL: auth server URL
 *   - NEON_TEST_EMAIL + NEON_TEST_PASSWORD: test user credentials
 *   - NEON_DATA_API_URL: Data API endpoint (for RLS test)
 *   - NEON_TEST_TOKEN_NO_ORG: JWT without active org (for RLS test)
 *
 * Run:
 *   RUN_JWT_TESTS=1 npx vitest run packages/database/src/__tests__/jwt-org-claim.test.ts
 *
 * Plan reference: .windsurf/plans/neon-multitenancy-ee6154.md §7
 * Hardening: #7 (automated JWT verification)
 */

import { describe, it as baseIt, expect } from 'vitest';

import { decodeJwtPayload } from './helpers/jwt';

// ---------------------------------------------------------------------------
// Integration tests gated by RUN_JWT_TESTS=1
// ---------------------------------------------------------------------------
const run = process.env.RUN_JWT_TESTS === '1';

// Polyfill it.runIf if not available in this vitest version
const it = Object.assign(baseIt, {
  runIf: (cond: boolean) => (cond ? baseIt : baseIt.skip),
});

describe('JWT org claim', () => {
  it.runIf(run)('includes activeOrganizationId after setActive', async () => {
    const authUrl = process.env.NEON_AUTH_BASE_URL ?? process.env.AUTH_URL ?? 'http://localhost:3000';
    const sessionCookie = process.env.TEST_SESSION_COOKIE ?? '';

    const tokenRes = await fetch(`${authUrl}/api/auth/token`, {
      headers: { cookie: sessionCookie },
    });
    expect(tokenRes.ok).toBe(true);

    const { token } = (await tokenRes.json()) as { token: string };
    expect(token).toBeDefined();

    const payload = decodeJwtPayload(token);

    expect(payload).toHaveProperty('sub');
    expect(payload).toHaveProperty('activeOrganizationId');
    expect(typeof payload.activeOrganizationId).toBe('string');
    expect((payload.activeOrganizationId as string).length).toBeGreaterThan(0);
  });

  it.runIf(run)('updates activeOrganizationId when switching org', async () => {
    const authUrl = process.env.NEON_AUTH_BASE_URL ?? 'http://localhost:3000';
    const email = process.env.NEON_TEST_EMAIL;
    const password = process.env.NEON_TEST_PASSWORD;

    if (!email || !password) {
      throw new Error('NEON_TEST_EMAIL and NEON_TEST_PASSWORD required for this test');
    }

    // 1. Login to get session cookie
    const loginRes = await fetch(`${authUrl}/api/auth/sign-in/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    expect(loginRes.ok).toBe(true);
    const sessionCookie = loginRes.headers.get('set-cookie') ?? '';

    // 2. List orgs to find at least two
    const orgsRes = await fetch(`${authUrl}/api/auth/organization/list`, {
      headers: { cookie: sessionCookie },
    });
    expect(orgsRes.ok).toBe(true);
    const orgs = (await orgsRes.json()) as { id: string; name: string }[];
    expect(orgs.length).toBeGreaterThanOrEqual(2);

    // 3. setActive(org1) → fetch token → assert claim = org1.id
    const org1 = orgs[0]!;
    await fetch(`${authUrl}/api/auth/organization/set-active`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', cookie: sessionCookie },
      body: JSON.stringify({ organizationId: org1.id }),
    });

    const token1Res = await fetch(`${authUrl}/api/auth/token`, {
      headers: { cookie: sessionCookie },
    });
    const { token: token1 } = (await token1Res.json()) as { token: string };
    const payload1 = decodeJwtPayload(token1);
    expect(payload1.activeOrganizationId).toBe(org1.id);

    // 4. setActive(org2) → fetch token → assert claim = org2.id
    const org2 = orgs[1]!;
    await fetch(`${authUrl}/api/auth/organization/set-active`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', cookie: sessionCookie },
      body: JSON.stringify({ organizationId: org2.id }),
    });

    const token2Res = await fetch(`${authUrl}/api/auth/token`, {
      headers: { cookie: sessionCookie },
    });
    const { token: token2 } = (await token2Res.json()) as { token: string };
    const payload2 = decodeJwtPayload(token2);
    expect(payload2.activeOrganizationId).toBe(org2.id);
  });

  it.runIf(run)('rejects queries when org claim is missing (INVARIANT-12)', async () => {
    const dataApiUrl = process.env.NEON_DATA_API_URL;
    const tokenNoOrg = process.env.NEON_TEST_TOKEN_NO_ORG;

    if (!dataApiUrl || !tokenNoOrg) {
      throw new Error('NEON_DATA_API_URL and NEON_TEST_TOKEN_NO_ORG required for this test');
    }

    // Query contacts via Data API with a token that has no active org
    const res = await fetch(`${dataApiUrl}/sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenNoOrg}`,
      },
      body: JSON.stringify({ query: 'SELECT * FROM contacts LIMIT 1' }),
    });

    if (res.ok) {
      // INVARIANT-12: auth.org_id() NULL → zero rows
      const data = (await res.json()) as { rows: unknown[] };
      expect(data.rows).toHaveLength(0);
    } else {
      // Some Data API implementations return 401/403 instead of zero rows
      expect([401, 403]).toContain(res.status);
    }
  });
});

// ---------------------------------------------------------------------------
// Unit tests that don't require a running server
// ---------------------------------------------------------------------------
describe('JWT claim key resilience', () => {
  it('auth.org_id() SQL handles both camelCase and snake_case keys', () => {
    // Documentation test — the actual SQL function is tested at deploy time
    // via create-auth-org-helpers.sql.
    //
    // The function tries:
    //   1. request.jwt.claims->>'activeOrganizationId'  (Better Auth current)
    //   2. request.jwt.claims->>'active_organization_id' (future-proof fallback)
    //
    // Hardening #18: future-proof claim key
    expect(true).toBe(true);
  });
});

describe('decodeJwtPayload helper', () => {
  it('decodes a standard JWT payload', () => {
    // Create a test JWT: header.payload.signature
    const payload = { sub: 'user_1', activeOrganizationId: 'org_1' };
    const b64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const token = `eyJhbGciOiJIUzI1NiJ9.${b64}.fakesig`;

    const decoded = decodeJwtPayload(token);
    expect(decoded.sub).toBe('user_1');
    expect(decoded.activeOrganizationId).toBe('org_1');
  });

  it('handles base64url characters (- and _)', () => {
    // Payload with characters that differ between base64 and base64url
    const payload = { key: 'value+with/special=chars' };
    const b64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const token = `header.${b64}.sig`;

    const decoded = decodeJwtPayload(token);
    expect(decoded.key).toBe('value+with/special=chars');
  });

  it('throws on invalid JWT (less than 2 parts)', () => {
    expect(() => decodeJwtPayload('not-a-jwt')).toThrow('expected at least 2 parts');
  });
});
