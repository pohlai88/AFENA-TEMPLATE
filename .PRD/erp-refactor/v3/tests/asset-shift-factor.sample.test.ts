import { describe, it, expect } from 'vitest';
import { AssetShiftFactorSchema, AssetShiftFactorInsertSchema } from '../types/asset-shift-factor.js';

describe('AssetShiftFactor Zod validation', () => {
  const validSample = {
      "id": "TEST-AssetShiftFactor-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "shift_name": "Sample Shift Name",
      "shift_factor": 1,
      "default": "0"
  };

  it('validates a correct Asset Shift Factor object', () => {
    const result = AssetShiftFactorSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = AssetShiftFactorInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "shift_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).shift_name;
    const result = AssetShiftFactorSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = AssetShiftFactorSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
