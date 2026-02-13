import { describe, it, expect } from 'vitest';
import { ProcessPaymentReconciliationLogSchema, ProcessPaymentReconciliationLogInsertSchema } from '../types/process-payment-reconciliation-log.js';

describe('ProcessPaymentReconciliationLog Zod validation', () => {
  const validSample = {
      "id": "TEST-ProcessPaymentReconciliationLog-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "process_pr": "LINK-process_pr-001",
      "status": "Running",
      "allocated": "0",
      "reconciled": "0",
      "total_allocations": 1,
      "reconciled_entries": 1,
      "error_log": "Sample text for error_log"
  };

  it('validates a correct Process Payment Reconciliation Log object', () => {
    const result = ProcessPaymentReconciliationLogSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ProcessPaymentReconciliationLogInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "process_pr" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).process_pr;
    const result = ProcessPaymentReconciliationLogSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ProcessPaymentReconciliationLogSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
