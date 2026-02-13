import { z } from 'zod';

export const LedgerHealthMonitorCompanySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string().optional(),
});

export type LedgerHealthMonitorCompany = z.infer<typeof LedgerHealthMonitorCompanySchema>;

export const LedgerHealthMonitorCompanyInsertSchema = LedgerHealthMonitorCompanySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type LedgerHealthMonitorCompanyInsert = z.infer<typeof LedgerHealthMonitorCompanyInsertSchema>;
