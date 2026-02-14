import { describe, it, expect } from 'vitest';
import { ItemVariantSettingsSchema, ItemVariantSettingsInsertSchema } from '../types/item-variant-settings.js';

describe('ItemVariantSettings Zod validation', () => {
  const validSample = {
      "id": "TEST-ItemVariantSettings-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "do_not_update_variants": "0",
      "allow_rename_attribute_value": "0",
      "allow_different_uom": "0"
  };

  it('validates a correct Item Variant Settings object', () => {
    const result = ItemVariantSettingsSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ItemVariantSettingsInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ItemVariantSettingsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
