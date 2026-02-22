/**
 * Finance Domain — Integration Test Helper
 *
 * Provides shared utilities for integration tests that run against a real
 * Postgres database. Tests using this helper are gated by the `DATABASE_URL`
 * environment variable.
 *
 * Usage in test files:
 * ```ts
 * import { describeIntegration, createTestContext } from '../../../test-helpers/integration';
 *
 * describeIntegration('my-package queries', (ctx) => {
 *   it('should query real data', async () => {
 *     const result = await myQuery(ctx.db, ctx.domainCtx, { ... });
 *     expect(result).toBeDefined();
 *   });
 * });
 * ```
 */

import type { DomainContext } from 'afenda-canon';

/** Whether integration tests should run (DATABASE_URL is set). */
export const HAS_DATABASE = Boolean(process.env['DATABASE_URL']);

/**
 * Create a minimal DomainContext for integration testing.
 * Uses deterministic values so tests are reproducible.
 */
export function createTestContext(overrides?: Partial<DomainContext>): DomainContext {
  return {
    orgId: 'test-org-001' as DomainContext['orgId'],
    companyId: 'test-company-001' as DomainContext['companyId'],
    currencyCode: 'USD' as DomainContext['currencyCode'],
    asOf: '2026-01-15T00:00:00.000Z' as DomainContext['asOf'],
    actor: {
      userId: 'test-user-001',
      displayName: 'Integration Test',
    } as DomainContext['actor'],
    activeOverlays: [],
    ...overrides,
  };
}

/**
 * Wrapper around `describe` that skips the entire suite when DATABASE_URL
 * is not available. This prevents CI failures in environments without
 * a test database.
 */
export function describeIntegration(name: string, fn: () => void): void {
  if (HAS_DATABASE) {
    describe(`[integration] ${name}`, fn);
  } else {
    describe.skip(`[integration] ${name} (no DATABASE_URL)`, fn);
  }
}
