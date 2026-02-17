import { sql } from 'drizzle-orm';
import { jsonb, uuid } from 'drizzle-orm/pg-core';

import { baseEntityColumns } from './base-entity';

/**
 * ERP entity columns — superset of baseEntityColumns.
 *
 * Adds:
 * - companyId: optional FK → companies.id (required for accounting modules)
 * - siteId: optional FK → sites.id (required for inventory modules)
 * - customData: JSONB blob for typed custom field values
 */
export const erpEntityColumns = {
  ...baseEntityColumns,
  companyId: uuid('company_id'),
  siteId: uuid('site_id'),
  customData: jsonb('custom_data')
    .notNull()
    .default(sql`'{}'::jsonb`),
} as const;
