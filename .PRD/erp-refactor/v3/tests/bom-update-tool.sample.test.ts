import { describe, it, expect } from 'vitest';
import { BomUpdateToolSchema, BomUpdateToolInsertSchema } from '../types/bom-update-tool.js';

describe('BomUpdateTool Zod validation', () => {
  const validSample = {
      "id": "TEST-BomUpdateTool-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "current_bom": "LINK-current_bom-001",
      "new_bom": "LINK-new_bom-001"
  };

  it('validates a correct BOM Update Tool object', () => {
    const result = BomUpdateToolSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = BomUpdateToolInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "current_bom" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).current_bom;
    const result = BomUpdateToolSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = BomUpdateToolSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
