import Papa from 'papaparse';
import { createReadStream } from 'node:fs';

import type { LegacyRecord, BatchResult, EntityType } from '../types/migration-job.js';
import type { Cursor } from '../types/cursor.js';
import type { LegacySchema } from '../types/query.js';
import type { LegacyAdapter } from './legacy-adapter.js';

/**
 * SPD-06: Streaming CSV adapter — reads large CSV files without loading
 * the entire file into memory. Uses papaparse streaming under the hood.
 */
export interface StreamingCsvConfig {
  systemName: string;
  entityType: EntityType;
  filePath: string;
  idColumn: string;
  delimiter?: string;
  encoding?: BufferEncoding;
}

export class StreamingCsvAdapter implements LegacyAdapter {
  readonly systemName: string;
  readonly transport = 'csv' as const;

  private readonly entityType: EntityType;
  private readonly filePath: string;
  private readonly idColumn: string;
  private readonly delimiter: string;
  private readonly encoding: BufferEncoding;

  private cachedSchema: LegacySchema | null = null;

  constructor(config: StreamingCsvConfig) {
    this.systemName = config.systemName;
    this.entityType = config.entityType;
    this.filePath = config.filePath;
    this.idColumn = config.idColumn;
    this.delimiter = config.delimiter ?? ',';
    this.encoding = config.encoding ?? 'utf-8';
  }

  async extractBatch(
    entityType: EntityType,
    batchSize: number,
    cursor: Cursor,
  ): Promise<BatchResult> {
    if (entityType !== this.entityType) {
      throw new Error(
        `StreamingCsvAdapter configured for '${this.entityType}', got '${entityType}'`,
      );
    }

    const offset = cursor?.type === 'offset' ? cursor.offset : 0;
    const records: LegacyRecord[] = [];
    let rowIndex = 0;

    return new Promise<BatchResult>((resolve, reject) => {
      const stream = createReadStream(this.filePath, { encoding: this.encoding });

      Papa.parse(stream, {
        header: true,
        delimiter: this.delimiter,
        skipEmptyLines: true,
        step: (result: Papa.ParseStepResult<Record<string, unknown>>, parser) => {
          if (rowIndex < offset) {
            rowIndex++;
            return;
          }

          if (records.length >= batchSize) {
            parser.abort();
            return;
          }

          const row = result.data;
          records.push({
            legacyId: String(row[this.idColumn] ?? ''),
            data: row,
          });
          rowIndex++;
        },
        complete: () => {
          const nextCursor: Cursor =
            records.length < batchSize
              ? null
              : { type: 'offset', offset: offset + batchSize };

          resolve({ records, nextCursor });
        },
        error: (err: Error) => {
          reject(err);
        },
      });
    });
  }

  async getSchema(_entityType: EntityType): Promise<LegacySchema> {
    if (this.cachedSchema) return this.cachedSchema;

    // Read just the first row to infer schema
    const batch = await this.extractBatch(this.entityType, 1, null);
    const firstRow = batch.records[0];

    if (!firstRow) {
      this.cachedSchema = { tableName: 'csv_import', columns: [] };
      return this.cachedSchema;
    }

    this.cachedSchema = {
      tableName: 'csv_import',
      columns: Object.keys(firstRow.data).map((name) => ({
        name,
        type: 'text',
      })),
    };
    return this.cachedSchema;
  }

  async healthCheck(): Promise<boolean> {
    try {
      const batch = await this.extractBatch(this.entityType, 1, null);
      return batch.records.length > 0;
    } catch {
      return false;
    }
  }

  async close(): Promise<void> {
    // No-op — streams are opened/closed per extractBatch call
  }
}
