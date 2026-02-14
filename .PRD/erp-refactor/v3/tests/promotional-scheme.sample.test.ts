import { describe, it, expect } from 'vitest';
import { PromotionalSchemeSchema, PromotionalSchemeInsertSchema } from '../types/promotional-scheme.js';

describe('PromotionalScheme Zod validation', () => {
  const validSample = {
      "id": "TEST-PromotionalScheme-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "apply_on": "Item Code",
      "disable": "0",
      "mixed_conditions": "0",
      "is_cumulative": "0",
      "apply_rule_on_other": "Item Code",
      "other_item_code": "LINK-other_item_code-001",
      "other_item_group": "LINK-other_item_group-001",
      "other_brand": "LINK-other_brand-001",
      "selling": "0",
      "buying": "0",
      "applicable_for": "Customer",
      "valid_from": "Today",
      "valid_upto": "2024-01-15",
      "company": "LINK-company-001",
      "currency": "LINK-currency-001"
  };

  it('validates a correct Promotional Scheme object', () => {
    const result = PromotionalSchemeSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PromotionalSchemeInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "apply_on" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).apply_on;
    const result = PromotionalSchemeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PromotionalSchemeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
