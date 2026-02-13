import { describe, it, expect } from 'vitest';
import { PackingSlipSchema, PackingSlipInsertSchema } from '../types/packing-slip.js';

describe('PackingSlip Zod validation', () => {
  const validSample = {
      "id": "TEST-PackingSlip-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "delivery_note": "LINK-delivery_note-001",
      "naming_series": "Option1",
      "from_case_no": 1,
      "to_case_no": 1,
      "net_weight_pkg": 1,
      "net_weight_uom": "LINK-net_weight_uom-001",
      "gross_weight_pkg": 1,
      "gross_weight_uom": "LINK-gross_weight_uom-001",
      "letter_head": "LINK-letter_head-001",
      "amended_from": "LINK-amended_from-001"
  };

  it('validates a correct Packing Slip object', () => {
    const result = PackingSlipSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PackingSlipInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "delivery_note" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).delivery_note;
    const result = PackingSlipSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PackingSlipSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
