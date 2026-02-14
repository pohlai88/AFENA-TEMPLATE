import { describe, it, expect } from 'vitest';
import { AssetCapitalizationServiceItemSchema, AssetCapitalizationServiceItemInsertSchema } from '../types/asset-capitalization-service-item.js';

describe('AssetCapitalizationServiceItem Zod validation', () => {
  const validSample = {
      "id": "TEST-AssetCapitalizationServiceItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_code": "LINK-item_code-001",
      "item_name": "Sample Item Name",
      "expense_account": "LINK-expense_account-001",
      "qty": "1",
      "uom": "LINK-uom-001",
      "rate": 100,
      "amount": "0",
      "cost_center": "LINK-cost_center-001"
  };

  it('validates a correct Asset Capitalization Service Item object', () => {
    const result = AssetCapitalizationServiceItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = AssetCapitalizationServiceItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "expense_account" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).expense_account;
    const result = AssetCapitalizationServiceItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = AssetCapitalizationServiceItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
