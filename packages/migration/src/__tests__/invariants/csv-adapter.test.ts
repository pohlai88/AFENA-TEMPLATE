import { describe, it, expect } from 'vitest';
import { CsvLegacyAdapter } from '../../adapters/csv-adapter.js';

describe('CSV Legacy Adapter', () => {
  const rows = [
    { id: '1', name: 'Alice', email: 'alice@example.com' },
    { id: '2', name: 'Bob', email: 'bob@example.com' },
    { id: '3', name: 'Charlie', email: 'charlie@example.com' },
    { id: '4', name: 'Diana', email: 'diana@example.com' },
    { id: '5', name: 'Eve', email: 'eve@example.com' },
  ];

  function createAdapter() {
    return new CsvLegacyAdapter({
      systemName: 'test_csv',
      entityType: 'contacts',
      rows,
      idColumn: 'id',
    });
  }

  it('should extract first batch with offset cursor', async () => {
    const adapter = createAdapter();
    const batch = await adapter.extractBatch('contacts', 2, null);

    expect(batch.records).toHaveLength(2);
    expect(batch.records[0]!.legacyId).toBe('1');
    expect(batch.records[1]!.legacyId).toBe('2');
    expect(batch.nextCursor).toEqual({ type: 'offset', offset: 2 });
  });

  it('should extract subsequent batch using cursor', async () => {
    const adapter = createAdapter();
    const batch = await adapter.extractBatch('contacts', 2, { type: 'offset', offset: 2 });

    expect(batch.records).toHaveLength(2);
    expect(batch.records[0]!.legacyId).toBe('3');
    expect(batch.records[1]!.legacyId).toBe('4');
    expect(batch.nextCursor).toEqual({ type: 'offset', offset: 4 });
  });

  it('should return null cursor on last batch', async () => {
    const adapter = createAdapter();
    const batch = await adapter.extractBatch('contacts', 2, { type: 'offset', offset: 4 });

    expect(batch.records).toHaveLength(1);
    expect(batch.records[0]!.legacyId).toBe('5');
    expect(batch.nextCursor).toBeNull();
  });

  it('should return empty batch when offset exceeds rows', async () => {
    const adapter = createAdapter();
    const batch = await adapter.extractBatch('contacts', 2, { type: 'offset', offset: 10 });

    expect(batch.records).toHaveLength(0);
    expect(batch.nextCursor).toBeNull();
  });

  it('should throw for wrong entity type', async () => {
    const adapter = createAdapter();
    await expect(
      adapter.extractBatch('invoices', 2, null)
    ).rejects.toThrow("CsvLegacyAdapter configured for 'contacts', got 'invoices'");
  });

  it('should introspect schema from first row', async () => {
    const adapter = createAdapter();
    const schema = await adapter.getSchema('contacts');

    expect(schema.tableName).toBe('csv_import');
    expect(schema.columns).toHaveLength(3);
    expect(schema.columns.map((c) => c.name)).toEqual(['id', 'name', 'email']);
  });

  it('should return empty schema for empty rows', async () => {
    const adapter = new CsvLegacyAdapter({
      systemName: 'empty',
      entityType: 'contacts',
      rows: [],
      idColumn: 'id',
    });
    const schema = await adapter.getSchema('contacts');
    expect(schema.columns).toHaveLength(0);
  });

  it('should report healthy when rows exist', async () => {
    const adapter = createAdapter();
    expect(await adapter.healthCheck()).toBe(true);
  });

  it('should report unhealthy when no rows', async () => {
    const adapter = new CsvLegacyAdapter({
      systemName: 'empty',
      entityType: 'contacts',
      rows: [],
      idColumn: 'id',
    });
    expect(await adapter.healthCheck()).toBe(false);
  });
});
