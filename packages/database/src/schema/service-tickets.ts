import { sql } from 'drizzle-orm';
import { check, index, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const serviceTickets = pgTable(
  'service_tickets',
  {
    ...erpEntityColumns,

    ticketNumber: text('ticket_number').notNull(),
    subject: text('subject').notNull(),
    description: text('description'),
    priority: text('priority').notNull().default('medium'),
    status: text('status').notNull().default('open'),
    category: text('category'),
    assignedTo: text('assigned_to'),
    customerId: uuid('customer_id'),
    resolution: text('resolution'),
  },
  (table) => [
    tenantPk(table),
    index('service_tickets_org_id_idx').on(table.orgId, table.id),
    index('service_tickets_org_created_idx').on(table.orgId, table.createdAt),
    check('service_tickets_org_not_empty', sql`org_id <> ''`),

    tenantPolicy(table),
  ],
);

export type ServiceTicket = typeof serviceTickets.$inferSelect;
export type NewServiceTicket = typeof serviceTickets.$inferInsert;
