import { describe, it, expect } from 'vitest';
import { JobCardItemSchema, JobCardItemInsertSchema } from '../types/job-card-item.js';

describe('JobCardItem Zod validation', () => {
  const validSample = {
      "id": "TEST-JobCardItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_code": "LINK-item_code-001",
      "source_warehouse": "LINK-source_warehouse-001",
      "uom": "LINK-uom-001",
      "item_group": "LINK-item_group-001",
      "stock_uom": "LINK-stock_uom-001",
      "item_name": "Sample Item Name",
      "description": "Sample text for description",
      "required_qty": 1,
      "transferred_qty": 1,
      "consumed_qty": 1,
      "allow_alternative_item": "0"
  };

  it('validates a correct Job Card Item object', () => {
    const result = JobCardItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = JobCardItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = JobCardItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
