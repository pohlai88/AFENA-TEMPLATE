import { z } from 'zod';

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

/**
 * Zod schema for contact form — client-side validation.
 */
export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().email('Invalid email address').max(255).or(z.literal('')).optional(),
  phone: z.string().max(50).optional(),
  company: z.string().max(255).optional(),
  notes: z.string().max(2000).optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
