import { describe, it, expect } from 'vitest';
import { JobCardScrapItemSchema, JobCardScrapItemInsertSchema } from '../types/job-card-scrap-item.js';

describe('JobCardScrapItem Zod validation', () => {
  const validSample = {
      "id": "TEST-JobCardScrapItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_code": "LINK-item_code-001",
      "item_name": "Sample Scrap Item Name",
      "description": "Sample text for description",
      "stock_qty": 1,
      "stock_uom": "LINK-stock_uom-001"
  };

  it('validates a correct Job Card Scrap Item object', () => {
    const result = JobCardScrapItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = JobCardScrapItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "item_code" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).item_code;
    const result = JobCardScrapItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = JobCardScrapItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
