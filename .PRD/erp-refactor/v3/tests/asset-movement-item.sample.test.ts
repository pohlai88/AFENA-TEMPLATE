import { describe, it, expect } from 'vitest';
import { AssetMovementItemSchema, AssetMovementItemInsertSchema } from '../types/asset-movement-item.js';

describe('AssetMovementItem Zod validation', () => {
  const validSample = {
      "id": "TEST-AssetMovementItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "company": "LINK-company-001",
      "asset": "LINK-asset-001",
      "source_location": "LINK-source_location-001",
      "from_employee": "LINK-from_employee-001",
      "asset_name": "Sample Asset Name",
      "target_location": "LINK-target_location-001",
      "to_employee": "LINK-to_employee-001"
  };

  it('validates a correct Asset Movement Item object', () => {
    const result = AssetMovementItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = AssetMovementItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "asset" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).asset;
    const result = AssetMovementItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = AssetMovementItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
