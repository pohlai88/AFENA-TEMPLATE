import { describe, it, expect } from 'vitest';
import { SalesPartnerItemSchema, SalesPartnerItemInsertSchema } from '../types/sales-partner-item.js';

describe('SalesPartnerItem Zod validation', () => {
  const validSample = {
      "id": "TEST-SalesPartnerItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "sales_partner": "LINK-sales_partner-001"
  };

  it('validates a correct Sales Partner Item object', () => {
    const result = SalesPartnerItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SalesPartnerItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SalesPartnerItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
