import { describe, it, expect } from 'vitest';
import { TelephonyCallTypeSchema, TelephonyCallTypeInsertSchema } from '../types/telephony-call-type.js';

describe('TelephonyCallType Zod validation', () => {
  const validSample = {
      "id": "TEST-TelephonyCallType-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "call_type": "Sample Call Type",
      "amended_from": "LINK-amended_from-001"
  };

  it('validates a correct Telephony Call Type object', () => {
    const result = TelephonyCallTypeSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = TelephonyCallTypeInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "call_type" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).call_type;
    const result = TelephonyCallTypeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = TelephonyCallTypeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
