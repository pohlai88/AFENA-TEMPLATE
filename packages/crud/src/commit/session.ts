/**
 * Mutation Transaction Wrapper — Phase 5 (K-02)
 *
 * `withMutationTransaction` and `withReadSession` are the ONLY way afenda-crud
 * opens DB connections. Both always use `createDbSession()` with full auth
 * context (orgId + userId + role), which sets `SET LOCAL` before every query
 * for Postgres RLS + app-level row isolation (Phase 5: MODE A removed).
 *
 * Write transactions are additionally wrapped with `withDbRetry()` to
 * transparently retry on transient connection/timeout errors.
 *
 * Test injection: use `_setDbSessionFactory(fn)` to supply a mock session
 * without needing real Neon credentials. Pass `null` to restore the default.
 *
 * @see INTEGRATION_PLAN.md §5.1 — session.ts always-on
 * @see packages/database/src/types/session.ts — DbSession interface
 */

import type { DbSession, DbTransaction } from 'afenda-database';
import {
    createDbSession,
    withDbRetry,
} from 'afenda-database';
import type { MutationContext } from '../context';

/** Allow injection during tests so we don't need real Neon credentials. */
let _getDbSession: ((ctx: MutationContext) => DbSession) | null = null;

/**
 * Override the DbSession factory. For **tests only**.
 * Pass `null` to restore the default factory.
 */
export function _setDbSessionFactory(
  factory: ((ctx: MutationContext) => DbSession) | null,
): void {
  _getDbSession = factory;
}

/**
 * Open a write transaction for a mutation.
 *
 * Always uses `createDbSession()` with auth context.  `session.rw(fn)` sets
 * `SET LOCAL` for RLS before the caller's code runs, then commits/rolls-back.
 * The whole thing is wrapped with `withDbRetry()` for transient error recovery.
 *
 * @param ctx  - MutationContext containing actor identifiers
 * @param fn   - Async function receiving the Drizzle transaction
 * @returns    - Whatever `fn` resolves to
 */
export async function withMutationTransaction<T>(
  ctx: MutationContext,
  fn: (tx: DbTransaction) => Promise<T>,
): Promise<T> {
  if (_getDbSession) {
    // Test injection path — no withDbRetry so tests stay fast / deterministic
    const session = _getDbSession(ctx);
    return session.rw(fn as (tx: any) => Promise<T>);
  }

  const session = createDbSession({
    orgId: ctx.actor.orgId,
    userId: ctx.actor.userId,
    role: 'authenticated',
  });
  return withDbRetry(() => session.rw(fn as (tx: any) => Promise<T>));
}

/**
 * Open a read-only session for pre-transaction reads (e.g. resolve target row).
 *
 * Uses `session.ro()` to route reads to the read replica when possible, while
 * still applying the auth context for RLS row-filtering.
 *
 * @param ctx  - MutationContext containing actor identifiers
 * @param fn   - Async function receiving the db query builder
 * @returns    - Whatever `fn` resolves to
 */
export async function withReadSession<T>(
  ctx: MutationContext,
  fn: (db: any) => Promise<T>,
): Promise<T> {
  if (_getDbSession) {
    const session = _getDbSession(ctx);
    return session.ro(fn);
  }

  const session = createDbSession({
    orgId: ctx.actor.orgId,
    userId: ctx.actor.userId,
    role: 'authenticated',
  });
  return session.ro(fn);
}
