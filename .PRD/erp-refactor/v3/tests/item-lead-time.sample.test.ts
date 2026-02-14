import { describe, it, expect } from 'vitest';
import { ItemLeadTimeSchema, ItemLeadTimeInsertSchema } from '../types/item-lead-time.js';

describe('ItemLeadTime Zod validation', () => {
  const validSample = {
      "id": "TEST-ItemLeadTime-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_code": "LINK-item_code-001",
      "shift_time_in_hours": 1,
      "no_of_workstations": 1,
      "no_of_shift": "1",
      "total_workstation_time": 1,
      "manufacturing_time_in_mins": 1,
      "no_of_units_produced": 1,
      "daily_yield": "90",
      "capacity_per_day": 1,
      "purchase_time": 1,
      "buffer_time": 1,
      "item_name": "Sample Item Name",
      "stock_uom": "LINK-stock_uom-001"
  };

  it('validates a correct Item Lead Time object', () => {
    const result = ItemLeadTimeSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ItemLeadTimeInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ItemLeadTimeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
