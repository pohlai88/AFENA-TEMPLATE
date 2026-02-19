/**
 * Entity Contracts SSOT
 * 
 * This is the single source of truth for all entity contracts.
 * Add new contracts to the ENTITY_CONTRACTS array.
 */

import type { EntityContract } from '../types/entity-contract';

export const companiesContract: EntityContract = {
  entityType: 'companies',
  label: 'Company',
  labelPlural: 'Companies',
  hasLifecycle: true,
  hasSoftDelete: true,
  transitions: [
    {
      from: 'draft',
      allowed: ['update', 'submit', 'delete'],
    },
    {
      from: 'submitted',
      allowed: ['approve', 'reject', 'cancel'],
    },
    {
      from: 'active',
      allowed: ['update', 'cancel'],
    },
    {
      from: 'cancelled',
      allowed: ['restore'],
    },
    {
      from: 'amended',
      allowed: ['update', 'submit'],
    },
  ],
  updateModes: ['edit', 'correct', 'amend'],
  reasonRequired: ['delete', 'cancel', 'reject'],
  workflowDecisions: ['approve', 'reject'],
  primaryVerbs: ['create', 'update', 'submit'],
  secondaryVerbs: ['delete', 'cancel', 'restore'],
} as const;

export const contactsContract: EntityContract = {
  entityType: 'contacts',
  label: 'Contact',
  labelPlural: 'Contacts',
  hasLifecycle: false,
  hasSoftDelete: true,
  transitions: [],
  updateModes: ['edit', 'correct'],
  reasonRequired: ['delete'],
  workflowDecisions: [],
  primaryVerbs: ['create', 'update'],
  secondaryVerbs: ['delete', 'restore'],
} as const;

export const invoicesContract: EntityContract = {
  entityType: 'invoices',
  label: 'Invoice',
  labelPlural: 'Invoices',
  hasLifecycle: true,
  hasSoftDelete: true,
  transitions: [
    {
      from: 'draft',
      allowed: ['update', 'submit', 'delete'],
    },
    {
      from: 'submitted',
      allowed: ['approve', 'reject', 'cancel'],
    },
    {
      from: 'active',
      allowed: ['cancel'],
    },
    {
      from: 'cancelled',
      allowed: ['restore'],
    },
  ],
  updateModes: ['edit', 'correct', 'amend'],
  reasonRequired: ['delete', 'cancel', 'reject'],
  workflowDecisions: ['approve', 'reject'],
  primaryVerbs: ['create', 'update', 'submit'],
  secondaryVerbs: ['delete', 'cancel', 'restore'],
} as const;

export const paymentsContract: EntityContract = {
  entityType: 'payments',
  label: 'Payment',
  labelPlural: 'Payments',
  hasLifecycle: true,
  hasSoftDelete: true,
  transitions: [
    {
      from: 'draft',
      allowed: ['update', 'submit', 'delete'],
    },
    {
      from: 'submitted',
      allowed: ['approve', 'reject'],
    },
    {
      from: 'active',
      allowed: ['cancel'],
    },
    {
      from: 'cancelled',
      allowed: [],
    },
  ],
  updateModes: ['edit', 'correct'],
  reasonRequired: ['delete', 'cancel', 'reject'],
  workflowDecisions: ['approve', 'reject'],
  primaryVerbs: ['create', 'update', 'submit'],
  secondaryVerbs: ['delete', 'cancel'],
} as const;

export const salesOrdersContract: EntityContract = {
  entityType: 'sales_orders',
  label: 'Sales Order',
  labelPlural: 'Sales Orders',
  hasLifecycle: true,
  hasSoftDelete: true,
  transitions: [
    {
      from: 'draft',
      allowed: ['update', 'submit', 'delete'],
    },
    {
      from: 'submitted',
      allowed: ['approve', 'reject', 'cancel'],
    },
    {
      from: 'active',
      allowed: ['update', 'cancel'],
    },
    {
      from: 'cancelled',
      allowed: ['restore'],
    },
    {
      from: 'amended',
      allowed: ['update', 'submit'],
    },
  ],
  updateModes: ['edit', 'correct', 'amend'],
  reasonRequired: ['delete', 'cancel', 'reject', 'amend'],
  workflowDecisions: ['approve', 'reject'],
  primaryVerbs: ['create', 'update', 'submit'],
  secondaryVerbs: ['delete', 'cancel', 'restore'],
} as const;

