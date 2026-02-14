import { describe, it, expect } from 'vitest';
import { CashierClosingSchema, CashierClosingInsertSchema } from '../types/cashier-closing.js';

describe('CashierClosing Zod validation', () => {
  const validSample = {
      "id": "TEST-CashierClosing-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "naming_series": "POS-CLO-",
      "user": "LINK-user-001",
      "date": "Today",
      "from_time": "10:30:00",
      "time": "10:30:00",
      "expense": "0.00",
      "custody": "0.00",
      "returns": "0.00",
      "outstanding_amount": "0.00",
      "net_amount": 1,
      "amended_from": "LINK-amended_from-001"
  };

  it('validates a correct Cashier Closing object', () => {
    const result = CashierClosingSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = CashierClosingInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "user" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).user;
    const result = CashierClosingSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = CashierClosingSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
