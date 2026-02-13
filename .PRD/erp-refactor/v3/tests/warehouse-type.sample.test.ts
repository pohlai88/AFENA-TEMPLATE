import { describe, it, expect } from 'vitest';
import { WarehouseTypeSchema, WarehouseTypeInsertSchema } from '../types/warehouse-type.js';

describe('WarehouseType Zod validation', () => {
  const validSample = {
      "id": "TEST-WarehouseType-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "description": "Sample text for description"
  };

  it('validates a correct Warehouse Type object', () => {
    const result = WarehouseTypeSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = WarehouseTypeInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = WarehouseTypeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
