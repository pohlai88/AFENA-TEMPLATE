/**
 * Batch Query Helper
 *
 * Wraps the Drizzle NeonHttpDatabase `.batch()` method for ergonomic use
 * in CRUD layer reads. Sends multiple queries in a single HTTP round-trip
 * to Neon — critical for list + count patterns.
 *
 * K-12: Do NOT use inside a write transaction. Batch is for read-only
 * round-trips (list/count). The write path should use `tx.execute`.
 *
 * @example
 *   const [rows, counts] = await batch([
 *     db.select().from(contacts).where(...),
 *     db.select({ count: sql<number>`count(*)`}).from(contacts).where(...),
 *   ]);
 */
import { db, dbRo } from '../db';

/**
 * Execute multiple Drizzle queries in a single Neon HTTP batch round-trip.
 * Uses the read-only compute by default (pass forcePrimary for RW).
 *
 * The return type is a tuple matching the input queries, but typed as `any[]`
 * to avoid Drizzle's BatchItem generic constraint issues at the helper surface.
 * Callers are expected to type-assert their results.
 */
export async function batch(
  queries: any[],
  opts?: { forcePrimary?: boolean },
): Promise<any[]> {
  const conn = opts?.forcePrimary ? db : dbRo;
  return (conn as any).batch(queries);
}
