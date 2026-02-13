import { describe, it, expect } from 'vitest';
import { IssueSchema, IssueInsertSchema } from '../types/issue.js';

describe('Issue Zod validation', () => {
  const validSample = {
      "id": "TEST-Issue-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "naming_series": "Option1",
      "subject": "Sample Subject",
      "customer": "LINK-customer-001",
      "raised_by": "test@example.com",
      "status": "Open",
      "priority": "LINK-priority-001",
      "issue_type": "LINK-issue_type-001",
      "issue_split_from": "LINK-issue_split_from-001",
      "description": "Sample text for description",
      "service_level_agreement": "LINK-service_level_agreement-001",
      "response_by": "2024-01-15T10:30:00.000Z",
      "agreement_status": "First Response Due",
      "sla_resolution_by": "2024-01-15T10:30:00.000Z",
      "service_level_agreement_creation": "2024-01-15T10:30:00.000Z",
      "on_hold_since": "2024-01-15T10:30:00.000Z",
      "total_hold_time": 3600,
      "first_response_time": 3600,
      "first_responded_on": "2024-01-15T10:30:00.000Z",
      "avg_response_time": 3600,
      "resolution_details": "Sample text for resolution_details",
      "opening_date": "Today",
      "opening_time": "10:30:00",
      "sla_resolution_date": "2024-01-15T10:30:00.000Z",
      "resolution_time": 3600,
      "user_resolution_time": 3600,
      "lead": "LINK-lead-001",
      "contact": "LINK-contact-001",
      "email_account": "LINK-email_account-001",
      "customer_name": "Sample Customer Name",
      "project": "LINK-project-001",
      "company": "LINK-company-001",
      "via_customer_portal": "0",
      "attachment": "/files/sample.png",
      "content_type": "Sample Content Type"
  };

  it('validates a correct Issue object', () => {
    const result = IssueSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = IssueInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "subject" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).subject;
    const result = IssueSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = IssueSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
