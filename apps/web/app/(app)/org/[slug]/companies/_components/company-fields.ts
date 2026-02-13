import { z } from 'zod';

export interface FieldDef {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea';
  placeholder?: string;
  required?: boolean;
}

export const COMPANIES_FIELDS: FieldDef[] = [
  { name: 'name', label: 'Company Name', type: 'text', placeholder: 'Acme Corp', required: true },
  { name: 'legalName', label: 'Legal Name', type: 'text', placeholder: 'Acme Corporation Sdn Bhd' },
  { name: 'registrationNo', label: 'Registration No.', type: 'text', placeholder: '202301012345' },
  { name: 'taxId', label: 'Tax ID', type: 'text', placeholder: 'C-1234567890' },
  { name: 'baseCurrency', label: 'Base Currency', type: 'text', placeholder: 'MYR' },
];

export const companyFormSchema = z.object({
  name: z.string().min(1, 'Company name is required').max(255),
  legalName: z.string().max(255).optional(),
  registrationNo: z.string().max(100).optional(),
  taxId: z.string().max(100).optional(),
  baseCurrency: z.string().min(3).max(3).default('MYR'),
  fiscalYearStart: z.number().int().min(1).max(12).optional(),
  address: z.record(z.string(), z.unknown()).optional(),
});

export type CompanyFormValues = z.infer<typeof companyFormSchema>;
