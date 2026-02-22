/**
 * Auto-Generated Entity Contracts
 * 
 * Generated from business-domain analysis and database schema.
 * Organized by business class for maintainability.
 */

import type { EntityContract } from '../types/entity-contract';

// ============================================================================
// CLASS A: Financial Management (Transactional Documents)
// ============================================================================

export const purchaseOrdersContract: EntityContract = {
  entityType: 'purchase_orders',
  label: 'Purchase Order',
  labelPlural: 'Purchase Orders',
  hasLifecycle: true,
  hasSoftDelete: true,
  transitions: [
    { from: 'draft', allowed: ['update', 'submit', 'delete'] },
    { from: 'submitted', allowed: ['approve', 'reject', 'cancel'] },
    { from: 'active', allowed: ['update', 'cancel'] },
    { from: 'cancelled', allowed: ['restore'] },
    { from: 'amended', allowed: ['update', 'submit'] },
  ],
  updateModes: ['edit', 'correct', 'amend'],
  reasonRequired: ['delete', 'cancel', 'reject', 'amend'],
  workflowDecisions: ['approve', 'reject'],
  primaryVerbs: ['create', 'update', 'submit'],
  secondaryVerbs: ['delete', 'cancel', 'restore'],
} as const;

export const goodsReceiptsContract: EntityContract = {
  entityType: 'goods_receipts',
  label: 'Goods Receipt',
  labelPlural: 'Goods Receipts',
  hasLifecycle: true,
  hasSoftDelete: true,
  transitions: [
    { from: 'draft', allowed: ['update', 'submit', 'delete'] },
    { from: 'submitted', allowed: ['approve', 'reject'] },
    { from: 'active', allowed: ['cancel'] },
    { from: 'cancelled', allowed: [] },
  ],
  updateModes: ['edit', 'correct'],
  reasonRequired: ['delete', 'cancel', 'reject'],
  workflowDecisions: ['approve', 'reject'],
  primaryVerbs: ['create', 'update', 'submit'],
  secondaryVerbs: ['delete', 'cancel'],
} as const;

export const purchaseInvoicesContract: EntityContract = {
  entityType: 'purchase_invoices',
  label: 'Purchase Invoice',
  labelPlural: 'Purchase Invoices',
  hasLifecycle: true,
  hasSoftDelete: true,
  transitions: [
    { from: 'draft', allowed: ['update', 'submit', 'delete'] },
    { from: 'submitted', allowed: ['approve', 'reject', 'cancel'] },
    { from: 'active', allowed: ['cancel'] },
    { from: 'cancelled', allowed: [] },
  ],
  updateModes: ['edit', 'correct'],
  reasonRequired: ['delete', 'cancel', 'reject'],
  workflowDecisions: ['approve', 'reject'],
  primaryVerbs: ['create', 'update', 'submit'],
  secondaryVerbs: ['delete', 'cancel'],
} as const;

export const deliveryNotesContract: EntityContract = {
  entityType: 'delivery_notes',
  label: 'Delivery Note',
  labelPlural: 'Delivery Notes',
  hasLifecycle: true,
  hasSoftDelete: true,
  transitions: [
    { from: 'draft', allowed: ['update', 'submit', 'delete'] },
    { from: 'submitted', allowed: ['approve', 'reject'] },
    { from: 'active', allowed: ['cancel'] },
    { from: 'cancelled', allowed: [] },
  ],
  updateModes: ['edit', 'correct'],
  reasonRequired: ['delete', 'cancel', 'reject'],
  workflowDecisions: ['approve', 'reject'],
  primaryVerbs: ['create', 'update', 'submit'],
  secondaryVerbs: ['delete', 'cancel'],
} as const;

export const quotationsContract: EntityContract = {
  entityType: 'quotations',
  label: 'Quotation',
  labelPlural: 'Quotations',
  hasLifecycle: true,
  hasSoftDelete: true,
  transitions: [
    { from: 'draft', allowed: ['update', 'submit', 'delete'] },
    { from: 'submitted', allowed: ['approve', 'reject', 'cancel'] },
    { from: 'active', allowed: ['update', 'cancel'] },
    { from: 'cancelled', allowed: ['restore'] },
  ],
  updateModes: ['edit', 'correct'],
  reasonRequired: ['delete', 'cancel', 'reject'],
  workflowDecisions: ['approve', 'reject'],
  primaryVerbs: ['create', 'update', 'submit'],
  secondaryVerbs: ['delete', 'cancel', 'restore'],
} as const;

export const journalEntriesContract: EntityContract = {
  entityType: 'journal_entries',
  label: 'Journal Entry',
  labelPlural: 'Journal Entries',
  hasLifecycle: true,
  hasSoftDelete: true,
  transitions: [
    { from: 'draft', allowed: ['update', 'submit', 'delete'] },
    { from: 'submitted', allowed: ['approve', 'reject'] },
    { from: 'active', allowed: [] },
  ],
  updateModes: ['edit', 'correct'],
  reasonRequired: ['delete', 'reject'],
  workflowDecisions: ['approve', 'reject'],
  primaryVerbs: ['create', 'update', 'submit'],
  secondaryVerbs: ['delete'],
} as const;

// ============================================================================
// CLASS B: Master Data (No Lifecycle)
// ============================================================================

export const productsContract: EntityContract = {
  entityType: 'products',
  label: 'Product',
  labelPlural: 'Products',
  hasLifecycle: false,
  hasSoftDelete: true,
  transitions: [],
  updateModes: ['edit', 'correct'],
  reasonRequired: ['delete'],
  workflowDecisions: [],
  primaryVerbs: ['create', 'update'],
  secondaryVerbs: ['delete', 'restore'],
} as const;

