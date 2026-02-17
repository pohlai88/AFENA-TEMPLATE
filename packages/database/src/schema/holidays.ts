import { desc, sql } from 'drizzle-orm';
import { boolean, check, date, index, pgTable, primaryKey, text, uuid } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

import { holidayLists } from './holiday-lists';

/**
 * Holidays — individual holiday entries.
 * Source: holidays.spec.json (adopted from ERPNext Holiday).
 * Line entity for holiday list items.
 */
export const holidays = pgTable(
  'holidays',
  {
    ...erpEntityColumns,
    /** Parent holiday list this holiday belongs to */
    parent: uuid('parent').notNull().references(() => holidayLists.id),
    /** Date of the holiday */
    holidayDate: date('holiday_date').notNull(),
    /** Holiday description/name (e.g., "Christmas", "New Year") */
    description: text('description').notNull(),
    /** Whether this is a weekly off day */
    weeklyOff: boolean('weekly_off').default(false).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    index('holidays_org_parent_idx').on(table.orgId, table.parent),
    index('holidays_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    // Frequently queried: find holidays by date range (calendar queries)
    index('holidays_org_date_idx').on(table.orgId, table.holidayDate),
    check('holidays_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type Holiday = typeof holidays.$inferSelect;
export type NewHoliday = typeof holidays.$inferInsert;
