import { describe, it, expect } from 'vitest';
import { MasterProductionScheduleItemSchema, MasterProductionScheduleItemInsertSchema } from '../types/master-production-schedule-item.js';

describe('MasterProductionScheduleItem Zod validation', () => {
  const validSample = {
      "id": "TEST-MasterProductionScheduleItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_code": "LINK-item_code-001",
      "delivery_date": "2024-01-15",
      "cumulative_lead_time": 1,
      "order_release_date": "2024-01-15",
      "planned_qty": 1,
      "warehouse": "LINK-warehouse-001",
      "item_name": "Sample Item Name",
      "bom_no": "LINK-bom_no-001",
      "uom": "LINK-uom-001"
  };

  it('validates a correct Master Production Schedule Item object', () => {
    const result = MasterProductionScheduleItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = MasterProductionScheduleItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = MasterProductionScheduleItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
