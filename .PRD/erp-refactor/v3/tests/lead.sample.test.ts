import { describe, it, expect } from 'vitest';
import { LeadSchema, LeadInsertSchema } from '../types/lead.js';

describe('Lead Zod validation', () => {
  const validSample = {
      "id": "TEST-Lead-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "naming_series": "Option1",
      "salutation": "LINK-salutation-001",
      "first_name": "Sample First Name",
      "middle_name": "Sample Middle Name",
      "last_name": "Sample Last Name",
      "lead_name": "Sample Full Name",
      "job_title": "Sample Job Title",
      "gender": "LINK-gender-001",
      "lead_owner": "__user",
      "status": "Lead",
      "customer": "LINK-customer-001",
      "type": "Client",
      "request_type": "Product Enquiry",
      "email_id": "test@example.com",
      "website": "Sample Website",
      "mobile_no": "+1-555-0100",
      "whatsapp_no": "+1-555-0100",
      "phone": "+1-555-0100",
      "phone_ext": "Sample Phone Ext.",
      "company_name": "Sample Organization Name",
      "no_of_employees": "1-10",
      "annual_revenue": 100,
      "industry": "LINK-industry-001",
      "market_segment": "LINK-market_segment-001",
      "territory": "LINK-territory-001",
      "fax": "Sample Fax",
      "address_html": "Sample text for address_html",
      "city": "Sample City",
      "state": "Sample State/Province",
      "country": "LINK-country-001",
      "contact_html": "Sample text for contact_html",
      "utm_source": "LINK-utm_source-001",
      "utm_content": "Sample Content",
      "utm_campaign": "LINK-utm_campaign-001",
      "utm_medium": "LINK-utm_medium-001",
      "qualification_status": "Unqualified",
      "qualified_by": "LINK-qualified_by-001",
      "qualified_on": "2024-01-15",
      "company": "LINK-company-001",
      "language": "LINK-language-001",
      "image": "/files/sample.png",
      "title": "Sample Title",
      "disabled": "0",
      "unsubscribed": "0",
      "blog_subscriber": "0",
      "open_activities_html": "Sample text for open_activities_html",
      "all_activities_html": "Sample text for all_activities_html",
      "notes_html": "Sample text for notes_html"
  };

  it('validates a correct Lead object', () => {
    const result = LeadSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = LeadInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "status" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).status;
    const result = LeadSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = LeadSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
