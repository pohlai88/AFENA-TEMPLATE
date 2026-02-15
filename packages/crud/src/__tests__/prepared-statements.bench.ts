/**
 * Benchmark: Prepared statements vs regular queries
 * Tests if neon-http driver benefits from .prepare() calls
 * 
 * Run: pnpm test prepared-statements.bench.ts
 */

import { beforeAll, describe, it, expect } from 'vitest';
import { db, dbRo, contacts } from 'afena-database';
import { eq, and } from 'drizzle-orm';

// Prepared statement declarations (module-level)
const readContactById = dbRo
  .select()
  .from(contacts)
  .where(and(eq(contacts.id, '' as any), eq(contacts.isDeleted, false)))
  .limit(1)
  .prepare('read_contact_by_id');

const listContactsByOrg = dbRo
  .select()
  .from(contacts)
  .where(eq(contacts.isDeleted, false))
  .limit(100)
  .prepare('list_contacts_by_org');

describe('Prepared Statements Benchmark', () => {
  let testContactId: string;
  let testOrgId: string;

  beforeAll(async () => {
    // Create a test contact for benchmarking
    const [contact] = await db
      .insert(contacts)
      .values({
        name: 'Benchmark Test Contact',
        email: `bench-${Date.now()}@example.com`,
      })
      .returning();
    
    testContactId = contact.id;
    testOrgId = contact.orgId;
  });

  describe('Read by ID', () => {
    it('should benchmark regular query (baseline)', async () => {
      const iterations = 100;
      const start = performance.now();

      for (let i = 0; i < iterations; i++) {
        await dbRo
          .select()
          .from(contacts)
          .where(and(eq(contacts.id, testContactId), eq(contacts.isDeleted, false)))
          .limit(1);
      }

      const duration = performance.now() - start;
      const avgMs = duration / iterations;

      console.log(`Regular query: ${avgMs.toFixed(2)}ms avg (${iterations} iterations)`);
      expect(avgMs).toBeGreaterThan(0);
    });

    it('should benchmark prepared statement', async () => {
      const iterations = 100;
      const start = performance.now();

      for (let i = 0; i < iterations; i++) {
        await readContactById.execute({ id: testContactId });
      }

      const duration = performance.now() - start;
      const avgMs = duration / iterations;

      console.log(`Prepared stmt: ${avgMs.toFixed(2)}ms avg (${iterations} iterations)`);
      expect(avgMs).toBeGreaterThan(0);
    });
  });

  describe('List by Org', () => {
    it('should benchmark regular query (baseline)', async () => {
      const iterations = 50;
      const start = performance.now();

      for (let i = 0; i < iterations; i++) {
        await dbRo
          .select()
          .from(contacts)
          .where(eq(contacts.isDeleted, false))
          .limit(100);
      }

      const duration = performance.now() - start;
      const avgMs = duration / iterations;

      console.log(`Regular list: ${avgMs.toFixed(2)}ms avg (${iterations} iterations)`);
      expect(avgMs).toBeGreaterThan(0);
    });

    it('should benchmark prepared statement', async () => {
      const iterations = 50;
      const start = performance.now();

      for (let i = 0; i < iterations; i++) {
        await listContactsByOrg.execute();
      }

      const duration = performance.now() - start;
      const avgMs = duration / iterations;

      console.log(`Prepared list: ${avgMs.toFixed(2)}ms avg (${iterations} iterations)`);
      expect(avgMs).toBeGreaterThan(0);
    });
  });

  describe('Cold Start Simulation', () => {
    it('should measure first-call overhead for regular query', async () => {
      const start = performance.now();
      await dbRo
        .select()
        .from(contacts)
        .where(and(eq(contacts.id, testContactId), eq(contacts.isDeleted, false)))
        .limit(1);
      const duration = performance.now() - start;

      console.log(`Cold start regular: ${duration.toFixed(2)}ms`);
      expect(duration).toBeGreaterThan(0);
    });

    it('should measure first-call overhead for prepared statement', async () => {
      const start = performance.now();
      await readContactById.execute({ id: testContactId });
      const duration = performance.now() - start;

      console.log(`Cold start prepared: ${duration.toFixed(2)}ms`);
      expect(duration).toBeGreaterThan(0);
    });
  });
});

/**
 * Expected results for neon-http driver:
 * - Prepared statements may NOT show significant benefit
 * - HTTP-based drivers don't persist connection state
 * - Each request is stateless (new HTTP fetch)
 * 
 * If prepared shows <10% improvement:
 * - Document as "no benefit for neon-http"
 * - Use query-shape optimization + batching instead
 * - Keep module-level db (connection reuse still helps)
 * 
 * If prepared shows >20% improvement:
 * - Implement prepared statements for hot paths
 * - Document driver-specific behavior
 * - Add to DRIZ-03 implementation
 */
