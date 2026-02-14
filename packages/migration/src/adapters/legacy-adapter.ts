import type { QueryBuilder } from './query-builder.js';
import type { Cursor } from '../types/cursor.js';
import type { LegacyRecord, BatchResult, EntityType } from '../types/migration-job.js';
import type { LegacySchema } from '../types/query.js';

/**
 * Legacy system adapter — read-only interface for source systems.
 *
 * Concrete implementations connect to SQL databases, CSV files, or APIs.
 * All adapters are read-only by design (no writes to legacy systems).
 */
export interface LegacyAdapter {
  readonly systemName: string;
  readonly transport: 'sql' | 'csv' | 'api';

  extractBatch(entityType: EntityType, batchSize: number, cursor: Cursor): Promise<BatchResult>;
  getSchema(entityType: EntityType): Promise<LegacySchema>;
  healthCheck(): Promise<boolean>;
  close(): Promise<void>;
}

/**
 * Configuration for SQL legacy adapters.
 */
export interface SqlLegacyConfig {
  systemName: string;
  host: string;
  port?: number;
  database: string;
  readOnlyUser: string;
  password: string;
  ssl?: boolean;
  maxPoolSize?: number;
  idleTimeoutMs?: number;
  queryTimeoutMs?: number;
}

/**
 * Table allowlist — static mapping of entity types to legacy table names.
 * Prevents SQL injection by ensuring only known tables are queried.
 */
export type TableAllowlist = Record<EntityType, string>;

/**
 * SQL Legacy Adapter — connects to a legacy SQL database (Postgres, MySQL, etc.)
 * using a read-only connection pool with query timeouts and table allowlisting.
 */
export class SqlLegacyAdapter implements LegacyAdapter {
  readonly systemName: string;
  readonly transport = 'sql' as const;

  private readonly config: SqlLegacyConfig;
  private readonly queryBuilder: QueryBuilder;
  private readonly tableAllowlist: TableAllowlist;
  private pool: LegacyPool | null = null;

  constructor(
    config: SqlLegacyConfig,
    queryBuilder: QueryBuilder,
    tableAllowlist: TableAllowlist
  ) {
    this.systemName = config.systemName;
    this.config = config;
    this.queryBuilder = queryBuilder;
    this.tableAllowlist = tableAllowlist;
  }

  async extractBatch(
    entityType: EntityType,
    batchSize: number,
    cursor: Cursor
  ): Promise<BatchResult> {
    const pool = await this.getPool();
    this.resolveTable(entityType); // validate entity is in allowlist

    // Set legacy schema so QueryBuilder can validate fields
    const schema = await this.getSchema(entityType);
    this.queryBuilder.setLegacySchema(entityType, schema);

    const query = this.queryBuilder.buildBatchQuery(entityType, batchSize, cursor);

    const result = await pool.query(query.text, query.values);
    const records: LegacyRecord[] = result.rows.map((row: Record<string, unknown>) => ({
      legacyId: String((row['id'] ?? row['ID'] ?? row['Id'] ?? '') as string),
      data: row,
    }));

    const nextCursor = this.queryBuilder.extractCursor(result.rows, batchSize, cursor);

    return { records, nextCursor };
  }

  async getSchema(entityType: EntityType): Promise<LegacySchema> {
    const pool = await this.getPool();
    const tableName = this.resolveTable(entityType);

    // Introspect column names and types from information_schema
    const result = await pool.query(
      `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1 ORDER BY ordinal_position`,
      [tableName]
    );

    return {
      tableName,
      columns: result.rows.map((row: Record<string, unknown>) => ({
        name: String(row['column_name']),
        type: String(row['data_type']),
      })),
    };
  }

  async healthCheck(): Promise<boolean> {
    try {
      const pool = await this.getPool();
      await pool.query('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }

  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
  }

  private resolveTable(entityType: EntityType): string {
    const table = this.tableAllowlist[entityType];
    if (!table) {
      throw new Error(
        `Entity type '${entityType}' not in table allowlist. ` +
        `Allowed: ${Object.keys(this.tableAllowlist).join(', ')}`
      );
    }
    return table;
  }

  private async getPool(): Promise<LegacyPool> {
    this.pool ??= await createLegacyPool(this.config);
    return this.pool;
  }
}

/**
 * Minimal pool interface — abstracts pg.Pool / mysql2.Pool.
 * Consumers provide a concrete implementation via createLegacyPool.
 */
export interface LegacyPool {
  query(text: string, values?: unknown[]): Promise<{ rows: Record<string, unknown>[] }>;
  end(): Promise<void>;
}

/**
 * Pool factory — must be set before using SqlLegacyAdapter.
 * This allows the migration package to stay free of direct pg/mysql2 deps.
 */
let poolFactory: ((config: SqlLegacyConfig) => Promise<LegacyPool>) | null = null;

export function setLegacyPoolFactory(
  factory: (config: SqlLegacyConfig) => Promise<LegacyPool>
): void {
  poolFactory = factory;
}

async function createLegacyPool(config: SqlLegacyConfig): Promise<LegacyPool> {
  if (!poolFactory) {
    throw new Error(
      'Legacy pool factory not set. Call setLegacyPoolFactory() before using SqlLegacyAdapter.'
    );
  }
  return poolFactory(config);
}
