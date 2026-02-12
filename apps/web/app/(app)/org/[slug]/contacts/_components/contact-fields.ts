/**
 * Contact field registry — defines form fields for the contact entity.
 * Data only — no hooks, no 'use client'.
 */

export interface FieldDef {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea';
  placeholder?: string;
  required?: boolean;
}

export const CONTACT_FIELDS: FieldDef[] = [
  { name: 'name', label: 'Name', type: 'text', placeholder: 'Full name', required: true },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'email@example.com' },
  { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+1 (555) 000-0000' },
  { name: 'company', label: 'Company', type: 'text', placeholder: 'Company name' },
  { name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Additional notes...' },
];
