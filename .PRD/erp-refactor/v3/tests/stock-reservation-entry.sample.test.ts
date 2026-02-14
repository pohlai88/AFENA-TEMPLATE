import { describe, it, expect } from 'vitest';
import { StockReservationEntrySchema, StockReservationEntryInsertSchema } from '../types/stock-reservation-entry.js';

describe('StockReservationEntry Zod validation', () => {
  const validSample = {
      "id": "TEST-StockReservationEntry-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "voucher_type": "Sales Order",
      "voucher_no": "LINK-voucher_no-001",
      "voucher_detail_no": "Sample Voucher Detail No",
      "voucher_qty": "0",
      "available_qty": "0",
      "reserved_qty": 1,
      "delivered_qty": "0",
      "item_code": "LINK-item_code-001",
      "warehouse": "LINK-warehouse-001",
      "stock_uom": "LINK-stock_uom-001",
      "has_serial_no": "0",
      "has_batch_no": "0",
      "from_voucher_type": "Pick List",
      "from_voucher_no": "LINK-from_voucher_no-001",
      "from_voucher_detail_no": "Sample From Voucher Detail No",
      "transferred_qty": 1,
      "consumed_qty": 1,
      "reservation_based_on": "Qty",
      "company": "LINK-company-001",
      "project": "LINK-project-001",
      "status": "Draft",
      "amended_from": "LINK-amended_from-001"
  };

  it('validates a correct Stock Reservation Entry object', () => {
    const result = StockReservationEntrySchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = StockReservationEntryInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = StockReservationEntrySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
