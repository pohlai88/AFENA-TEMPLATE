/**
 * Shared integration test helper for finance domain packages.
 *
 * vitest.integration.config.ts provides a stub DATABASE_URL when .env has none,
 * so afenda-database loads without crashing (AGENT.md section 5).
 *
 * Integration tests exercise service orchestration (calculator + query + intent
 * wiring) using a mock DbSession. The neon-http driver does not support
 * transaction(), so real DB round-trips are not possible in this environment.
 * Query functions receive a mock tx that returns empty arrays.
 *
 * Usage:
 *   import { describeIntegration, mockDbSession, testCtx } from '../../test-utils/integration-helper';
 */
import type { DomainContext } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { describe } from 'vitest';

export const TEST_ORG_ID = '550e8400-e29b-41d4-a716-446655440000';
export const TEST_USER_ID = 'integration-test-runner';

/**
 * Wrapper around describe for integration tests. Always runs (never skipped)
 * because tests use a mock DbSession, not a real DB connection.
 */
export function describeIntegration(name: string, fn: () => void): void {
  describe(name, fn);
}

/**
 * Mock DbSession that satisfies the DbSession interface.
 *
 * - rw/ro/read: invoke the callback with a mock tx whose select() returns
 *   an empty array by default. Callers can override via txOverride.
 * - query: invokes the callback directly.
 * - wrote: always false.
 */
export function mockDbSession(): DbSession {
  // Recursive proxy: any property access or function call returns the same
  // chainable proxy. When iterated (for..of, spread, Array.isArray) it
  // behaves as an empty array. This covers arbitrary Drizzle chains like
  // .select().from().where().groupBy().orderBy().limit() etc.
  const emptyChain: any = new Proxy(Object.assign([], { then: undefined }), {
    get(_target, prop) {
      if (prop === Symbol.iterator) return [][Symbol.iterator];
      if (prop === 'length') return 0;
      if (prop === 'then') return undefined;
      if (prop === Symbol.toPrimitive) return () => '';
      return () => emptyChain;
    },
  });

  const mockTx = new Proxy({} as any, {
    get(_target, prop) {
      if (prop === 'execute') return () => Promise.resolve([]);
      return () => emptyChain;
    },
  });

  const handler = async <T>(fn: (tx: any) => Promise<T>): Promise<T> => fn(mockTx);

  return {
    rw: handler,
    ro: handler,
    read: handler,
    query: async <T>(_shapeKey: string, fn: () => Promise<T>): Promise<T> => fn(),
    get wrote() { return false; },
  };
}

/**
 * Standard DomainContext for integration tests.
 */
export function testCtx(overrides?: Partial<DomainContext>): DomainContext {
  return {
    orgId: TEST_ORG_ID,
    actor: {
      userId: TEST_USER_ID,
      roles: ['admin'],
    },
    ...overrides,
  };
}
