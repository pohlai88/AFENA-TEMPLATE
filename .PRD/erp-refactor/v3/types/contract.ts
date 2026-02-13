import { z } from 'zod';

export const ContractSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  party_type: z.enum(['Customer', 'Supplier', 'Employee']).default('Customer'),
  is_signed: z.boolean().optional().default(false),
  party_name: z.string(),
  party_user: z.string().optional(),
  status: z.enum(['Unsigned', 'Active', 'Inactive', 'Cancelled']).optional(),
  fulfilment_status: z.enum(['N/A', 'Unfulfilled', 'Partially Fulfilled', 'Fulfilled', 'Lapsed']).optional(),
  party_full_name: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  signee: z.string().optional(),
  signed_on: z.string().optional(),
  ip_address: z.string().optional(),
  contract_template: z.string().optional(),
  contract_terms: z.string(),
  requires_fulfilment: z.boolean().optional().default(false),
  fulfilment_deadline: z.string().optional(),
  fulfilment_terms: z.array(z.unknown()).optional(),
  signee_company: z.string().optional(),
  signed_by_company: z.string().optional(),
  document_type: z.enum(['Quotation', 'Project', 'Sales Order', 'Purchase Order', 'Sales Invoice', 'Purchase Invoice']).optional(),
  document_name: z.string().optional(),
  amended_from: z.string().optional(),
});

export type Contract = z.infer<typeof ContractSchema>;

export const ContractInsertSchema = ContractSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ContractInsert = z.infer<typeof ContractInsertSchema>;
