import { describe, it, expect } from 'vitest';
import {
  CanonEntityWriteAdapter,
  ENTITY_WRITABLE_CORE_FIELDS,
  getEntityWriteAdapter,
} from '../../adapters/entity-write-adapter.js';

/**
 * SNAP-04: Snapshot contains only writable fields.
 *
 * - toWriteShape picks ONLY canonized writable fields
 * - System columns (id, org_id, created_at, version, etc.) are excluded
 * - custom_data is extracted separately
 * - All keys in core ⊆ ENTITY_WRITABLE_CORE_FIELDS[entityType]
 */
describe('SNAP-04: Snapshot contains only writable fields', () => {
  it('should capture only writable core fields', () => {
    const rawRow = {
      id: 'uuid',
      org_id: 'test-org',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      status: 'active',
      notes: 'Some notes',
      tags: ['tag1'],
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 'system',
      updated_by: 'system',
      version: 1,
      is_deleted: false,
      deleted_at: null,
      deleted_by: null,
      custom_data: { field1: 'value1' },
    };

    const adapter = getEntityWriteAdapter('contacts');
    const { core, custom } = adapter.toWriteShape(rawRow);

    // Should include only writable fields
    expect(core).toHaveProperty('name');
    expect(core).toHaveProperty('email');
    expect(core).toHaveProperty('phone');
    expect(core).toHaveProperty('status');

    // Should NOT include system fields
    expect(core).not.toHaveProperty('id');
    expect(core).not.toHaveProperty('org_id');
    expect(core).not.toHaveProperty('created_at');
    expect(core).not.toHaveProperty('updated_at');
    expect(core).not.toHaveProperty('created_by');
    expect(core).not.toHaveProperty('updated_by');
    expect(core).not.toHaveProperty('version');
    expect(core).not.toHaveProperty('is_deleted');
    expect(core).not.toHaveProperty('deleted_at');
    expect(core).not.toHaveProperty('deleted_by');
    expect(core).not.toHaveProperty('custom_data');

    // Custom fields should be extracted
    expect(custom).toEqual({ field1: 'value1' });
  });

  it('should match canonized writable field list exactly', () => {
    const adapter = getEntityWriteAdapter('contacts');
    const rawRow = {
      name: 'Test',
      email: 'test@example.com',
      phone: '+1234567890',
      status: 'active',
      notes: 'Some notes',
      tags: ['tag1'],
      extra_field: 'should be ignored',
    };

    const { core } = adapter.toWriteShape(rawRow);

    const writableFields = ENTITY_WRITABLE_CORE_FIELDS['contacts']!;

    // All keys in core must be in ENTITY_WRITABLE_CORE_FIELDS
    for (const key of Object.keys(core)) {
      expect(writableFields).toContain(key);
    }

    // extra_field should NOT appear
    expect(core).not.toHaveProperty('extra_field');
  });

  it('should handle missing custom_data gracefully', () => {
    const adapter = getEntityWriteAdapter('contacts');
    const rawRow = { name: 'Test' };

    const { custom } = adapter.toWriteShape(rawRow);
    expect(custom).toEqual({});
  });

  it('should throw for unknown entity types', () => {
    expect(() => {
      getEntityWriteAdapter('unknown_entity_xyz');
    }).toThrow('No write adapter for entity type: unknown_entity_xyz');
  });

  it('should throw when writable fields not defined', () => {
    const adapter = new CanonEntityWriteAdapter('nonexistent_entity');
    expect(() => {
      adapter.toWriteShape({ name: 'test' });
    }).toThrow('No writable fields defined for entity type: nonexistent_entity');
  });

  it('should have writable fields defined for all registered adapters', () => {
    const entityTypes = Object.keys(ENTITY_WRITABLE_CORE_FIELDS);

    for (const entityType of entityTypes) {
      const fields = ENTITY_WRITABLE_CORE_FIELDS[entityType]!;
      expect(fields.length).toBeGreaterThan(0);

      const adapter = getEntityWriteAdapter(entityType);
      expect(adapter.entityType).toBe(entityType);
    }
  });
});
