import { describe, it, expect } from 'vitest';
import { SalesPartnerTypeSchema, SalesPartnerTypeInsertSchema } from '../types/sales-partner-type.js';

describe('SalesPartnerType Zod validation', () => {
  const validSample = {
      "id": "TEST-SalesPartnerType-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "sales_partner_type": "Sample Sales Partner Type"
  };

  it('validates a correct Sales Partner Type object', () => {
    const result = SalesPartnerTypeSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SalesPartnerTypeInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "sales_partner_type" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).sales_partner_type;
    const result = SalesPartnerTypeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SalesPartnerTypeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
