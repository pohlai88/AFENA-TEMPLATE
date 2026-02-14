import { describe, it, expect } from 'vitest';
import { PurchaseTaxesAndChargesTemplateSchema, PurchaseTaxesAndChargesTemplateInsertSchema } from '../types/purchase-taxes-and-charges-template.js';

describe('PurchaseTaxesAndChargesTemplate Zod validation', () => {
  const validSample = {
      "id": "TEST-PurchaseTaxesAndChargesTemplate-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "title": "Sample Title",
      "is_default": "0",
      "disabled": "0",
      "company": "LINK-company-001",
      "tax_category": "LINK-tax_category-001"
  };

  it('validates a correct Purchase Taxes and Charges Template object', () => {
    const result = PurchaseTaxesAndChargesTemplateSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PurchaseTaxesAndChargesTemplateInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "title" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).title;
    const result = PurchaseTaxesAndChargesTemplateSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PurchaseTaxesAndChargesTemplateSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
