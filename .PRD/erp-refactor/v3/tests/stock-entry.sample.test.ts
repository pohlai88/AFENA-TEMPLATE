import { describe, it, expect } from 'vitest';
import { StockEntrySchema, StockEntryInsertSchema } from '../types/stock-entry.js';

describe('StockEntry Zod validation', () => {
  const validSample = {
      "id": "TEST-StockEntry-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "naming_series": "Option1",
      "stock_entry_type": "LINK-stock_entry_type-001",
      "outgoing_stock_entry": "LINK-outgoing_stock_entry-001",
      "purpose": "Material Issue",
      "add_to_transit": "0",
      "work_order": "LINK-work_order-001",
      "job_card": "LINK-job_card-001",
      "purchase_order": "LINK-purchase_order-001",
      "subcontracting_order": "LINK-subcontracting_order-001",
      "subcontracting_inward_order": "LINK-subcontracting_inward_order-001",
      "delivery_note_no": "LINK-delivery_note_no-001",
      "sales_invoice_no": "LINK-sales_invoice_no-001",
      "pick_list": "LINK-pick_list-001",
      "purchase_receipt_no": "LINK-purchase_receipt_no-001",
      "asset_repair": "LINK-asset_repair-001",
      "company": "LINK-company-001",
      "posting_date": "Today",
      "posting_time": "Now",
      "set_posting_time": "0",
      "inspection_required": "0",
      "apply_putaway_rule": "0",
      "is_additional_transfer_entry": "0",
      "from_bom": "0",
      "use_multi_level_bom": "1",
      "bom_no": "LINK-bom_no-001",
      "fg_completed_qty": 1,
      "process_loss_percentage": 1,
      "process_loss_qty": 1,
      "from_warehouse": "LINK-from_warehouse-001",
      "source_warehouse_address": "LINK-source_warehouse_address-001",
      "source_address_display": "Sample text for source_address_display",
      "to_warehouse": "LINK-to_warehouse-001",
      "target_warehouse_address": "LINK-target_warehouse_address-001",
      "target_address_display": "Sample text for target_address_display",
      "scan_barcode": "Sample Scan Barcode",
      "last_scanned_warehouse": "Sample Last Scanned Warehouse",
      "total_outgoing_value": 100,
      "total_incoming_value": 100,
      "value_difference": 100,
      "total_additional_costs": 100,
      "supplier": "LINK-supplier-001",
      "supplier_name": "Sample Supplier Name",
      "supplier_address": "LINK-supplier_address-001",
      "address_display": "Sample text for address_display",
      "project": "LINK-project-001",
      "select_print_heading": "LINK-select_print_heading-001",
      "letter_head": "LINK-letter_head-001",
      "is_opening": "No",
      "remarks": "Sample text for remarks",
      "per_transferred": 1,
      "total_amount": 100,
      "amended_from": "LINK-amended_from-001",
      "credit_note": "LINK-credit_note-001",
      "is_return": "0"
  };

  it('validates a correct Stock Entry object', () => {
    const result = StockEntrySchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = StockEntryInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "naming_series" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).naming_series;
    const result = StockEntrySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = StockEntrySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
