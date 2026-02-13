import { describe, it, expect } from 'vitest';
import { AssetSchema, AssetInsertSchema } from '../types/asset.js';

describe('Asset Zod validation', () => {
  const validSample = {
      "id": "TEST-Asset-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "naming_series": "Option1",
      "company": "LINK-company-001",
      "item_code": "LINK-item_code-001",
      "item_name": "Read Only Value",
      "asset_name": "Sample Asset Name",
      "image": "/files/sample.png",
      "location": "LINK-location-001",
      "asset_category": "LINK-asset_category-001",
      "asset_type": "Existing Asset",
      "maintenance_required": "0",
      "calculate_depreciation": "0",
      "purchase_receipt": "LINK-purchase_receipt-001",
      "purchase_receipt_item": "Sample Purchase Receipt Item",
      "purchase_invoice": "LINK-purchase_invoice-001",
      "purchase_invoice_item": "Sample Purchase Invoice Item",
      "purchase_date": "2024-01-15",
      "available_for_use_date": "2024-01-15",
      "disposal_date": "2024-01-15",
      "net_purchase_amount": 100,
      "purchase_amount": 100,
      "asset_quantity": "1",
      "additional_asset_cost": "0",
      "total_asset_cost": 100,
      "opening_accumulated_depreciation": 100,
      "is_fully_depreciated": "0",
      "opening_number_of_booked_depreciations": 1,
      "depreciation_method": "Straight Line",
      "value_after_depreciation": 100,
      "frequency_of_depreciation": 1,
      "next_depreciation_date": "2024-01-15",
      "total_number_of_depreciations": 1,
      "depreciation_schedule_view": "Sample text for depreciation_schedule_view",
      "cost_center": "LINK-cost_center-001",
      "asset_owner": "Company",
      "asset_owner_company": "LINK-asset_owner_company-001",
      "customer": "LINK-customer-001",
      "supplier": "LINK-supplier-001",
      "policy_number": "Sample Policy number",
      "insurer": "Sample Insurer",
      "insured_value": "Sample Insured value",
      "insurance_start_date": "2024-01-15",
      "insurance_end_date": "2024-01-15",
      "comprehensive_insurance": "Sample Comprehensive Insurance",
      "status": "Draft",
      "custodian": "LINK-custodian-001",
      "department": "LINK-department-001",
      "default_finance_book": "LINK-default_finance_book-001",
      "depr_entry_posting_status": "Successful",
      "journal_entry_for_scrap": "LINK-journal_entry_for_scrap-001",
      "split_from": "LINK-split_from-001",
      "amended_from": "LINK-amended_from-001",
      "booked_fixed_asset": "0"
  };

  it('validates a correct Asset object', () => {
    const result = AssetSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = AssetInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "company" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).company;
    const result = AssetSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = AssetSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
