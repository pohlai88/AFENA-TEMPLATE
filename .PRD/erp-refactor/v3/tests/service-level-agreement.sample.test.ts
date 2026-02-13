import { describe, it, expect } from 'vitest';
import { ServiceLevelAgreementSchema, ServiceLevelAgreementInsertSchema } from '../types/service-level-agreement.js';

describe('ServiceLevelAgreement Zod validation', () => {
  const validSample = {
      "id": "TEST-ServiceLevelAgreement-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "document_type": "LINK-document_type-001",
      "default_priority": "LINK-default_priority-001",
      "service_level": "Sample Service Level Name",
      "enabled": "1",
      "default_service_level_agreement": "0",
      "entity_type": "Customer",
      "entity": "LINK-entity-001",
      "condition": "console.log(\"hello\");",
      "start_date": "2024-01-15",
      "end_date": "2024-01-15",
      "apply_sla_for_resolution": "1",
      "holiday_list": "LINK-holiday_list-001"
  };

  it('validates a correct Service Level Agreement object', () => {
    const result = ServiceLevelAgreementSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ServiceLevelAgreementInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "document_type" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).document_type;
    const result = ServiceLevelAgreementSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ServiceLevelAgreementSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
