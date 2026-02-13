import { describe, it, expect } from 'vitest';
import { OpportunitySchema, OpportunityInsertSchema } from '../types/opportunity.js';

describe('Opportunity Zod validation', () => {
  const validSample = {
      "id": "TEST-Opportunity-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "naming_series": "Option1",
      "opportunity_from": "LINK-opportunity_from-001",
      "party_name": "LINK-party_name-001",
      "customer_name": "Sample Customer Name",
      "status": "Open",
      "opportunity_type": "LINK-opportunity_type-001",
      "opportunity_owner": "LINK-opportunity_owner-001",
      "sales_stage": "Prospecting",
      "expected_closing": "2024-01-15",
      "probability": "100",
      "no_of_employees": "1-10",
      "annual_revenue": 100,
      "customer_group": "LINK-customer_group-001",
      "industry": "LINK-industry-001",
      "market_segment": "LINK-market_segment-001",
      "website": "Sample Website",
      "city": "Sample City",
      "state": "Sample State/Province",
      "country": "LINK-country-001",
      "territory": "LINK-territory-001",
      "currency": "LINK-currency-001",
      "conversion_rate": 1,
      "opportunity_amount": 100,
      "base_opportunity_amount": 100,
      "utm_source": "LINK-utm_source-001",
      "utm_content": "Sample Content",
      "utm_campaign": "LINK-utm_campaign-001",
      "utm_medium": "LINK-utm_medium-001",
      "company": "LINK-company-001",
      "transaction_date": "Today",
      "language": "LINK-language-001",
      "amended_from": "LINK-amended_from-001",
      "title": "Sample Title",
      "first_response_time": 3600,
      "order_lost_reason": "Sample text for order_lost_reason",
      "contact_person": "LINK-contact_person-001",
      "job_title": "Sample Job Title",
      "contact_email": "test@example.com",
      "contact_mobile": "+1-555-0100",
      "whatsapp": "+1-555-0100",
      "phone": "+1-555-0100",
      "phone_ext": "Sample Phone Ext.",
      "address_html": "Sample text for address_html",
      "customer_address": "LINK-customer_address-001",
      "address_display": "Sample text for address_display",
      "contact_html": "Sample text for contact_html",
      "contact_display": "Sample text for contact_display",
      "base_total": 100,
      "total": 100,
      "open_activities_html": "Sample text for open_activities_html",
      "all_activities_html": "Sample text for all_activities_html",
      "notes_html": "Sample text for notes_html"
  };

  it('validates a correct Opportunity object', () => {
    const result = OpportunitySchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = OpportunityInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "naming_series" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).naming_series;
    const result = OpportunitySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = OpportunitySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
