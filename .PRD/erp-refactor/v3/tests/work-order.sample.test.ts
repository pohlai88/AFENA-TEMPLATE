import { describe, it, expect } from 'vitest';
import { WorkOrderSchema, WorkOrderInsertSchema } from '../types/work-order.js';

describe('WorkOrder Zod validation', () => {
  const validSample = {
      "id": "TEST-WorkOrder-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "naming_series": "Option1",
      "status": "Draft",
      "production_item": "LINK-production_item-001",
      "item_name": "Sample Item Name",
      "image": "/files/sample.png",
      "bom_no": "LINK-bom_no-001",
      "mps": "LINK-mps-001",
      "subcontracting_inward_order": "LINK-subcontracting_inward_order-001",
      "subcontracting_inward_order_item": "Sample Subcontracting Inward Order Item",
      "sales_order": "LINK-sales_order-001",
      "company": "LINK-company-001",
      "qty": "1.0",
      "project": "LINK-project-001",
      "track_semi_finished_goods": "0",
      "reserve_stock": "0",
      "max_producible_qty": 1,
      "material_transferred_for_manufacturing": "0",
      "additional_transferred_qty": 1,
      "produced_qty": "0",
      "disassembled_qty": 1,
      "process_loss_qty": 1,
      "source_warehouse": "LINK-source_warehouse-001",
      "wip_warehouse": "LINK-wip_warehouse-001",
      "fg_warehouse": "LINK-fg_warehouse-001",
      "scrap_warehouse": "LINK-scrap_warehouse-001",
      "transfer_material_against": "Work Order",
      "allow_alternative_item": "0",
      "use_multi_level_bom": "1",
      "skip_transfer": "0",
      "from_wip_warehouse": "0",
      "update_consumed_material_cost_in_project": "1",
      "planned_start_date": "now",
      "planned_end_date": "2024-01-15T10:30:00.000Z",
      "expected_delivery_date": "2024-01-15",
      "actual_start_date": "2024-01-15T10:30:00.000Z",
      "actual_end_date": "2024-01-15T10:30:00.000Z",
      "lead_time": 1,
      "planned_operating_cost": 100,
      "actual_operating_cost": 100,
      "additional_operating_cost": 100,
      "corrective_operation_cost": 100,
      "total_operating_cost": 100,
      "has_serial_no": "0",
      "has_batch_no": "0",
      "batch_size": "0",
      "description": "Sample text for description",
      "stock_uom": "LINK-stock_uom-001",
      "material_request": "LINK-material_request-001",
      "material_request_item": "Sample Material Request Item",
      "sales_order_item": "Sample Sales Order Item",
      "production_plan": "LINK-production_plan-001",
      "production_plan_item": "Sample Production Plan Item",
      "production_plan_sub_assembly_item": "Sample Production Plan Sub-assembly Item",
      "product_bundle_item": "LINK-product_bundle_item-001",
      "amended_from": "LINK-amended_from-001"
  };

  it('validates a correct Work Order object', () => {
    const result = WorkOrderSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = WorkOrderInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "naming_series" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).naming_series;
    const result = WorkOrderSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = WorkOrderSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
