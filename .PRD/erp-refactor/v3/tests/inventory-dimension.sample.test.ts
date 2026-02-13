import { describe, it, expect } from 'vitest';
import { InventoryDimensionSchema, InventoryDimensionInsertSchema } from '../types/inventory-dimension.js';

describe('InventoryDimension Zod validation', () => {
  const validSample = {
      "id": "TEST-InventoryDimension-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "dimension_name": "Sample Dimension Name",
      "reference_document": "LINK-reference_document-001",
      "disabled": "0",
      "source_fieldname": "Sample Source Fieldname",
      "target_fieldname": "Sample Target Fieldname (Stock Ledger Entry)",
      "apply_to_all_doctypes": "1",
      "validate_negative_stock": "0",
      "document_type": "LINK-document_type-001",
      "type_of_transaction": "Inward",
      "fetch_from_parent": "Option1",
      "istable": "0",
      "condition": "console.log(\"hello\");",
      "reqd": "0",
      "mandatory_depends_on": "Sample text for mandatory_depends_on",
      "html_19": "Sample text for html_19"
  };

  it('validates a correct Inventory Dimension object', () => {
    const result = InventoryDimensionSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = InventoryDimensionInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "dimension_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).dimension_name;
    const result = InventoryDimensionSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = InventoryDimensionSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
