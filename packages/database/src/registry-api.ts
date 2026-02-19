/**
 * Entity-to-Table Registry API (Phase 3)
 *
 * Provides a sealed surface for resolving Drizzle table objects from
 * entity type strings, replacing the duplicated `TABLE_REGISTRY` in
 * packages/crud/src/mutate.ts and any other packages that import
 * database schema directly by entity name.
 *
 * This is the SSOT for the entity-type → Drizzle table mapping.
 * CRUD (L3) must use `getTableForEntityType()` and never import
 * schema tables directly from afenda-database for this purpose.
 *
 * Adding a new entity:
 *   1. Create the schema file in src/schema/
 *   2. Export from src/schema/index.ts
 *   3. Add an entry to ENTITY_TABLE_MAP below
 *   4. Register in TABLE_REGISTRY in src/schema/_registry.ts
 */

import type { PgTable } from 'drizzle-orm/pg-core';

// Import all entity tables that CRUD needs to resolve dynamically.
// Add new tables here as they are added to the schema.
import { advisories } from './schema/advisories';
import { apiKeys } from './schema/api-keys';
import { assets } from './schema/assets';
import { auditPrograms } from './schema/audit-programs';
import { boms } from './schema/boms';
import { budgets } from './schema/budgets';
import { campaigns } from './schema/campaigns';
import { companies } from './schema/companies';
import { contacts } from './schema/contacts';
import { contracts } from './schema/contracts';
import { costCenters } from './schema/cost-centers';
import { cropPlans } from './schema/crop-plans';
import { currencies } from './schema/currencies';
import { currencyExchanges } from './schema/currency-exchanges';
import { customFields } from './schema/custom-fields';
import { customers } from './schema/customers';
import { deliveryNoteLines } from './schema/delivery-note-lines';
import { deliveryNotes } from './schema/delivery-notes';
import { documents } from './schema/documents';
import { employees } from './schema/employees';
import { entityVersions } from './schema/entity-versions';
import { expenseReports } from './schema/expense-reports';
import { fixedAssets } from './schema/fixed-assets';
import { forecasts } from './schema/forecasts';
import { franchiseApplications } from './schema/franchise-applications';
import { idempotencyKeys } from './schema/idempotency-keys';
import { inventoryTransfers } from './schema/inventory-transfers';
import { jobApplications } from './schema/job-applications';
import { leads } from './schema/leads';
import { leases } from './schema/leases';
import { leaveRequests } from './schema/leave-requests';
import { legalEntities } from './schema/legal-entities';
import { livestockRecords } from './schema/livestock-records';
import { mutationBatches } from './schema/mutation-batches';
import { numberSequences } from './schema/number-sequences';
import { opportunities } from './schema/opportunities';
import { outletAudits } from './schema/outlet-audits';
import { performanceReviews } from './schema/performance-reviews';
import { products } from './schema/products';
import { projects } from './schema/projects';
import { purchaseRequisitions } from './schema/purchase-requisitions';
import { qualityInspections } from './schema/quality-inspections';
import { recipes } from './schema/recipes';
import { returns } from './schema/returns';
import { riskAssessments } from './schema/risk-assessments';
import { serviceTickets } from './schema/service-tickets';
import { shipments } from './schema/shipments';
import { sites } from './schema/sites';
import { suppliers } from './schema/suppliers';
import { timesheets } from './schema/timesheets';
import { uom } from './schema/uom';
import { videoSettings } from './schema/video-settings';
import { warehouses } from './schema/warehouses';
import { webhookDeliveries } from './schema/webhook-deliveries';
import { webhookEndpoints } from './schema/webhook-endpoints';
import { workOrders } from './schema/work-orders';
import { workflowExecutions } from './schema/workflow-executions';
import { workflowRules } from './schema/workflow-rules';

/**
 * Canonical entity-type → Drizzle table map.
 *
 * Keys match the `entityRef.type` values used in `MutationSpec` and
 * the `TABLE_REGISTRY` keys in `schema/_registry.ts`.
 */
export const ENTITY_TABLE_MAP: Readonly<Record<string, PgTable>> = Object.freeze({
  advisories,
  'api-keys': apiKeys,
  assets,
  'audit-programs': auditPrograms,
  boms,
  budgets,
  campaigns,
  companies,
  contacts,
  contracts,
  'cost-centers': costCenters,
  'crop-plans': cropPlans,
  currencies,
  'currency-exchanges': currencyExchanges,
  'custom-fields': customFields,
  customers,
  'delivery-note-lines': deliveryNoteLines,
  'delivery-notes': deliveryNotes,
  documents,
  employees,
  'entity-versions': entityVersions,
  'expense-reports': expenseReports,
  'fixed-assets': fixedAssets,
  forecasts,
  'franchise-applications': franchiseApplications,
  'idempotency-keys': idempotencyKeys,
  'inventory-transfers': inventoryTransfers,
  'job-applications': jobApplications,
  leads,
  leases,
  'leave-requests': leaveRequests,
  'legal-entities': legalEntities,
  'livestock-records': livestockRecords,
  'mutation-batches': mutationBatches,
  'number-sequences': numberSequences,
  opportunities,
  'outlet-audits': outletAudits,
  'performance-reviews': performanceReviews,
  products,
  projects,
  'purchase-requisitions': purchaseRequisitions,
  'quality-inspections': qualityInspections,
  recipes,
  returns,
  'risk-assessments': riskAssessments,
  'service-tickets': serviceTickets,
  shipments,
  sites,
  suppliers,
  timesheets,
  uom,
  'video-settings': videoSettings,
  warehouses,
  'webhook-deliveries': webhookDeliveries,
  'webhook-endpoints': webhookEndpoints,
  'work-orders': workOrders,
  'workflow-executions': workflowExecutions,
  'workflow-rules': workflowRules,
});

/**
 * Resolve the Drizzle PgTable for a given entity type string.
 *
 * Throws a typed error if the entity type is not registered.
 * This is the canonical API — import from 'afenda-database', not from schema directly.
 *
 * @example
 *   const table = getTableForEntityType('contacts');
 *   await tx.insert(table).values({ ... });
 */
export function getTableForEntityType(entityType: string): PgTable {
  const table = ENTITY_TABLE_MAP[entityType];
  if (!table) {
    throw new Error(
      `[afenda-database] Unknown entity type: "${entityType}". ` +
      `Register it in ENTITY_TABLE_MAP in src/registry-api.ts.`,
    );
  }
  return table;
}

/**
 * Returns true if the entity type is registered in the CRUD table map.
 */
export function isKnownEntityType(entityType: string): boolean {
  return Object.prototype.hasOwnProperty.call(ENTITY_TABLE_MAP, entityType);
}

/**
 * List all registered entity type strings.
 * Useful for validation and CLI tooling.
 */
export function listEntityTypes(): readonly string[] {
  return Object.keys(ENTITY_TABLE_MAP);
}
