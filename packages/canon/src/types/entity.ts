/**
 * Entity type registry — extensible as new domain entities are added.
 * Each entity type maps to a database table and a set of namespaced actions.
 * 
 * Organized by category:
 * - Core: contacts, companies
 * - Transactional Documents: invoices, payments, sales_orders, purchase_orders, etc.
 * - Master Data: products, customers, suppliers, employees, etc.
 * - Configuration: currencies, uom, tax_codes, payment_terms
 */
export const ENTITY_TYPES = [
  // Core entities
  'companies',
  'contacts',

  // Transactional documents (full lifecycle)
  'budgets',
  'campaigns',
  'delivery_notes',
  'expense_reports',
  'forecasts',
  'franchise_applications',
  'goods_receipts',
  'inventory_transfers',
  'invoices',
  'journal_entries',
  'leave_requests',
  'leases',
  'outlet_audits',
  'payments',
  'performance_reviews',
  'purchase_invoices',
  'purchase_orders',
  'purchase_requisitions',
  'quality_inspections',
  'quotations',
  'returns',
  'sales_orders',
  'shipments',
  'timesheets',
  'work_orders',

  // Master data (no lifecycle, soft delete)
  'assets',
  'audit_programs',
  'boms',
  'contracts',
  'cost_centers',
  'crop_plans',
  'customers',
  'documents',
  'employees',
  'fixed_assets',
  'job_applications',
  'leads',
  'legal_entities',
  'livestock_records',
  'opportunities',
  'products',
  'projects',
  'recipes',
  'risk_assessments',
  'service_tickets',
  'sites',
  'suppliers',
  'warehouses',

  // Configuration/reference data (no lifecycle, no soft delete)
  'currencies',
  'payment_terms',
  'tax_codes',
  'uom',

  // @entity-gen:entity-types
] as const;
export type EntityType = (typeof ENTITY_TYPES)[number];

/**
 * Reference to a specific entity instance.
 * K-09: `id` is optional on create — kernel generates UUID.
 */
export interface EntityRef {
  type: EntityType;
  id?: string;
}

/**
 * Base fields present on every domain entity row.
 * Mirrors the `baseEntityColumns()` Drizzle helper output.
 */
export interface BaseEntity {
  id: string;
  orgId: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
  isDeleted: boolean;
  deletedAt: string | null;
  deletedBy: string | null;
}
