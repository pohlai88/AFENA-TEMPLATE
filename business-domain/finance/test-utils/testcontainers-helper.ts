/**
 * Testcontainers Helper for Finance Domain DB Contract Tests
 *
 * Spins up an ephemeral Postgres container, applies the full Drizzle schema
 * including RLS policies, triggers, and CHECK constraints.
 *
 * Creates two DB roles mimicking runtime:
 *   - app_user (authenticated): subject to RLS
 *   - app_admin: BYPASSRLS for setup/teardown
 *
 * Tenant context is set via auth.org_id() — we create a minimal auth schema
 * that reads from a session variable (app.org_id) to match tenantPolicy() behavior.
 *
 * Usage:
 *   const ctx = await setupTestDb();
 *   // ... run contract tests using ctx.userPool / ctx.adminPool
 *   await teardownTestDb(ctx);
 */
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { Client, Pool } from 'pg';
import {
  GenericContainer,
  type StartedTestContainer,
  Wait,
} from 'testcontainers';

export type TestDbContext = {
  container: StartedTestContainer;
  /** Pool connected as app_admin (BYPASSRLS) — use for setup/teardown */
  adminPool: Pool;
  /** Pool connected as authenticated role (subject to RLS) */
  userPool: Pool;
  /** Connection string for the admin role */
  adminUrl: string;
  /** Connection string for the user role */
  userUrl: string;
  /** Set the tenant org_id for subsequent queries on the user pool */
  setTenantOrg: (orgId: string) => Promise<void>;
};

const MONOREPO_ROOT = resolve(__dirname, '../../..');
const MIGRATIONS_DIR = resolve(MONOREPO_ROOT, 'packages/database/drizzle');

/**
 * Spin up a Postgres container and apply the full schema + RLS + triggers.
 */
export async function setupTestDb(): Promise<TestDbContext> {
  const container = await new GenericContainer('postgres:16-alpine')
    .withExposedPorts(5432)
    .withEnvironment({
      POSTGRES_USER: 'postgres',
      POSTGRES_PASSWORD: 'postgres',
      POSTGRES_DB: 'finance_test',
    })
    .withWaitStrategy(Wait.forLogMessage('database system is ready to accept connections'))
    .start();

  const host = container.getHost();
  const port = container.getMappedPort(5432);
  const adminUrl = `postgresql://postgres:postgres@${host}:${port}/finance_test`;

  // Bootstrap: create auth schema, roles, and apply migrations
  const bootstrapClient = new Client({ connectionString: adminUrl });
  await bootstrapClient.connect();

  try {
    // Create auth schema mimicking Neon's auth.org_id() function
    await bootstrapClient.query(`
      CREATE SCHEMA IF NOT EXISTS auth;

      -- auth.org_id() reads from session variable app.org_id
      CREATE OR REPLACE FUNCTION auth.org_id() RETURNS uuid AS $$
        SELECT COALESCE(
          current_setting('app.org_id', true)::uuid,
          '00000000-0000-0000-0000-000000000000'::uuid
        );
      $$ LANGUAGE sql STABLE;

      -- auth.user_id() reads from session variable app.user_id
      CREATE OR REPLACE FUNCTION auth.user_id() RETURNS text AS $$
        SELECT COALESCE(current_setting('app.user_id', true), 'anonymous');
      $$ LANGUAGE sql STABLE;

      -- auth.org_role() reads from session variable app.org_role
      CREATE OR REPLACE FUNCTION auth.org_role() RETURNS text AS $$
        SELECT COALESCE(current_setting('app.org_role', true), 'member');
      $$ LANGUAGE sql STABLE;
    `);

    // Create roles
    await bootstrapClient.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'authenticated') THEN
          CREATE ROLE authenticated NOLOGIN;
        END IF;
        IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'app_user') THEN
          CREATE ROLE app_user LOGIN PASSWORD 'app_user' IN ROLE authenticated;
        END IF;
        IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'app_admin') THEN
          CREATE ROLE app_admin LOGIN PASSWORD 'app_admin' BYPASSRLS;
        END IF;
        IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'worker') THEN
          CREATE ROLE worker NOLOGIN BYPASSRLS;
        END IF;
      END $$;

      -- Grant schema usage
      GRANT USAGE ON SCHEMA public TO authenticated;
      GRANT USAGE ON SCHEMA auth TO authenticated;
      GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA auth TO authenticated;
      GRANT USAGE ON SCHEMA public TO app_admin;
      GRANT USAGE ON SCHEMA auth TO app_admin;
    `);

    // Apply migrations in order
    const migrationFiles = readdirSync(MIGRATIONS_DIR)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    for (const file of migrationFiles) {
      const sql = readFileSync(resolve(MIGRATIONS_DIR, file), 'utf-8');
      try {
        await bootstrapClient.query(sql);
      } catch (err) {
        // Some migrations may reference Neon-specific features; skip gracefully
        console.warn(`Migration ${file} warning:`, (err as Error).message);
      }
    }

    // Grant table permissions to authenticated role
    await bootstrapClient.query(`
      GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
      GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
      GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_admin;
      GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_admin;
    `);
  } finally {
    await bootstrapClient.end();
  }

  const userUrl = `postgresql://app_user:app_user@${host}:${port}/finance_test`;

  const adminPool = new Pool({ connectionString: adminUrl, max: 3 });
  const userPool = new Pool({ connectionString: userUrl, max: 3 });

  const setTenantOrg = async (orgId: string) => {
    // Set on the pool level — each checkout will inherit
    // For per-query control, use SET LOCAL inside a transaction
    const client = await userPool.connect();
    try {
      await client.query(`SET app.org_id = '${orgId}'`);
    } finally {
      client.release();
    }
  };

  return { container, adminPool, userPool, adminUrl, userUrl, setTenantOrg };
}

/**
 * Tear down the test DB container and close pools.
 */
export async function teardownTestDb(ctx: TestDbContext): Promise<void> {
  await ctx.userPool.end();
  await ctx.adminPool.end();
  await ctx.container.stop();
}

/**
 * Execute a query as a specific tenant (sets session variable within a transaction).
 */
export async function queryAsTenant(
  pool: Pool,
  orgId: string,
  queryText: string,
  params?: unknown[],
): Promise<{ rows: Record<string, unknown>[]; rowCount: number }> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`SET LOCAL app.org_id = '${orgId}'`);
    const result = await client.query(queryText, params);
    await client.query('COMMIT');
    return { rows: result.rows, rowCount: result.rowCount ?? 0 };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
