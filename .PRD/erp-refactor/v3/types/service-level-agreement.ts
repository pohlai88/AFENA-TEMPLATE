import { z } from 'zod';

export const ServiceLevelAgreementSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  document_type: z.string(),
  default_priority: z.string().optional(),
  service_level: z.string(),
  enabled: z.boolean().optional().default(true),
  default_service_level_agreement: z.boolean().optional().default(false),
  entity_type: z.enum(['Customer', 'Customer Group', 'Territory']).optional(),
  entity: z.string().optional(),
  condition: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  apply_sla_for_resolution: z.boolean().optional().default(true),
  priorities: z.array(z.unknown()),
  sla_fulfilled_on: z.array(z.unknown()),
  pause_sla_on: z.array(z.unknown()).optional(),
  holiday_list: z.string(),
  support_and_resolution: z.array(z.unknown()),
});

export type ServiceLevelAgreement = z.infer<typeof ServiceLevelAgreementSchema>;

export const ServiceLevelAgreementInsertSchema = ServiceLevelAgreementSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ServiceLevelAgreementInsert = z.infer<typeof ServiceLevelAgreementInsertSchema>;
