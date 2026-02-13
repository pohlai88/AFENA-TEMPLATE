import type { LegacyRecord, BatchResult, EntityType } from '../types/migration-job.js';
import type { Cursor } from '../types/cursor.js';
import type { LegacySchema } from '../types/query.js';
import type { LegacyAdapter } from './legacy-adapter.js';

/**
 * CSV Legacy Adapter — reads flat file imports.
 *
 * Accepts pre-parsed rows (Record<string, unknown>[]) rather than
 * doing file I/O directly. The caller is responsible for parsing
 * the CSV file (e.g., via papaparse) and passing the rows in.
 *
 * This keeps the migration package free of CSV parsing deps.
 */
export interface CsvAdapterConfig {
  systemName: string;
  entityType: EntityType;
  rows: Record<string, unknown>[];
  idColumn: string;
}

export class CsvLegacyAdapter implements LegacyAdapter {
  readonly systemName: string;
  readonly transport = 'csv' as const;

  private readonly entityType: EntityType;
  private readonly rows: Record<string, unknown>[];
  private readonly idColumn: string;

  constructor(config: CsvAdapterConfig) {
    this.systemName = config.systemName;
    this.entityType = config.entityType;
    this.rows = config.rows;
    this.idColumn = config.idColumn;
  }

  async extractBatch(
    entityType: EntityType,
    batchSize: number,
    cursor: Cursor
  ): Promise<BatchResult> {
    if (entityType !== this.entityType) {
      throw new Error(
        `CsvLegacyAdapter configured for '${this.entityType}', got '${entityType}'`
      );
    }

    const offset = cursor?.type === 'offset' ? cursor.offset : 0;
    const slice = this.rows.slice(offset, offset + batchSize);

    const records: LegacyRecord[] = slice.map((row) => ({
      legacyId: String(row[this.idColumn] ?? ''),
      data: row,
    }));

    const nextCursor: Cursor =
      slice.length < batchSize
        ? null
        : { type: 'offset', offset: offset + batchSize };

    return { records, nextCursor };
  }

  async getSchema(_entityType: EntityType): Promise<LegacySchema> {
    if (this.rows.length === 0) {
      return { tableName: 'csv_import', columns: [] };
    }

    const firstRow = this.rows[0]!;
    return {
      tableName: 'csv_import',
      columns: Object.keys(firstRow).map((name) => ({
        name,
        type: 'text',
      })),
    };
  }

  async healthCheck(): Promise<boolean> {
    return this.rows.length > 0;
  }

  async close(): Promise<void> {
    // No-op for CSV adapter
  }
}
