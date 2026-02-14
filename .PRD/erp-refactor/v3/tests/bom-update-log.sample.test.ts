import { describe, it, expect } from 'vitest';
import { BomUpdateLogSchema, BomUpdateLogInsertSchema } from '../types/bom-update-log.js';

describe('BomUpdateLog Zod validation', () => {
  const validSample = {
      "id": "TEST-BomUpdateLog-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "update_type": "Replace BOM",
      "status": "Queued",
      "current_bom": "LINK-current_bom-001",
      "new_bom": "LINK-new_bom-001",
      "error_log": "LINK-error_log-001",
      "current_level": 1,
      "processed_boms": "Sample text for processed_boms",
      "amended_from": "LINK-amended_from-001"
  };

  it('validates a correct BOM Update Log object', () => {
    const result = BomUpdateLogSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = BomUpdateLogInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = BomUpdateLogSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
