import { describe, it, expect } from 'vitest';
import { StockReconciliationSchema, StockReconciliationInsertSchema } from '../types/stock-reconciliation.js';

describe('StockReconciliation Zod validation', () => {
  const validSample = {
      "id": "TEST-StockReconciliation-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "naming_series": "Option1",
      "company": "LINK-company-001",
      "purpose": "Opening Stock",
      "posting_date": "Today",
      "posting_time": "Now",
      "set_posting_time": "0",
      "set_warehouse": "LINK-set_warehouse-001",
      "scan_barcode": "Sample Scan Barcode",
      "last_scanned_warehouse": "Sample Last Scanned Warehouse",
      "scan_mode": "0",
      "expense_account": "LINK-expense_account-001",
      "difference_amount": 100,
      "amended_from": "LINK-amended_from-001",
      "cost_center": "LINK-cost_center-001"
  };

  it('validates a correct Stock Reconciliation object', () => {
    const result = StockReconciliationSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = StockReconciliationInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "naming_series" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).naming_series;
    const result = StockReconciliationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = StockReconciliationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
