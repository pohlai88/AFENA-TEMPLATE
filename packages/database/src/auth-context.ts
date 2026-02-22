/**
 * Authentication Context Management
 * 
 * Handles setting and managing auth context for Row-Level Security (RLS).
 * Auth context must be set as the first statement in every transaction.
 */

import { sql } from 'drizzle-orm';

import type { DbInstance, DbOrTransaction } from './types/session';

/**
 * Set authentication context for RLS
 * 
 * CRITICAL: This MUST be called as the first statement in every transaction.
 * RLS policies use auth.org_id() and auth.user_id() which read from this context.
 * 
 * The context is transaction-scoped (is_local = true), so it's automatically
 * cleaned up when the transaction ends.
 * 
 * @param tx - Database or transaction instance
 * @param orgId - Organization UUID for tenant isolation
 * @param userId - User identifier for audit trails
 * 
 * @example
 * ```typescript
 * await db.transaction(async (tx) => {
 *   await setAuthContext(tx, orgId, userId);
 *   // Now RLS policies can access auth.org_id() and auth.user_id()
 *   return tx.select().from(invoices);
 * });
 * ```
 */
export async function setAuthContext(
  tx: DbOrTransaction,
  orgId: string,
  userId: string
): Promise<void> {
  await tx.execute(
    sql`SELECT auth.set_context(${orgId}::uuid, ${userId}::text)`
  );
}

/**
 * Validate auth context parameters
 * 
 * Ensures orgId and userId are valid before setting context.
 * Throws descriptive errors for invalid inputs.
 * 
 * @param orgId - Organization UUID to validate
 * @param userId - User identifier to validate
 * @throws Error if orgId is not a valid UUID format
 * @throws Error if userId is empty or invalid
 */
export function validateAuthContext(orgId: string, userId: string): void {
  // Validate orgId is UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(orgId)) {
    throw new Error(
      `Invalid orgId format: "${orgId}". Must be a valid UUID.`
    );
  }

  // Validate userId is not empty
  if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
    throw new Error(
      `Invalid userId: "${userId}". Must be a non-empty string.`
    );
  }
}

/**
 * Transaction wrapper with automatic auth context setting
 * 
 * Convenience wrapper that sets auth context as first statement.
 * Use this when you need a transaction with auth context but don't want
 * to use the full DbSession API.
 * 
 * @param db - Database instance
 * @param orgId - Organization UUID
 * @param userId - User identifier
 * @param fn - Transaction function
 * @returns Result from transaction function
 * 
 * @example
 * ```typescript
 * const result = await withAuthContext(db, orgId, userId, async (tx) => {
 *   return tx.insert(invoices).values(data).returning();
 * });
 * ```
 */
export async function withAuthContext<T>(
  db: DbInstance,
  orgId: string,
  userId: string,
  fn: (tx: DbOrTransaction) => Promise<T>
): Promise<T> {
  validateAuthContext(orgId, userId);

  return db.transaction(async (tx) => {
    await setAuthContext(tx, orgId, userId);
    return fn(tx);
  });
}
