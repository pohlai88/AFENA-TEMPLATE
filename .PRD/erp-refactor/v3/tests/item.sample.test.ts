import { describe, it, expect } from 'vitest';
import { ItemSchema, ItemInsertSchema } from '../types/item.js';

describe('Item Zod validation', () => {
  const validSample = {
      "id": "TEST-Item-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "naming_series": "Option1",
      "item_code": "Sample Item Code",
      "item_name": "Sample Item Name",
      "item_group": "LINK-item_group-001",
      "stock_uom": "LINK-stock_uom-001",
      "disabled": "0",
      "allow_alternative_item": "0",
      "is_stock_item": "1",
      "has_variants": "0",
      "is_fixed_asset": "0",
      "auto_create_assets": "0",
      "is_grouped_asset": "0",
      "asset_category": "LINK-asset_category-001",
      "asset_naming_series": "Option1",
      "opening_stock": 1,
      "standard_rate": 100,
      "over_delivery_receipt_allowance": 1,
      "over_billing_allowance": 1,
      "image": "/files/sample.png",
      "description": "Sample text for description",
      "brand": "LINK-brand-001",
      "valuation_method": "FIFO",
      "valuation_rate": 100,
      "shelf_life_in_days": 1,
      "end_of_life": "2099-12-31",
      "default_material_request_type": "Purchase",
      "warranty_period": "Sample Warranty Period (in days)",
      "weight_per_unit": 1,
      "weight_uom": "LINK-weight_uom-001",
      "allow_negative_stock": "0",
      "has_batch_no": "0",
      "create_new_batch": "0",
      "batch_number_series": "Sample Batch Number Series",
      "has_expiry_date": "0",
      "retain_sample": "0",
      "sample_quantity": 1,
      "has_serial_no": "0",
      "serial_no_series": "Sample Serial Number Series",
      "variant_of": "LINK-variant_of-001",
      "variant_based_on": "Item Attribute",
      "enable_deferred_expense": "0",
      "no_of_months_exp": 1,
      "enable_deferred_revenue": "0",
      "no_of_months": 1,
      "purchase_uom": "LINK-purchase_uom-001",
      "min_order_qty": "0.00",
      "safety_stock": 1,
      "is_purchase_item": "1",
      "lead_time_days": 1,
      "last_purchase_rate": 1,
      "is_customer_provided_item": "0",
      "customer": "LINK-customer-001",
      "delivered_by_supplier": "0",
      "country_of_origin": "LINK-country_of_origin-001",
      "customs_tariff_number": "LINK-customs_tariff_number-001",
      "sales_uom": "LINK-sales_uom-001",
      "grant_commission": "1",
      "is_sales_item": "1",
      "max_discount": 1,
      "purchase_tax_withholding_category": "LINK-purchase_tax_withholding_category-001",
      "sales_tax_withholding_category": "LINK-sales_tax_withholding_category-001",
      "inspection_required_before_purchase": "0",
      "inspection_required_before_delivery": "0",
      "quality_inspection_template": "LINK-quality_inspection_template-001",
      "include_item_in_manufacturing": "1",
      "is_sub_contracted_item": "0",
      "default_bom": "LINK-default_bom-001",
      "production_capacity": 1,
      "total_projected_qty": 1,
      "customer_code": "Sample text for customer_code",
      "default_manufacturer_part_no": "Sample Default Manufacturer Part No",
      "default_item_manufacturer": "LINK-default_item_manufacturer-001"
  };

  it('validates a correct Item object', () => {
    const result = ItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "item_code" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).item_code;
    const result = ItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
