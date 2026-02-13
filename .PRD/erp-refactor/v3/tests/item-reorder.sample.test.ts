import { describe, it, expect } from 'vitest';
import { ItemReorderSchema, ItemReorderInsertSchema } from '../types/item-reorder.js';

describe('ItemReorder Zod validation', () => {
  const validSample = {
      "id": "TEST-ItemReorder-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "warehouse": "LINK-warehouse-001",
      "warehouse_group": "LINK-warehouse_group-001",
      "warehouse_reorder_level": 1,
      "warehouse_reorder_qty": 1,
      "material_request_type": "Purchase"
  };

  it('validates a correct Item Reorder object', () => {
    const result = ItemReorderSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ItemReorderInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "warehouse" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).warehouse;
    const result = ItemReorderSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ItemReorderSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
