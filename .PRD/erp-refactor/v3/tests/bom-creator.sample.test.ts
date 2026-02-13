import { describe, it, expect } from 'vitest';
import { BomCreatorSchema, BomCreatorInsertSchema } from '../types/bom-creator.js';

describe('BomCreator Zod validation', () => {
  const validSample = {
      "id": "TEST-BomCreator-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "bom_creator": "Sample text for bom_creator",
      "item_code": "LINK-item_code-001",
      "item_name": "Sample Item Name",
      "item_group": "LINK-item_group-001",
      "qty": 1,
      "project": "LINK-project-001",
      "uom": "LINK-uom-001",
      "routing": "LINK-routing-001",
      "rm_cost_as_per": "Valuation Rate",
      "set_rate_based_on_warehouse": "0",
      "buying_price_list": "LINK-buying_price_list-001",
      "price_list_currency": "LINK-price_list_currency-001",
      "plc_conversion_rate": 1,
      "currency": "LINK-currency-001",
      "conversion_rate": "1",
      "default_warehouse": "LINK-default_warehouse-001",
      "company": "LINK-company-001",
      "raw_material_cost": 100,
      "remarks": "Sample text for remarks",
      "status": "Draft",
      "error_log": "Sample text for error_log",
      "amended_from": "LINK-amended_from-001"
  };

  it('validates a correct BOM Creator object', () => {
    const result = BomCreatorSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = BomCreatorInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "item_code" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).item_code;
    const result = BomCreatorSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = BomCreatorSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