// Import generated contracts (initial batch)
import {
  costCentersContract,
  currenciesContract,
  customersContract,
  deliveryNotesContract,
  employeesContract,
  GENERATED_ENTITY_CONTRACTS,
  goodsReceiptsContract,
  journalEntriesContract,
  paymentTermsContract,
  productsContract,
  projectsContract,
  purchaseInvoicesContract,
  purchaseOrdersContract,
  quotationsContract,
  sitesContract,
  suppliersContract,
  taxCodesContract,
  uomContract,
  warehousesContract,
} from './entity-contracts-generated.data';

// Import comprehensive contracts (all 116 business domains)
import {
  assetsContract,
  auditProgramsContract,
  bomsContract,
  budgetsContract,
  campaignsContract,
  COMPREHENSIVE_ENTITY_CONTRACTS,
  contractsContract,
  cropPlansContract,
  documentsContract,
  expenseReportsContract,
  fixedAssetsContract,
  forecastsContract,
  franchiseApplicationsContract,
  inventoryTransfersContract,
  jobApplicationsContract,
  leadsContract,
  leasesContract,
  leaveRequestsContract,
  legalEntitiesContract,
  livestockRecordsContract,
  opportunitiesContract,
  outletAuditsContract,
  performanceReviewsContract,
  purchaseRequisitionsContract,
  qualityInspectionsContract,
  recipesContract,
  returnsContract,
  riskAssessmentsContract,
  serviceTicketsContract,
  shipmentsContract,
  timesheetsContract,
  workOrdersContract,
} from './entity-contracts-comprehensive.data';

/**
 * SSOT list of all entity contracts.
 * Combines manual, generated, and comprehensive contracts covering all 116 business domains.
 */
export const ENTITY_CONTRACTS = [
  // Manual contracts (core business entities)
  companiesContract,
  contactsContract,
  invoicesContract,
  paymentsContract,
  salesOrdersContract,

  // Auto-generated contracts (initial batch)
  ...GENERATED_ENTITY_CONTRACTS,

  // Comprehensive contracts (all 116 business domains)
  ...COMPREHENSIVE_ENTITY_CONTRACTS,
] as const;

// Re-export all contracts for direct access
export {

  // Comprehensive contracts
  assetsContract,
  auditProgramsContract,
  bomsContract,
  budgetsContract,
  campaignsContract,
  contractsContract,
  // Initial generated contracts
  costCentersContract, cropPlansContract, currenciesContract,
  customersContract,
  deliveryNotesContract, documentsContract, employeesContract, expenseReportsContract,
  fixedAssetsContract,
  forecastsContract,
  franchiseApplicationsContract, goodsReceiptsContract, inventoryTransfersContract,
  jobApplicationsContract, journalEntriesContract, leadsContract,
  leasesContract,
  leaveRequestsContract,
  legalEntitiesContract,
  livestockRecordsContract,
  opportunitiesContract,
  outletAuditsContract, paymentTermsContract, performanceReviewsContract, productsContract,
  projectsContract,
  purchaseInvoicesContract,
  purchaseOrdersContract, purchaseRequisitionsContract,
  qualityInspectionsContract, quotationsContract, recipesContract,
  returnsContract,
  riskAssessmentsContract,
  serviceTicketsContract,
  shipmentsContract, sitesContract,
  suppliersContract,
  taxCodesContract, timesheetsContract, uomContract,
  warehousesContract, workOrdersContract
};

