import { describe, it, expect } from 'vitest';
import { PutawayRuleSchema, PutawayRuleInsertSchema } from '../types/putaway-rule.js';

describe('PutawayRule Zod validation', () => {
  const validSample = {
      "id": "TEST-PutawayRule-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "disable": "0",
      "item_code": "LINK-item_code-001",
      "item_name": "Sample Item Name",
      "warehouse": "LINK-warehouse-001",
      "priority": "1",
      "company": "LINK-company-001",
      "capacity": "0",
      "uom": "LINK-uom-001",
      "conversion_factor": "1",
      "stock_uom": "LINK-stock_uom-001",
      "stock_capacity": 1
  };

  it('validates a correct Putaway Rule object', () => {
    const result = PutawayRuleSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PutawayRuleInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "item_code" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).item_code;
    const result = PutawayRuleSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PutawayRuleSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
