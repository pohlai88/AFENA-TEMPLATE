import { describe, it, expect } from 'vitest';
import { AssetRepairConsumedItemSchema, AssetRepairConsumedItemInsertSchema } from '../types/asset-repair-consumed-item.js';

describe('AssetRepairConsumedItem Zod validation', () => {
  const validSample = {
      "id": "TEST-AssetRepairConsumedItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_code": "LINK-item_code-001",
      "warehouse": "LINK-warehouse-001",
      "valuation_rate": 100,
      "consumed_quantity": "Sample Consumed Quantity",
      "total_value": 100,
      "serial_no": "Sample text for serial_no",
      "serial_and_batch_bundle": "LINK-serial_and_batch_bundle-001"
  };

  it('validates a correct Asset Repair Consumed Item object', () => {
    const result = AssetRepairConsumedItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = AssetRepairConsumedItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "item_code" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).item_code;
    const result = AssetRepairConsumedItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = AssetRepairConsumedItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
