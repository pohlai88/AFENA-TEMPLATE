import { describe, it, expect } from 'vitest';
import { DeliveryScheduleItemSchema, DeliveryScheduleItemInsertSchema } from '../types/delivery-schedule-item.js';

describe('DeliveryScheduleItem Zod validation', () => {
  const validSample = {
      "id": "TEST-DeliveryScheduleItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_code": "LINK-item_code-001",
      "warehouse": "LINK-warehouse-001",
      "delivery_date": "2024-01-15",
      "sales_order": "LINK-sales_order-001",
      "sales_order_item": "Sample Sales Order Item",
      "qty": 1,
      "uom": "LINK-uom-001",
      "conversion_factor": 1,
      "stock_qty": 1,
      "stock_uom": "LINK-stock_uom-001"
  };

  it('validates a correct Delivery Schedule Item object', () => {
    const result = DeliveryScheduleItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = DeliveryScheduleItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = DeliveryScheduleItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
