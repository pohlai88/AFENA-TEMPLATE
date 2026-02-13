import { describe, it, expect } from 'vitest';
import { LedgerHealthMonitorSchema, LedgerHealthMonitorInsertSchema } from '../types/ledger-health-monitor.js';

describe('LedgerHealthMonitor Zod validation', () => {
  const validSample = {
      "id": "TEST-LedgerHealthMonitor-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "enable_health_monitor": "0",
      "monitor_for_last_x_days": "60",
      "debit_credit_mismatch": "0",
      "general_and_payment_ledger_mismatch": "0"
  };

  it('validates a correct Ledger Health Monitor object', () => {
    const result = LedgerHealthMonitorSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = LedgerHealthMonitorInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "monitor_for_last_x_days" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).monitor_for_last_x_days;
    const result = LedgerHealthMonitorSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = LedgerHealthMonitorSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
