import { describe, it, expect } from 'vitest';
import { ShipmentSchema, ShipmentInsertSchema } from '../types/shipment.js';

describe('Shipment Zod validation', () => {
  const validSample = {
      "id": "TEST-Shipment-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "pickup_from_type": "Company",
      "pickup_company": "LINK-pickup_company-001",
      "pickup_customer": "LINK-pickup_customer-001",
      "pickup_supplier": "LINK-pickup_supplier-001",
      "pickup": "Sample Pickup From",
      "pickup_address_name": "LINK-pickup_address_name-001",
      "pickup_address": "Sample text for pickup_address",
      "pickup_contact_person": "LINK-pickup_contact_person-001",
      "pickup_contact_name": "LINK-pickup_contact_name-001",
      "pickup_contact_email": "Sample Contact Email",
      "pickup_contact": "Sample text for pickup_contact",
      "delivery_to_type": "Customer",
      "delivery_company": "LINK-delivery_company-001",
      "delivery_customer": "LINK-delivery_customer-001",
      "delivery_supplier": "LINK-delivery_supplier-001",
      "delivery_to": "Sample Delivery To",
      "delivery_address_name": "LINK-delivery_address_name-001",
      "delivery_address": "Sample text for delivery_address",
      "delivery_contact_name": "LINK-delivery_contact_name-001",
      "delivery_contact_email": "Sample Contact Email",
      "delivery_contact": "Sample text for delivery_contact",
      "parcel_template": "LINK-parcel_template-001",
      "total_weight": 1,
      "pallets": "No",
      "value_of_goods": 100,
      "pickup_date": "2024-01-15",
      "pickup_from": "09:00",
      "pickup_to": "17:00",
      "shipment_type": "Goods",
      "pickup_type": "Pickup",
      "incoterm": "LINK-incoterm-001",
      "description_of_content": "Sample text for description_of_content",
      "service_provider": "Sample Service Provider",
      "shipment_id": "Sample Shipment ID",
      "shipment_amount": 100,
      "status": "Draft",
      "tracking_url": "Sample text for tracking_url",
      "carrier": "Sample Carrier",
      "carrier_service": "Sample Carrier Service",
      "awb_number": "Sample AWB Number",
      "tracking_status": "In Progress",
      "tracking_status_info": "Sample Tracking Status Info",
      "amended_from": "LINK-amended_from-001"
  };

  it('validates a correct Shipment object', () => {
    const result = ShipmentSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ShipmentInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "pickup_address_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).pickup_address_name;
    const result = ShipmentSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ShipmentSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
