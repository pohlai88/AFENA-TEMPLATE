/**
 * Database Session - Single Entrypoint for Database Access
 * 
 * The DbSession primitive enforces v2.6 architecture invariants:
 * - INV-SESSION-01: All app DB access goes through DbSession
 * - INV-SESSION-CTX-01: Auth context set as first statement
 * - INV-READ-SESSION-01: Session decides primary vs replica routing
 * 
 * @module db-session
 */

import { setAuthContext, validateAuthContext } from './auth-context';
import { db, dbRo } from './db';

import type {
  AuthContext,
  DbOrTransaction,
  DbSession,
  QueryShapeKey,
  TransactionOptions,
} from './types/session';

/**
 * Create a database session with auth context
 * 
 * This is the ONLY way application code should access the database.
 * Direct imports of `db` or `dbRo` are forbidden outside of:
 * - packages/database/src/db-session.ts (this file)
 * - packages/database/src/ddl/* (DDL helpers)
 * - packages/database/scripts/* (admin scripts)
 * - packages/workers/* (projection rebuilders with BYPASSRLS)
 * 
 * @param ctx - Authentication context (orgId, userId, optional role)
 * @returns DbSession instance with rw(), ro(), read(), query() methods
 * 
 * @example
 * ```typescript
 * // In API handler
 * export async function handleInvoiceCreate(req: Request) {
 *   const { orgId, userId } = await extractAuthFromJWT(req);
 *   const session = createDbSession({ orgId, userId });
 *   
 *   // Write transaction
 *   const invoice = await session.rw(async (tx) => {
 *     return tx.insert(invoices).values(data).returning();
 *   });
 *   
 *   // Read-after-write: automatically uses primary
 *   return session.ro(async (tx) => {
 *     return tx.select().from(invoices).where(eq(invoices.id, invoice.id));
 *   });
 * }
 * ```
 */
export function createDbSession(ctx: AuthContext): DbSession {
  // Validate auth context on session creation
  validateAuthContext(ctx.orgId, ctx.userId);

  // Track if session has performed any writes
  let wrote = false;

  return {
    async rw<T>(fn: (tx: DbOrTransaction) => Promise<T>): Promise<T> {
      // Mark session as having written
      wrote = true;

      return db.transaction(async (tx) => {
        // CRITICAL: Set auth context as first statement
        await setAuthContext(tx, ctx.orgId, ctx.userId);

        return fn(tx);
      });
    },

    async ro<T>(fn: (tx: DbOrTransaction) => Promise<T>): Promise<T> {
      // CRITICAL: RLS predicates use auth.org_id(), so context MUST be set
      // Use read-only transaction to prevent accidental writes
      const client = wrote ? db : dbRo; // Route to primary if wrote

      return client.transaction(
        async (tx) => {
          // Set auth context even for reads (RLS requires it)
          await setAuthContext(tx, ctx.orgId, ctx.userId);

          return fn(tx);
        },
        {
          accessMode: 'read only',
          isolationLevel: 'read committed',
        } as TransactionOptions
      );
    },

    async read<T>(fn: (tx: DbOrTransaction) => Promise<T>): Promise<T> {
      // Convenience method - routes to ro() internally
      return this.ro(fn);
    },

    async query<T>(shapeKey: QueryShapeKey, fn: () => Promise<T>): Promise<T> {
      // Query shape tagging for observability
      // This will be enhanced with actual monitoring in Phase 1.2
      const start = Date.now();

      try {
        const result = await fn();
        const duration = Date.now() - start;

        // Log slow queries (> 1000ms)
        if (duration > 1000) {
          console.warn('[DbSession] Slow query detected', {
            shapeKey,
            duration,
            orgId: ctx.orgId,
          });
        }

        return result;
      } catch (error) {
        console.error('[DbSession] Query failed', {
          shapeKey,
          orgId: ctx.orgId,
          error: error instanceof Error ? error.message : String(error),
        });
        throw error;
      }
    },

    get wrote() {
      return wrote;
    },
  };
}

/**
 * Create a worker session with BYPASSRLS
 * 
 * Workers are projection rebuilders that need cross-org access.
 * They MUST:
 * - Use SEARCH_WORKER_DATABASE_URL (has BYPASSRLS role)
 * - Set org_id explicitly in WHERE clauses
 * - NEVER call auth.* functions
 * 
 * @param workerName - Name of the worker for audit trails
 * @returns DbSession-like interface for worker operations
 * 
 * @example
 * ```typescript
 * // In packages/workers/search-indexer/rebuild.ts
 * export async function rebuildSearchDocuments(orgId: string) {
 *   const session = createWorkerSession('search-indexer');
 *   
 *   await session.rw(async (tx) => {
 *     // CRITICAL: Explicit org_id in WHERE
 *     const docs = await tx.select().from(invoices)
 *       .where(eq(invoices.orgId, orgId));
 *     
 *     await tx.insert(searchDocuments).values(
 *       docs.map(d => ({ orgId, ...d }))
 *     );
 *   });
 * }
 * ```
 */
export function createWorkerSession(workerName: string) {
  console.log('[DbSession] Creating worker session', { workerName });

  return {
    async rw<T>(fn: (tx: DbOrTransaction) => Promise<T>): Promise<T> {
      // Workers use primary database (no replica routing)
      return db.transaction(async (tx) => {
        // NO auth context setting - workers have BYPASSRLS
        return fn(tx);
      });
    },

    async ro<T>(fn: (tx: DbOrTransaction) => Promise<T>): Promise<T> {
      // Workers can read from replica
      return dbRo.transaction(async (tx) => {
        return fn(tx);
      });
    },
  };
}

/**
 * Type guard to check if a value is a DbSession
 */
export function isDbSession(value: unknown): value is DbSession {
  return (
    typeof value === 'object' &&
    value !== null &&
    'rw' in value &&
    'ro' in value &&
    'read' in value &&
    'query' in value &&
    'wrote' in value
  );
}
