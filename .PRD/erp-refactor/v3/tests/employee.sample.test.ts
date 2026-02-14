import { describe, it, expect } from 'vitest';
import { EmployeeSchema, EmployeeInsertSchema } from '../types/employee.js';

describe('Employee Zod validation', () => {
  const validSample = {
      "id": "TEST-Employee-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "employee": "Sample Employee",
      "naming_series": "Option1",
      "first_name": "Sample First Name",
      "middle_name": "Sample Middle Name",
      "last_name": "Sample Last Name",
      "employee_name": "Sample Full Name",
      "gender": "LINK-gender-001",
      "date_of_birth": "2024-01-15",
      "salutation": "LINK-salutation-001",
      "date_of_joining": "2024-01-15",
      "image": "/files/sample.png",
      "status": "Active",
      "user_id": "LINK-user_id-001",
      "create_user_permission": "1",
      "company": "LINK-company-001",
      "department": "LINK-department-001",
      "employee_number": "Sample Employee Number",
      "designation": "LINK-designation-001",
      "reports_to": "LINK-reports_to-001",
      "branch": "LINK-branch-001",
      "scheduled_confirmation_date": "2024-01-15",
      "final_confirmation_date": "2024-01-15",
      "contract_end_date": "2024-01-15",
      "notice_number_of_days": 1,
      "date_of_retirement": "2024-01-15",
      "cell_number": "+1-555-0100",
      "personal_email": "test@example.com",
      "company_email": "test@example.com",
      "prefered_contact_email": "Company Email",
      "prefered_email": "test@example.com",
      "unsubscribed": "0",
      "current_address": "Sample text for current_address",
      "current_accommodation_type": "Rented",
      "permanent_address": "Sample text for permanent_address",
      "permanent_accommodation_type": "Rented",
      "person_to_be_contacted": "Sample Emergency Contact Name",
      "emergency_phone_number": "+1-555-0100",
      "relation": "Sample Relation",
      "attendance_device_id": "Sample Attendance Device ID (Biometric/RF tag ID)",
      "holiday_list": "LINK-holiday_list-001",
      "ctc": 100,
      "salary_currency": "LINK-salary_currency-001",
      "salary_mode": "Bank",
      "bank_name": "Sample Bank Name",
      "bank_ac_no": "Sample Bank A/C No.",
      "iban": "DE89370400440532013000",
      "marital_status": "Single",
      "family_background": "Sample text for family_background",
      "blood_group": "A+",
      "health_details": "Sample text for health_details",
      "passport_number": "Sample Passport Number",
      "valid_upto": "2024-01-15",
      "date_of_issue": "2024-01-15",
      "place_of_issue": "Sample Place of Issue",
      "bio": "Sample text for bio",
      "resignation_letter_date": "2024-01-15",
      "relieving_date": "2024-01-15",
      "held_on": "2024-01-15",
      "new_workplace": "Sample New Workplace",
      "leave_encashed": "Yes",
      "encashment_date": "2024-01-15",
      "reason_for_leaving": "Sample text for reason_for_leaving",
      "feedback": "Sample text for feedback",
      "lft": 1,
      "rgt": 1,
      "old_parent": "Sample Old Parent"
  };

  it('validates a correct Employee object', () => {
    const result = EmployeeSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = EmployeeInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "first_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).first_name;
    const result = EmployeeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = EmployeeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
