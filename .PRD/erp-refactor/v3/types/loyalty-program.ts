import { z } from 'zod';

export const LoyaltyProgramSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  loyalty_program_name: z.string(),
  loyalty_program_type: z.enum(['Single Tier Program', 'Multiple Tier Program']).optional(),
  from_date: z.string(),
  to_date: z.string().optional(),
  customer_group: z.string().optional(),
  customer_territory: z.string().optional(),
  auto_opt_in: z.boolean().optional().default(false),
  collection_rules: z.array(z.unknown()),
  conversion_factor: z.number().optional(),
  expiry_duration: z.number().int().optional(),
  expense_account: z.string().optional(),
  company: z.string().optional(),
  cost_center: z.string().optional(),
  project: z.string().optional(),
  loyalty_program_help: z.string().optional(),
});

export type LoyaltyProgram = z.infer<typeof LoyaltyProgramSchema>;

export const LoyaltyProgramInsertSchema = LoyaltyProgramSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type LoyaltyProgramInsert = z.infer<typeof LoyaltyProgramInsertSchema>;
