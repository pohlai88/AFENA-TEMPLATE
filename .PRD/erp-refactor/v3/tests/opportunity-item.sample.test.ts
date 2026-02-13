import { describe, it, expect } from 'vitest';
import { OpportunityItemSchema, OpportunityItemInsertSchema } from '../types/opportunity-item.js';

describe('OpportunityItem Zod validation', () => {
  const validSample = {
      "id": "TEST-OpportunityItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_code": "LINK-item_code-001",
      "item_name": "Sample Item Name",
      "uom": "LINK-uom-001",
      "qty": "1",
      "brand": "LINK-brand-001",
      "item_group": "LINK-item_group-001",
      "description": "Sample text for description",
      "image": "/files/sample.png",
      "image_view": "/files/sample.png",
      "base_rate": 100,
      "base_amount": 100,
      "rate": 100,
      "amount": 100
  };

  it('validates a correct Opportunity Item object', () => {
    const result = OpportunityItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = OpportunityItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "base_rate" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).base_rate;
    const result = OpportunityItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = OpportunityItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