export const customersContract: EntityContract = {
  entityType: 'customers',
  label: 'Customer',
  labelPlural: 'Customers',
  hasLifecycle: false,
  hasSoftDelete: true,
  transitions: [],
  updateModes: ['edit', 'correct'],
  reasonRequired: ['delete'],
  workflowDecisions: [],
  primaryVerbs: ['create', 'update'],
  secondaryVerbs: ['delete', 'restore'],
} as const;

export const suppliersContract: EntityContract = {
  entityType: 'suppliers',
  label: 'Supplier',
  labelPlural: 'Suppliers',
  hasLifecycle: false,
  hasSoftDelete: true,
  transitions: [],
  updateModes: ['edit', 'correct'],
  reasonRequired: ['delete'],
  workflowDecisions: [],
  primaryVerbs: ['create', 'update'],
  secondaryVerbs: ['delete', 'restore'],
} as const;

export const employeesContract: EntityContract = {
  entityType: 'employees',
  label: 'Employee',
  labelPlural: 'Employees',
  hasLifecycle: false,
  hasSoftDelete: true,
  transitions: [],
  updateModes: ['edit', 'correct'],
  reasonRequired: ['delete'],
  workflowDecisions: [],
  primaryVerbs: ['create', 'update'],
  secondaryVerbs: ['delete', 'restore'],
} as const;

export const sitesContract: EntityContract = {
  entityType: 'sites',
  label: 'Site',
  labelPlural: 'Sites',
  hasLifecycle: false,
  hasSoftDelete: true,
  transitions: [],
  updateModes: ['edit', 'correct'],
  reasonRequired: ['delete'],
  workflowDecisions: [],
  primaryVerbs: ['create', 'update'],
  secondaryVerbs: ['delete', 'restore'],
} as const;

export const warehousesContract: EntityContract = {
  entityType: 'warehouses',
  label: 'Warehouse',
  labelPlural: 'Warehouses',
  hasLifecycle: false,
  hasSoftDelete: true,
  transitions: [],
  updateModes: ['edit', 'correct'],
  reasonRequired: ['delete'],
  workflowDecisions: [],
  primaryVerbs: ['create', 'update'],
  secondaryVerbs: ['delete', 'restore'],
} as const;

export const projectsContract: EntityContract = {
  entityType: 'projects',
  label: 'Project',
  labelPlural: 'Projects',
  hasLifecycle: false,
  hasSoftDelete: true,
  transitions: [],
  updateModes: ['edit', 'correct'],
  reasonRequired: ['delete'],
  workflowDecisions: [],
  primaryVerbs: ['create', 'update'],
  secondaryVerbs: ['delete', 'restore'],
} as const;

export const costCentersContract: EntityContract = {
  entityType: 'cost_centers',
  label: 'Cost Center',
  labelPlural: 'Cost Centers',
  hasLifecycle: false,
  hasSoftDelete: true,
  transitions: [],
  updateModes: ['edit', 'correct'],
  reasonRequired: ['delete'],
  workflowDecisions: [],
  primaryVerbs: ['create', 'update'],
  secondaryVerbs: ['delete', 'restore'],
} as const;

// ============================================================================
// CLASS C: Configuration/Reference Data (No Lifecycle, No Soft Delete)
// ============================================================================

export const currenciesContract: EntityContract = {
  entityType: 'currencies',
  label: 'Currency',
  labelPlural: 'Currencies',
  hasLifecycle: false,
  hasSoftDelete: false,
  transitions: [],
  updateModes: ['edit'],
  reasonRequired: [],
  workflowDecisions: [],
  primaryVerbs: ['create', 'update'],
  secondaryVerbs: [],
} as const;

export const uomContract: EntityContract = {
  entityType: 'uom',
  label: 'Unit of Measure',
  labelPlural: 'Units of Measure',
  hasLifecycle: false,
  hasSoftDelete: false,
  transitions: [],
  updateModes: ['edit'],
  reasonRequired: [],
  workflowDecisions: [],
  primaryVerbs: ['create', 'update'],
  secondaryVerbs: [],
} as const;

export const taxCodesContract: EntityContract = {
  entityType: 'tax_codes',
  label: 'Tax Code',
  labelPlural: 'Tax Codes',
  hasLifecycle: false,
  hasSoftDelete: false,
  transitions: [],
  updateModes: ['edit'],
  reasonRequired: [],
  workflowDecisions: [],
  primaryVerbs: ['create', 'update'],
  secondaryVerbs: [],
} as const;

export const paymentTermsContract: EntityContract = {
  entityType: 'payment_terms',
  label: 'Payment Terms',
  labelPlural: 'Payment Terms',
  hasLifecycle: false,
  hasSoftDelete: false,
  transitions: [],
  updateModes: ['edit'],
  reasonRequired: [],
  workflowDecisions: [],
  primaryVerbs: ['create', 'update'],
  secondaryVerbs: [],
} as const;

// ============================================================================
// Generated Contracts List
// ============================================================================
// Note: invoices, payments, and sales_orders are defined manually in entity-contracts.data.ts

export const GENERATED_ENTITY_CONTRACTS = [
  // Transactional Documents (Full Lifecycle)
  purchaseOrdersContract,
  goodsReceiptsContract,
  purchaseInvoicesContract,
  deliveryNotesContract,
  quotationsContract,
  journalEntriesContract,

  // Master Data (No Lifecycle, Soft Delete)
  productsContract,
  customersContract,
  suppliersContract,
  employeesContract,
  sitesContract,
  warehousesContract,
  projectsContract,
  costCentersContract,

  // Configuration/Reference (No Lifecycle, No Soft Delete)
  currenciesContract,
  uomContract,
  taxCodesContract,
  paymentTermsContract,
] as const;
