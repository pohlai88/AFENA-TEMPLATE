import { describe, it, expect } from 'vitest';
import { BomSchema, BomInsertSchema } from '../types/bom.js';

describe('Bom Zod validation', () => {
  const validSample = {
      "id": "TEST-Bom-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "item": "LINK-item-001",
      "company": "LINK-company-001",
      "uom": "LINK-uom-001",
      "quantity": "1",
      "is_active": "1",
      "is_default": "1",
      "allow_alternative_item": "0",
      "set_rate_of_sub_assembly_item_based_on_bom": "1",
      "is_phantom_bom": "0",
      "project": "LINK-project-001",
      "image": "/files/sample.png",
      "rm_cost_as_per": "Valuation Rate",
      "buying_price_list": "LINK-buying_price_list-001",
      "price_list_currency": "LINK-price_list_currency-001",
      "plc_conversion_rate": 1,
      "currency": "LINK-currency-001",
      "conversion_rate": "1",
      "with_operations": "0",
      "track_semi_finished_goods": "0",
      "transfer_material_against": "Work Order",
      "routing": "LINK-routing-001",
      "fg_based_operating_cost": "0",
      "default_source_warehouse": "LINK-default_source_warehouse-001",
      "default_target_warehouse": "LINK-default_target_warehouse-001",
      "operating_cost_per_bom_quantity": 100,
      "process_loss_percentage": 1,
      "process_loss_qty": 1,
      "operating_cost": 100,
      "raw_material_cost": 100,
      "scrap_material_cost": 100,
      "base_operating_cost": 100,
      "base_raw_material_cost": 100,
      "base_scrap_material_cost": 100,
      "total_cost": 100,
      "base_total_cost": 100,
      "item_name": "Sample Item Name",
      "description": "Sample text for description",
      "has_variants": "0",
      "inspection_required": "0",
      "quality_inspection_template": "LINK-quality_inspection_template-001",
      "show_in_website": "0",
      "route": "Sample text for route",
      "website_image": "/files/sample.png",
      "thumbnail": "Sample Thumbnail",
      "show_items": "0",
      "show_operations": "0",
      "web_long_description": "Sample text for web_long_description",
      "bom_creator": "LINK-bom_creator-001",
      "bom_creator_item": "Sample BOM Creator Item",
      "amended_from": "LINK-amended_from-001"
  };

  it('validates a correct BOM object', () => {
    const result = BomSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = BomInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "item" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).item;
    const result = BomSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = BomSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
