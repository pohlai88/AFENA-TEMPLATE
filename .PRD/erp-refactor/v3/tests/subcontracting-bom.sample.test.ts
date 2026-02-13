import { describe, it, expect } from 'vitest';
import { SubcontractingBomSchema, SubcontractingBomInsertSchema } from '../types/subcontracting-bom.js';

describe('SubcontractingBom Zod validation', () => {
  const validSample = {
      "id": "TEST-SubcontractingBom-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "is_active": "1",
      "finished_good": "LINK-finished_good-001",
      "finished_good_qty": "1",
      "finished_good_uom": "LINK-finished_good_uom-001",
      "finished_good_bom": "LINK-finished_good_bom-001",
      "service_item": "LINK-service_item-001",
      "service_item_qty": "1",
      "service_item_uom": "LINK-service_item_uom-001",
      "conversion_factor": 1
  };

  it('validates a correct Subcontracting BOM object', () => {
    const result = SubcontractingBomSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SubcontractingBomInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "finished_good" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).finished_good;
    const result = SubcontractingBomSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SubcontractingBomSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
