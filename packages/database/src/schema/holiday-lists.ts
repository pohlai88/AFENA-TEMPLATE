import { desc, sql } from 'drizzle-orm';
import { check, date, index, integer, pgTable, primaryKey, text, unique, uuid } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Holiday Lists — holiday calendar definitions.
 * Source: holiday-lists.spec.json (adopted from ERPNext Holiday List).
 * Master entity for defining holiday calendars.
 */
export const holidayLists = pgTable(
  'holiday_lists',
  {
    ...erpEntityColumns,
    /** Holiday list name (unique per organization) */
    holidayListName: text('holiday_list_name').notNull(),
    /** Start date of holiday list period */
    fromDate: date('from_date').notNull(),
    /** End date of holiday list period */
    toDate: date('to_date').notNull(),
    /** Total number of holidays in this list */
    totalHolidays: integer('total_holidays').default(0).notNull(),
    /** Weekly off day (e.g., "Sunday", "Saturday") */
    weeklyOff: text('weekly_off'),
    /** Country this holiday list applies to. FK deferred: countries(id) */
    country: uuid('country'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    unique('holiday_lists_org_name_unique').on(table.orgId, table.holidayListName),
    index('holiday_lists_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    // Frequently queried: search holiday lists by name prefix
    index('holiday_lists_org_name_idx').on(table.orgId, table.holidayListName),
    // Frequently queried: filter by country
    index('holiday_lists_org_country_idx').on(table.orgId, table.country),
    check('holiday_lists_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type HolidayList = typeof holidayLists.$inferSelect;
export type NewHolidayList = typeof holidayLists.$inferInsert;
