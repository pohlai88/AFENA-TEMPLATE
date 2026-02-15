/**
 * Company Composite FK Pattern — RULE C-02 enforcement
 * 
 * All tables with company_id must have composite FK to companies.
 * 
 * Standard pattern to copy-paste into table constraints:
 * 
 * ```typescript
 * import { companies } from './companies';
 * 
 * export const myTable = pgTable('my_table', {
 *   // ... columns including companyId
 * }, (table) => [
 *   primaryKey({ columns: [table.orgId, table.id] }),
 *   
 *   // Composite FK to companies
 *   foreignKey({
 *     columns: [table.orgId, table.companyId],
 *     foreignColumns: [companies.orgId, companies.id],
 *     name: 'my_table_company_fk',
 *   }),
 *   
 *   // Standard company-scoped index
 *   index('my_table_org_company_idx').on(table.orgId, table.companyId),
 *   
 *   // ... other constraints
 * ]);
 * ```
 * 
 * This ensures:
 * - company_id can only reference companies in the same org
 * - No cross-tenant data leakage
 * - Proper cascading on company deletion
 */
