/**
 * W5B — Testcontainers Postgres setup for query contract tests.
 *
 * Spins up a real Postgres container with the 9 finance tables under test.
 * Uses direct DDL instead of full Drizzle migrations to avoid Neon-specific
 * features (auth schema, RLS policies, crudPolicy) that don't exist in
 * vanilla Postgres.
 *
 * Skip locally with RUN_DB_TESTS=0.
 */
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import pg from 'pg';

const { Pool } = pg;

let container: StartedPostgreSqlContainer;
let pool: InstanceType<typeof Pool>;
let db: NodePgDatabase;

export function getDb(): NodePgDatabase {
  return db;
}

export function getPool(): InstanceType<typeof Pool> {
  return pool;
}

/**
 * Shared ERP entity columns used by all 9 finance tables.
 * Mirrors baseEntityColumns + erpEntityColumns from the Drizzle schema.
 */
const ERP_COLS = `
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL,
  company_id uuid NOT NULL,
  site_id uuid,
  custom_data jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by text NOT NULL DEFAULT 'test-user',
  updated_by text NOT NULL DEFAULT 'test-user',
  version integer NOT NULL DEFAULT 1,
  is_deleted boolean NOT NULL DEFAULT false
`;

const FINANCE_TABLES_DDL = `
  CREATE EXTENSION IF NOT EXISTS pgcrypto;

  -- Dependency tables (minimal stubs for FK-free seeding)
  CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id uuid NOT NULL,
    email text NOT NULL,
    display_name text,
    auth_provider text NOT NULL DEFAULT 'local',
    auth_provider_id text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS companies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id uuid NOT NULL,
    company_name text NOT NULL,
    company_code text NOT NULL,
    base_currency text NOT NULL DEFAULT 'MYR',
    fiscal_year_start integer NOT NULL DEFAULT 1,
    created_at timestamptz NOT NULL DEFAULT now()
  );

  -- 9 finance domain tables
  CREATE TABLE treasury_accounts (
    ${ERP_COLS},
    account_no text NOT NULL,
    bank_name text NOT NULL,
    account_type text NOT NULL,
    currency_code text NOT NULL,
    book_balance_minor bigint NOT NULL DEFAULT 0,
    as_of_date date NOT NULL,
    is_active boolean NOT NULL DEFAULT true
  );

  CREATE TABLE deferred_tax_items (
    ${ERP_COLS},
    period_key text NOT NULL CHECK (period_key ~ '^[0-9]{4}-[0-9]{2}$'),
    account_id text NOT NULL,
    asset_or_liability text NOT NULL,
    carrying_minor bigint NOT NULL DEFAULT 0,
    tax_base_minor bigint NOT NULL DEFAULT 0,
    temporary_diff_minor bigint NOT NULL DEFAULT 0,
    tax_rate_bps integer NOT NULL DEFAULT 0,
    dta_minor bigint NOT NULL DEFAULT 0,
    dtl_minor bigint NOT NULL DEFAULT 0,
    currency_code text NOT NULL
  );

  CREATE TABLE employee_benefit_plans (
    ${ERP_COLS},
    plan_name text NOT NULL,
    plan_type text NOT NULL,
    benefit_type text NOT NULL,
    measurement_date date NOT NULL,
    currency_code text NOT NULL,
    obligation_minor bigint NOT NULL DEFAULT 0,
    plan_asset_minor bigint NOT NULL DEFAULT 0,
    net_liability_minor bigint NOT NULL DEFAULT 0,
    discount_rate_bps integer NOT NULL DEFAULT 0,
    is_active boolean NOT NULL DEFAULT true
  );

  CREATE TABLE borrowing_cost_items (
    ${ERP_COLS},
    period_key text NOT NULL CHECK (period_key ~ '^[0-9]{4}-[0-9]{2}$'),
    qualifying_asset_id uuid NOT NULL,
    currency_code text NOT NULL,
    borrowing_minor bigint NOT NULL DEFAULT 0,
    capitalised_minor bigint NOT NULL DEFAULT 0,
    expensed_minor bigint NOT NULL DEFAULT 0,
    capitalisation_rate_bps integer NOT NULL DEFAULT 0,
    status text NOT NULL DEFAULT 'active'
  );

  CREATE TABLE biological_asset_items (
    ${ERP_COLS},
    asset_name text NOT NULL,
    asset_class text NOT NULL,
    measurement_date date NOT NULL,
    currency_code text NOT NULL,
    fair_value_minor bigint NOT NULL DEFAULT 0,
    cost_minor bigint NOT NULL DEFAULT 0,
    harvest_yield text,
    harvest_uom text
  );

  CREATE TABLE government_grant_items (
    ${ERP_COLS},
    grant_no text,
    grant_type text NOT NULL,
    period_key text NOT NULL CHECK (period_key ~ '^[0-9]{4}-[0-9]{2}$'),
    currency_code text NOT NULL,
    grant_amount_minor bigint NOT NULL DEFAULT 0,
    amortised_minor bigint NOT NULL DEFAULT 0,
    deferred_minor bigint NOT NULL DEFAULT 0,
    related_asset_id uuid,
    conditions text,
    is_active boolean NOT NULL DEFAULT true
  );

  CREATE TABLE impairment_tests (
    ${ERP_COLS},
    test_date date NOT NULL,
    asset_id uuid NOT NULL,
    cgu_id uuid,
    currency_code text NOT NULL,
    carrying_minor bigint NOT NULL DEFAULT 0,
    recoverable_minor bigint NOT NULL DEFAULT 0,
    impairment_minor bigint NOT NULL DEFAULT 0,
    recovery_method text NOT NULL,
    is_reversed boolean NOT NULL DEFAULT false
  );

  CREATE TABLE investment_properties (
    ${ERP_COLS},
    property_name text NOT NULL,
    category text NOT NULL,
    measurement_model text NOT NULL,
    measurement_date date NOT NULL,
    currency_code text NOT NULL,
    fair_value_minor bigint NOT NULL DEFAULT 0,
    cost_minor bigint NOT NULL DEFAULT 0,
    accumulated_depr_minor bigint NOT NULL DEFAULT 0,
    is_active boolean NOT NULL DEFAULT true
  );

  CREATE TABLE sbp_grants (
    ${ERP_COLS},
    grant_date date NOT NULL,
    vesting_period_months integer NOT NULL,
    currency_code text NOT NULL,
    exercise_price_minor bigint NOT NULL DEFAULT 0,
    fair_value_per_unit_minor bigint NOT NULL DEFAULT 0,
    units_granted integer NOT NULL DEFAULT 0,
    units_vested integer NOT NULL DEFAULT 0,
    units_cancelled integer NOT NULL DEFAULT 0,
    settlement_type text NOT NULL,
    status text NOT NULL DEFAULT 'active'
  );
`;

