import { sql } from 'drizzle-orm';
import { jsonb, uuid } from 'drizzle-orm/pg-core';

import { baseEntityColumns } from './base-entity';

/**
 * ERP entity columns — base without company/site scope.
 *
 * Adds:
 * - customData: JSONB blob for typed custom field values
 * 
 * RULE C-01: Do NOT auto-include company_id.
 * Use withCompanyScope() or withSiteScope() explicitly.
 */
export const erpEntityColumns = {
  ...baseEntityColumns,
  customData: jsonb('custom_data')
    .notNull()
    .default(sql`'{}'::jsonb`),
} as const;

/**
 * Company-scoped columns — explicit opt-in.
 * 
 * RULE C-01: Only add company_id if table meets one of:
 * - LEGAL: Legal ownership / statutory reporting
 * - OPERATIONS: Operational ownership (warehouse, inventory)
 * - ISSUER: Document numbering / issuer identity
 * 
 * Usage:
 *   { ...withCompanyScope({ scope: 'LEGAL' }), accountCode: text('code') }
 */
export const withCompanyScope = (opts: {
  scope: 'LEGAL' | 'OPERATIONS' | 'ISSUER';
  nullable?: boolean;
}) => ({
  ...erpEntityColumns,
  companyId: opts.nullable ? uuid('company_id') : uuid('company_id').notNull(),
}) as const;

/**
 * Site-scoped columns — explicit opt-in.
 * For inventory/operations that need physical site tracking.
 */
export const withSiteScope = (opts?: { nullable?: boolean }) => ({
  ...erpEntityColumns,
  siteId: opts?.nullable ? uuid('site_id') : uuid('site_id').notNull(),
}) as const;

/**
 * Company + Site scoped columns.
 * For inventory tables that need both dimensions.
 */
export const withCompanySiteScope = (opts: {
  companyScope: 'LEGAL' | 'OPERATIONS' | 'ISSUER';
  siteNullable?: boolean;
}) => ({
  ...erpEntityColumns,
  companyId: uuid('company_id').notNull(),
  siteId: opts.siteNullable ? uuid('site_id') : uuid('site_id').notNull(),
}) as const;
