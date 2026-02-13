import { describe, it, expect } from 'vitest';
import { ItemTaxTemplateSchema, ItemTaxTemplateInsertSchema } from '../types/item-tax-template.js';

describe('ItemTaxTemplate Zod validation', () => {
  const validSample = {
      "id": "TEST-ItemTaxTemplate-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "title": "Sample Title",
      "company": "LINK-company-001",
      "disabled": "0"
  };

  it('validates a correct Item Tax Template object', () => {
    const result = ItemTaxTemplateSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ItemTaxTemplateInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "title" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).title;
    const result = ItemTaxTemplateSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ItemTaxTemplateSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
