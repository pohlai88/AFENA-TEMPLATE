import { describe, it, expect } from 'vitest';
import { PostgresQueryBuilder } from '../../adapters/query-builder.js';

/**
 * SQL-02: QueryBuilder rejects unknown legacy columns.
 *
 * - buildSelectQuery validates filter fields against introspected legacy schema
 * - buildBatchQuery requires schema to be set first
 * - quoteIdentifier is dialect-private (no raw interpolation)
 */
describe('SQL-02: QueryBuilder rejects unknown legacy columns', () => {
  it('should reject filters with unknown fields', () => {
    const builder = new PostgresQueryBuilder();

    builder.setLegacySchema('contacts', {
      tableName: 'customers',
      columns: [
        { name: 'id', type: 'varchar' },
        { name: 'email', type: 'varchar' },
        { name: 'phone', type: 'varchar' },
      ],
    });

    // Valid filter should work
    const validQuery = builder.buildSelectQuery('contacts', [
      { field: 'email', operator: '=', value: 'test@example.com' },
    ]);
    expect(validQuery.text).toContain('"email"');
    expect(validQuery.values).toEqual(['test@example.com']);

    // Invalid filter should throw
    expect(() => {
      builder.buildSelectQuery('contacts', [
        { field: 'unknown_field', operator: '=', value: 'test' },
      ]);
    }).toThrow("Field 'unknown_field' not in legacy schema");
  });

  it('should require schema to be set before queries', () => {
    const builder = new PostgresQueryBuilder();

    expect(() => {
      builder.buildBatchQuery('contacts', 100, null);
    }).toThrow('Legacy schema not set for entity type: contacts');
  });

  it('should quote identifiers to prevent injection', () => {
    const builder = new PostgresQueryBuilder();

    builder.setLegacySchema('contacts', {
      tableName: 'cust"omers',
      columns: [{ name: 'na"me', type: 'varchar' }],
    });

    const query = builder.buildSelectQuery('contacts', [
      { field: 'na"me', operator: '=', value: 'test' },
    ]);

    // Double-quotes should be escaped
    expect(query.text).toContain('"cust""omers"');
    expect(query.text).toContain('"na""me"');
  });

  it('should produce parameterized queries for IN operator', () => {
    const builder = new PostgresQueryBuilder();

    builder.setLegacySchema('contacts', {
      tableName: 'customers',
      columns: [{ name: 'email', type: 'varchar' }],
    });

    const query = builder.buildSelectQuery('contacts', [
      { field: 'email', operator: 'IN', value: ['a@b.com', 'c@d.com'] },
    ]);

    expect(query.text).toContain('$1');
    expect(query.text).toContain('$2');
    expect(query.values).toEqual(['a@b.com', 'c@d.com']);
  });
});
