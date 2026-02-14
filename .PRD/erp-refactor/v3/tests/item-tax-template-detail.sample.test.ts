import { describe, it, expect } from 'vitest';
import { ItemTaxTemplateDetailSchema, ItemTaxTemplateDetailInsertSchema } from '../types/item-tax-template-detail.js';

describe('ItemTaxTemplateDetail Zod validation', () => {
  const validSample = {
      "id": "TEST-ItemTaxTemplateDetail-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "tax_type": "LINK-tax_type-001",
      "tax_rate": 1
  };

  it('validates a correct Item Tax Template Detail object', () => {
    const result = ItemTaxTemplateDetailSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ItemTaxTemplateDetailInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "tax_type" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).tax_type;
    const result = ItemTaxTemplateDetailSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ItemTaxTemplateDetailSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
