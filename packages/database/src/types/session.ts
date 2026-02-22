/**
 * Database Session Types
 * 
 * Core types for the DbSession primitive - the single entrypoint for all database access.
 */

import type * as schema from '../schema';
import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { NeonHttpDatabase, NeonHttpQueryResultHKT } from 'drizzle-orm/neon-http';
import type { PgTransaction } from 'drizzle-orm/pg-core';

/**
 * Database instance type with full schema
 */
export type DbInstance = NeonHttpDatabase<typeof schema>;

/**
 * Transaction type for Neon HTTP
 */
export type DbTransaction = PgTransaction<
  NeonHttpQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;

/**
 * Database or transaction type (used in session methods)
 */
export type DbOrTransaction = DbInstance | DbTransaction;

/**
 * Authentication context required for all database sessions
 * 
 * @property orgId - Organization UUID for tenant isolation
 * @property userId - User identifier for audit trails
 * @property role - Optional role for specialized access patterns
 */
export interface AuthContext {
  orgId: string;
  userId: string;
  role?: 'authenticated' | 'worker' | 'support_admin';
}

/**
 * Query shape key for observability and monitoring
 * 
 * All production queries must be tagged with a shape key from QUERY_SHAPES registry.
 */
export type QueryShapeKey = string;

/**
 * Database Session - Single Entrypoint for Database Access
 * 
 * The DbSession primitive enforces:
 * - Auth context setting (RLS requires it)
 * - Read routing (replica vs primary based on writes)
 * - Query shape tagging (observability)
 * - Write tracking (read-after-write detection)
 * 
 * @example
 * ```typescript
 * const session = createDbSession({ orgId, userId });
 * 
 * // Write transaction (sets auth context, uses primary)
 * const invoice = await session.rw(async (tx) => {
 *   return tx.insert(invoices).values(data).returning();
 * });
 * 
 * // Read transaction (sets auth context, uses replica or primary if wrote)
 * const list = await session.ro(async (tx) => {
 *   return tx.select().from(invoices).where(eq(invoices.orgId, orgId));
 * });
 * ```
 */
export interface DbSession {
  /**
   * Read-write transaction
   * 
   * - Sets auth context as first statement
   * - Uses primary database
   * - Marks session as having written (affects subsequent reads)
   * 
   * @param fn - Transaction function receiving transaction object
   * @returns Result from transaction function
   */
  rw<T>(fn: (tx: DbOrTransaction) => Promise<T>): Promise<T>;

  /**
   * Read-only transaction
   * 
   * - Sets auth context as first statement (RLS requires it)
   * - Uses replica if no writes, primary if session has written
   * - Uses read-only transaction mode to prevent accidental writes
   * 
   * @param fn - Transaction function receiving transaction object
   * @returns Result from transaction function
   */
  ro<T>(fn: (tx: DbOrTransaction) => Promise<T>): Promise<T>;

  /**
   * Read query (convenience method)
   * 
   * Alias for ro() - routes to read-only transaction internally
   * 
   * @param fn - Query function receiving database instance
   * @returns Result from query function
   */
  read<T>(fn: (tx: DbOrTransaction) => Promise<T>): Promise<T>;

  /**
   * Tagged query with shape ID
   * 
   * Wraps query execution with observability:
   * - Logs slow queries
   * - Tracks query duration
   * - Associates with shape ID for monitoring
   * 
   * @param shapeKey - Query shape identifier from QUERY_SHAPES
   * @param fn - Query function to execute
   * @returns Result from query function
   */
  query<T>(shapeKey: QueryShapeKey, fn: () => Promise<T>): Promise<T>;

  /**
   * Write tracking flag
   * 
   * True if session has performed any write operations.
   * Used for read routing (writes force primary for subsequent reads).
   */
  readonly wrote: boolean;
}

/**
 * Transaction options for Drizzle
 */
export interface TransactionOptions {
  accessMode?: 'read only' | 'read write';
  isolationLevel?: 'read uncommitted' | 'read committed' | 'repeatable read' | 'serializable';
}
