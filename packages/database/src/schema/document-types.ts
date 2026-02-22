/**
 * Document Types Table
 *
 * Defines document types and their posting keys per company.
 * Controls number ranges (auto/manual), default posting keys,
 * and which GL accounts are affected.
 * GL Platform spine table — Phase 3, step 11.
 */
import { sql } from 'drizzle-orm';
import { boolean, check, index, jsonb, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core';

import { tenantPk } from '../helpers/base-entity';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const documentTypes = pgTable(
  'document_types',
  {
    ...erpEntityColumns,

    /** Short code for the doc type (e.g., 'SA' for standard journal, 'AP' for AP invoice) */
    docTypeCode: text('doc_type_code').notNull(),
    /** Human-readable name */
    name: text('name').notNull(),
    /** Category: 'journal', 'invoice', 'payment', 'receipt', 'memo', 'adjustment' */
    category: text('category').notNull(),
    /** Number range prefix (e.g., 'JE-', 'AP-') */
    numberPrefix: text('number_prefix'),
    /** Number allocation: 'auto' (sequential), 'manual', 'external' */
    numberAllocation: text('number_allocation').notNull().default('auto'),
    /** Default posting key config — maps line types to debit/credit accounts */
    postingKeys: jsonb('posting_keys')
      .notNull()
      .default(sql`'{}'::jsonb`),
    /** Whether reversals are allowed for this doc type */
    allowReversal: boolean('allow_reversal').notNull().default(true),
    /** Whether this doc type is active */
    isActive: boolean('is_active').notNull().default(true),
    /** Description / notes */
    description: text('description'),
  },
  (table) => [
    tenantPk(table),
    index('dt_org_id_idx').on(table.orgId, table.id),
    index('dt_org_created_idx').on(table.orgId, table.createdAt),
    // Lookup by company + doc type code
    index('dt_company_code_idx').on(table.orgId, table.companyId, table.docTypeCode),
    // Unique doc type code per company
    uniqueIndex('dt_unique_code_idx').on(table.orgId, table.companyId, table.docTypeCode),
    check('dt_org_not_empty', sql`org_id <> '00000000-0000-0000-0000-000000000000'::uuid`),
    check(
      'dt_valid_category',
      sql`category IN ('journal', 'invoice', 'payment', 'receipt', 'memo', 'adjustment')`,
    ),
    check('dt_valid_allocation', sql`number_allocation IN ('auto', 'manual', 'external')`),

    tenantPolicy(table),
  ],
);

export type DocumentType = typeof documentTypes.$inferSelect;
export type NewDocumentType = typeof documentTypes.$inferInsert;
