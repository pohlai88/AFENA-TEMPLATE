/**
 * Batch API — multiple read statements in one round trip.
 *
 * Use for list+count patterns to reduce latency (fewer round trips).
 * For mutations: use db.transaction() instead — batch is sequential, not atomic.
 *
 * @example
 * const [rows, count] = await batch([
 *   dbRo.select().from(contacts).where(eq(contacts.orgId, orgId)).limit(50),
 *   dbRo.select({ count: sql<number>`count(*)::int` }).from(contacts).where(eq(contacts.orgId, orgId)),
 * ]);
 */
import { dbRo } from './db';

/**
 * Executes multiple read statements in one round trip.
 * Uses dbRo — for read-only list+count patterns.
 */
export function batch(queries: Parameters<typeof dbRo.batch>[0]): ReturnType<typeof dbRo.batch> {
  return dbRo.batch(queries);
}
