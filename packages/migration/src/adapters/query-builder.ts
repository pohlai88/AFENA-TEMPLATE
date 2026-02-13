import type { Cursor } from '../types/cursor.js';
import type { EntityType } from '../types/migration-job.js';
import type { Query, LegacyFilter, LegacySchema } from '../types/query.js';

/**
 * Fix 2: Structural identifiers in QueryBuilder.
 *
 * - Accepts EntityType (not raw table string)
 * - Validates filter fields against introspected legacy schema
 * - quoteIdentifier() is private per dialect
 *
 * Nit A: extractCursor takes prevCursor for offset-based dialects.
 */
export interface QueryBuilder {
  setLegacySchema(entityType: EntityType, schema: LegacySchema): void;
  buildBatchQuery(entityType: EntityType, batchSize: number, cursor: Cursor): Query;
  buildCountQuery(entityType: EntityType): Query;
  buildSelectQuery(entityType: EntityType, filters: LegacyFilter[]): Query;
  extractCursor(rows: unknown[], batchSize: number, prevCursor: Cursor): Cursor;
  getCursorType(): 'offset' | 'id' | 'composite' | 'token';
}

// ── Postgres ────────────────────────────────────────────────

export class PostgresQueryBuilder implements QueryBuilder {
  private legacySchemas = new Map<EntityType, LegacySchema>();

  setLegacySchema(entityType: EntityType, schema: LegacySchema): void {
    this.legacySchemas.set(entityType, schema);
  }

  getCursorType(): 'composite' {
    return 'composite';
  }

  buildBatchQuery(entityType: EntityType, batchSize: number, cursor: Cursor): Query {
    const table = this.resolveTable(entityType);

    if (!cursor) {
      return {
        text: `SELECT * FROM ${table} ORDER BY updated_at, id LIMIT $1`,
        values: [batchSize],
      };
    }

    if (cursor.type === 'composite') {
      return {
        text: `SELECT * FROM ${table} WHERE (updated_at, id) > ($1, $2) ORDER BY updated_at, id LIMIT $3`,
        values: [cursor.lastUpdatedAt, cursor.lastId, batchSize],
      };
    }

    throw new Error(`PostgresQueryBuilder: unsupported cursor type '${cursor.type}'`);
  }

  buildCountQuery(entityType: EntityType): Query {
    const table = this.resolveTable(entityType);
    return { text: `SELECT COUNT(*) FROM ${table}`, values: [] };
  }

  buildSelectQuery(entityType: EntityType, filters: LegacyFilter[]): Query {
    const table = this.resolveTable(entityType);
    this.validateFilterFields(entityType, filters);

    const conditions: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    for (const f of filters) {
      const col = this.quoteIdentifier(f.field);
      if (f.operator === 'IN' && Array.isArray(f.value)) {
        const placeholders = (f.value as unknown[]).map(() => `$${idx++}`).join(', ');
        conditions.push(`${col} IN (${placeholders})`);
        values.push(...(f.value as unknown[]));
      } else {
        conditions.push(`${col} ${f.operator} $${idx++}`);
        values.push(f.value);
      }
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    return { text: `SELECT * FROM ${table} ${where}`, values };
  }

  extractCursor(rows: unknown[], batchSize: number, _prevCursor: Cursor): Cursor {
    if (rows.length < batchSize) return null;
    const last = rows[rows.length - 1] as Record<string, unknown>;
    return {
      type: 'composite',
      lastUpdatedAt: String(last['updated_at']),
      lastId: String(last['id']),
    };
  }

  // ── private ─────────────────────────────────────────────

  private resolveTable(entityType: EntityType): string {
    const schema = this.legacySchemas.get(entityType);
    if (!schema) {
      throw new Error(`Legacy schema not set for entity type: ${entityType}`);
    }
    return this.quoteIdentifier(schema.tableName);
  }

  private validateFilterFields(entityType: EntityType, filters: LegacyFilter[]): void {
    const schema = this.legacySchemas.get(entityType);
    if (!schema) {
      throw new Error(`Legacy schema not set for entity type: ${entityType}`);
    }
    const allowed = new Set(schema.columns.map((c) => c.name));
    for (const f of filters) {
      if (!allowed.has(f.field)) {
        throw new Error(
          `Field '${f.field}' not in legacy schema for entity '${entityType}'. ` +
          `Valid fields: ${Array.from(allowed).join(', ')}`
        );
      }
    }
  }

  private quoteIdentifier(id: string): string {
    return `"${id.replace(/"/g, '""')}"`;
  }
}

// ── MySQL ───────────────────────────────────────────────────

export class MySqlQueryBuilder implements QueryBuilder {
  private legacySchemas = new Map<EntityType, LegacySchema>();

