import { sql } from 'drizzle-orm';
import { check, index, jsonb, pgTable, text } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const leads = pgTable(
  'leads',
  {
    ...erpEntityColumns,
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    email: text('email'),
    phone: text('phone'),
    company: text('company'),
    title: text('title'),
    source: text('source'),
    status: text('status').notNull().default('new'),
    assignedTo: text('assigned_to'),
    contactInfo: jsonb('contact_info').notNull().default(sql`'{}'::jsonb`),
  },
  (table) => [
    index('leads_org_id_idx').on(table.orgId, table.id),
    index('leads_org_email_idx').on(table.orgId, table.email),
    index('leads_org_created_idx').on(table.orgId, table.createdAt),
    check('leads_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
