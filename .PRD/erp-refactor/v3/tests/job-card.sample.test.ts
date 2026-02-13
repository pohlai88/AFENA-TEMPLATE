import { describe, it, expect } from 'vitest';
import { JobCardSchema, JobCardInsertSchema } from '../types/job-card.js';

describe('JobCard Zod validation', () => {
  const validSample = {
      "id": "TEST-JobCard-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "naming_series": "PO-JOB.#####",
      "work_order": "LINK-work_order-001",
      "is_subcontracted": "0",
      "posting_date": "Today",
      "company": "LINK-company-001",
      "project": "LINK-project-001",
      "bom_no": "LINK-bom_no-001",
      "finished_good": "LINK-finished_good-001",
      "production_item": "LINK-production_item-001",
      "semi_fg_bom": "LINK-semi_fg_bom-001",
      "total_completed_qty": "0",
      "for_quantity": 1,
      "transferred_qty": "0",
      "manufactured_qty": 1,
      "process_loss_qty": 1,
      "operation": "LINK-operation-001",
      "source_warehouse": "LINK-source_warehouse-001",
      "wip_warehouse": "LINK-wip_warehouse-001",
      "skip_material_transfer": "0",
      "backflush_from_wip_warehouse": "0",
      "workstation_type": "LINK-workstation_type-001",
      "workstation": "LINK-workstation-001",
      "target_warehouse": "LINK-target_warehouse-001",
      "quality_inspection_template": "LINK-quality_inspection_template-001",
      "quality_inspection": "LINK-quality_inspection-001",
      "expected_start_date": "2024-01-15T10:30:00.000Z",
      "time_required": 1,
      "expected_end_date": "2024-01-15T10:30:00.000Z",
      "actual_start_date": "2024-01-15T10:30:00.000Z",
      "total_time_in_mins": 1,
      "actual_end_date": "2024-01-15T10:30:00.000Z",
      "for_job_card": "LINK-for_job_card-001",
      "is_corrective_job_card": "0",
      "hour_rate": 100,
      "for_operation": "LINK-for_operation-001",
      "item_name": "Read Only Value",
      "requested_qty": "0",
      "status": "Open",
      "operation_row_id": 1,
      "is_paused": "0",
      "track_semi_finished_goods": "0",
      "operation_row_number": "Option1",
      "operation_id": "Sample Operation ID",
      "sequence_id": 1,
      "remarks": "Sample text for remarks",
      "serial_and_batch_bundle": "LINK-serial_and_batch_bundle-001",
      "batch_no": "LINK-batch_no-001",
      "serial_no": "Sample text for serial_no",
      "barcode": "Sample Barcode",
      "started_time": "2024-01-15T10:30:00.000Z",
      "current_time": 1,
      "amended_from": "LINK-amended_from-001"
  };

  it('validates a correct Job Card object', () => {
    const result = JobCardSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = JobCardInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "naming_series" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).naming_series;
    const result = JobCardSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = JobCardSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