export async function setupTestDb(): Promise<void> {
  container = await new PostgreSqlContainer('postgres:16-alpine')
    .withDatabase('testdb')
    .withUsername('test')
    .withPassword('test')
    .start();

  pool = new Pool({ connectionString: container.getConnectionUri() });
  db = drizzle({ client: pool });

  await pool.query(FINANCE_TABLES_DDL);
}

export async function teardownTestDb(): Promise<void> {
  if (pool) await pool.end();
  if (container) await container.stop();
}

/**
 * Insert a test org + company for tenant-isolated queries.
 */
export async function seedTestTenant(
  orgId: string,
  companyId: string,
): Promise<void> {
  const p = getPool();

  // Insert org (users table has org_id)
  await p.query(
    `INSERT INTO users (id, org_id, email, display_name, auth_provider, auth_provider_id)
     VALUES ($1, $2, 'test@test.com', 'Test User', 'local', 'test-auth-id')
     ON CONFLICT DO NOTHING`,
    [crypto.randomUUID(), orgId],
  );

  // Insert company
  await p.query(
    `INSERT INTO companies (id, org_id, company_name, company_code, base_currency, fiscal_year_start)
     VALUES ($1, $2, 'Test Co', 'TC01', 'MYR', 1)
     ON CONFLICT DO NOTHING`,
    [companyId, orgId],
  );
}