  setLegacySchema(entityType: EntityType, schema: LegacySchema): void {
    this.legacySchemas.set(entityType, schema);
  }

  getCursorType(): 'composite' {
    return 'composite';
  }

  buildBatchQuery(entityType: EntityType, batchSize: number, cursor: Cursor): Query {
    const table = this.resolveTable(entityType);

    if (!cursor) {
      return { text: `SELECT * FROM ${table} ORDER BY updated_at, id LIMIT ?`, values: [batchSize] };
    }

    if (cursor.type === 'composite') {
      return {
        text: `SELECT * FROM ${table} WHERE (updated_at > ? OR (updated_at = ? AND id > ?)) ORDER BY updated_at, id LIMIT ?`,
        values: [cursor.lastUpdatedAt, cursor.lastUpdatedAt, cursor.lastId, batchSize],
      };
    }

    throw new Error(`MySqlQueryBuilder: unsupported cursor type '${cursor.type}'`);
  }

  buildCountQuery(entityType: EntityType): Query {
    const table = this.resolveTable(entityType);
    return { text: `SELECT COUNT(*) FROM ${table}`, values: [] };
  }

  buildSelectQuery(entityType: EntityType, filters: LegacyFilter[]): Query {
    const table = this.resolveTable(entityType);
    this.validateFilterFields(entityType, filters);

    const conditions: string[] = [];
    const values: unknown[] = [];

    for (const f of filters) {
      const col = this.quoteIdentifier(f.field);
      if (f.operator === 'IN' && Array.isArray(f.value)) {
        const placeholders = (f.value as unknown[]).map(() => '?').join(', ');
        conditions.push(`${col} IN (${placeholders})`);
        values.push(...(f.value as unknown[]));
      } else {
        conditions.push(`${col} ${f.operator} ?`);
        values.push(f.value);
      }
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    return { text: `SELECT * FROM ${table} ${where}`, values };
  }

  extractCursor(rows: unknown[], batchSize: number, _prevCursor: Cursor): Cursor {
    if (rows.length < batchSize) return null;
    const last = rows[rows.length - 1] as Record<string, unknown>;
    return {
      type: 'composite',
      lastUpdatedAt: String(last['updated_at']),
      lastId: String(last['id']),
    };
  }

  private resolveTable(entityType: EntityType): string {
    const schema = this.legacySchemas.get(entityType);
    if (!schema) throw new Error(`Legacy schema not set for entity type: ${entityType}`);
    return this.quoteIdentifier(schema.tableName);
  }

  private validateFilterFields(entityType: EntityType, filters: LegacyFilter[]): void {
    const schema = this.legacySchemas.get(entityType);
    if (!schema) throw new Error(`Legacy schema not set for entity type: ${entityType}`);
    const allowed = new Set(schema.columns.map((c) => c.name));
    for (const f of filters) {
      if (!allowed.has(f.field)) {
        throw new Error(
          `Field '${f.field}' not in legacy schema for entity '${entityType}'. ` +
          `Valid fields: ${Array.from(allowed).join(', ')}`
        );
      }
    }
  }

  private quoteIdentifier(id: string): string {
    return `\`${id.replace(/`/g, '``')}\``;
  }
}

// ── CSV (offset-based) ──────────────────────────────────────

export class CsvQueryBuilder implements QueryBuilder {
  private legacySchemas = new Map<EntityType, LegacySchema>();

  setLegacySchema(entityType: EntityType, schema: LegacySchema): void {
    this.legacySchemas.set(entityType, schema);
  }

  getCursorType(): 'offset' {
    return 'offset';
  }

  buildBatchQuery(_entityType: EntityType, batchSize: number, cursor: Cursor): Query {
    const offset = cursor?.type === 'offset' ? cursor.offset : 0;
    return { text: '', values: [batchSize, offset] };
  }

  buildCountQuery(_entityType: EntityType): Query {
    return { text: '', values: [] };
  }

  buildSelectQuery(_entityType: EntityType, _filters: LegacyFilter[]): Query {
    throw new Error('CsvQueryBuilder does not support SELECT queries');
  }

  // Nit A: prevCursor is required for offset calculation
  extractCursor(rows: unknown[], batchSize: number, prevCursor: Cursor): Cursor {
    if (rows.length < batchSize) return null;
    const currentOffset = prevCursor?.type === 'offset' ? prevCursor.offset : 0;
    return { type: 'offset', offset: currentOffset + batchSize };
  }
}
