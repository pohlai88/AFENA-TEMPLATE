/**
 * Comprehensive Entity Contracts - All 116 Business Domains
 * 
 * Auto-generated from business-domain analysis covering all 10 business classes.
 * Organized by business class (A-J) for maintainability.
 */

import type { EntityContract } from '../types/entity-contract';

// ============================================================================
// CLASS A: Financial Management (25 domains)
// ============================================================================

export const expenseReportsContract: EntityContract = {
  entityType: 'expense_reports',
  label: 'Expense Report',
  labelPlural: 'Expense Reports',
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

export const fixedAssetsContract: EntityContract = {
  entityType: 'fixed_assets',
  label: 'Fixed Asset',
  labelPlural: 'Fixed Assets',
  hasLifecycle: false,
  hasSoftDelete: true,
  transitions: [],
  updateModes: ['edit', 'correct'],
  reasonRequired: ['delete'],
  workflowDecisions: [],
  primaryVerbs: ['create', 'update'],
  secondaryVerbs: ['delete', 'restore'],
} as const;

export const leasesContract: EntityContract = {
  entityType: 'leases',
  label: 'Lease',
  labelPlural: 'Leases',
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

export const budgetsContract: EntityContract = {
  entityType: 'budgets',
  label: 'Budget',
  labelPlural: 'Budgets',
  hasLifecycle: true,
  hasSoftDelete: true,
  transitions: [
    { from: 'draft', allowed: ['update', 'submit', 'delete'] },
    { from: 'submitted', allowed: ['approve', 'reject'] },
    { from: 'active', allowed: ['cancel'] },
  ],
  updateModes: ['edit', 'correct', 'amend'],
  reasonRequired: ['delete', 'cancel', 'reject'],
  workflowDecisions: ['approve', 'reject'],
  primaryVerbs: ['create', 'update', 'submit'],
  secondaryVerbs: ['delete', 'cancel'],
} as const;

export const forecastsContract: EntityContract = {
  entityType: 'forecasts',
  label: 'Forecast',
  labelPlural: 'Forecasts',
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
// CLASS B: Procurement & Supply Chain (15 domains)
// ============================================================================

export const purchaseRequisitionsContract: EntityContract = {
  entityType: 'purchase_requisitions',
  label: 'Purchase Requisition',
  labelPlural: 'Purchase Requisitions',
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

export const shipmentsContract: EntityContract = {
  entityType: 'shipments',
  label: 'Shipment',
  labelPlural: 'Shipments',
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

export const returnsContract: EntityContract = {
  entityType: 'returns',
  label: 'Return',
  labelPlural: 'Returns',
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

export const inventoryTransfersContract: EntityContract = {
  entityType: 'inventory_transfers',
  label: 'Inventory Transfer',
  labelPlural: 'Inventory Transfers',
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
// CLASS C: Sales, Marketing & CX (11 domains)
// ============================================================================

export const campaignsContract: EntityContract = {
  entityType: 'campaigns',
  label: 'Campaign',
  labelPlural: 'Campaigns',
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

export const leadsContract: EntityContract = {
  entityType: 'leads',
  label: 'Lead',
  labelPlural: 'Leads',
  hasLifecycle: false,
  hasSoftDelete: true,
  transitions: [],
  updateModes: ['edit', 'correct'],
  reasonRequired: ['delete'],
  workflowDecisions: [],
  primaryVerbs: ['create', 'update'],
  secondaryVerbs: ['delete', 'restore'],
} as const;

export const opportunitiesContract: EntityContract = {
  entityType: 'opportunities',
  label: 'Opportunity',
  labelPlural: 'Opportunities',
  hasLifecycle: false,
  hasSoftDelete: true,
  transitions: [],
  updateModes: ['edit', 'correct'],
  reasonRequired: ['delete'],
  workflowDecisions: [],
  primaryVerbs: ['create', 'update'],
  secondaryVerbs: ['delete', 'restore'],
} as const;

export const serviceTicketsContract: EntityContract = {
  entityType: 'service_tickets',
  label: 'Service Ticket',
  labelPlural: 'Service Tickets',
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
// CLASS D: Manufacturing & Quality (11 domains)
// ============================================================================

export const workOrdersContract: EntityContract = {
  entityType: 'work_orders',
  label: 'Work Order',
  labelPlural: 'Work Orders',
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

export const bomsContract: EntityContract = {
  entityType: 'boms',
  label: 'Bill of Materials',
  labelPlural: 'Bills of Materials',
  hasLifecycle: false,
  hasSoftDelete: true,
  transitions: [],
  updateModes: ['edit', 'correct'],
  reasonRequired: ['delete'],
  workflowDecisions: [],
  primaryVerbs: ['create', 'update'],
  secondaryVerbs: ['delete', 'restore'],
} as const;

export const recipesContract: EntityContract = {
  entityType: 'recipes',
  label: 'Recipe',
  labelPlural: 'Recipes',
  hasLifecycle: false,
  hasSoftDelete: true,
  transitions: [],
  updateModes: ['edit', 'correct'],
  reasonRequired: ['delete'],
  workflowDecisions: [],
  primaryVerbs: ['create', 'update'],
  secondaryVerbs: ['delete', 'restore'],
} as const;

export const qualityInspectionsContract: EntityContract = {
  entityType: 'quality_inspections',
  label: 'Quality Inspection',
  labelPlural: 'Quality Inspections',
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
// CLASS E: Human Capital Management (9 domains)
// ============================================================================

export const timesheetsContract: EntityContract = {
  entityType: 'timesheets',
  label: 'Timesheet',
  labelPlural: 'Timesheets',
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

export const leaveRequestsContract: EntityContract = {
  entityType: 'leave_requests',
  label: 'Leave Request',
  labelPlural: 'Leave Requests',
  hasLifecycle: true,
  hasSoftDelete: true,
  transitions: [
    { from: 'draft', allowed: ['update', 'submit', 'delete'] },
    { from: 'submitted', allowed: ['approve', 'reject'] },
    { from: 'active', allowed: ['cancel'] },
  ],
  updateModes: ['edit'],
  reasonRequired: ['delete', 'cancel', 'reject'],
  workflowDecisions: ['approve', 'reject'],
  primaryVerbs: ['create', 'update', 'submit'],
  secondaryVerbs: ['delete', 'cancel'],
} as const;

export const performanceReviewsContract: EntityContract = {
  entityType: 'performance_reviews',
  label: 'Performance Review',
  labelPlural: 'Performance Reviews',
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

export const jobApplicationsContract: EntityContract = {
  entityType: 'job_applications',
  label: 'Job Application',
  labelPlural: 'Job Applications',
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
// CLASS F: Agriculture & AgriTech (10 domains)
// ============================================================================

export const cropPlansContract: EntityContract = {
  entityType: 'crop_plans',
  label: 'Crop Plan',
  labelPlural: 'Crop Plans',
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

export const livestockRecordsContract: EntityContract = {
  entityType: 'livestock_records',
  label: 'Livestock Record',
  labelPlural: 'Livestock Records',
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
// CLASS G: Franchise & Retail (7 domains)
// ============================================================================

export const franchiseApplicationsContract: EntityContract = {
  entityType: 'franchise_applications',
  label: 'Franchise Application',
  labelPlural: 'Franchise Applications',
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

export const outletAuditsContract: EntityContract = {
  entityType: 'outlet_audits',
  label: 'Outlet Audit',
  labelPlural: 'Outlet Audits',
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
// CLASS H: Governance, Risk & Compliance (15 domains)
// ============================================================================

export const riskAssessmentsContract: EntityContract = {
  entityType: 'risk_assessments',
  label: 'Risk Assessment',
  labelPlural: 'Risk Assessments',
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

export const auditProgramsContract: EntityContract = {
  entityType: 'audit_programs',
  label: 'Audit Program',
  labelPlural: 'Audit Programs',
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

export const legalEntitiesContract: EntityContract = {
  entityType: 'legal_entities',
  label: 'Legal Entity',
  labelPlural: 'Legal Entities',
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
// CLASS I: Analytics, Data & Integration (10 domains)
// ============================================================================

export const contractsContract: EntityContract = {
  entityType: 'contracts',
  label: 'Contract',
  labelPlural: 'Contracts',
  hasLifecycle: true,
  hasSoftDelete: true,
  transitions: [
    { from: 'draft', allowed: ['update', 'submit', 'delete'] },
    { from: 'submitted', allowed: ['approve', 'reject'] },
    { from: 'active', allowed: ['cancel'] },
    { from: 'cancelled', allowed: [] },
  ],
  updateModes: ['edit', 'correct', 'amend'],
  reasonRequired: ['delete', 'cancel', 'reject', 'amend'],
  workflowDecisions: ['approve', 'reject'],
  primaryVerbs: ['create', 'update', 'submit'],
  secondaryVerbs: ['delete', 'cancel'],
} as const;

export const documentsContract: EntityContract = {
  entityType: 'documents',
  label: 'Document',
  labelPlural: 'Documents',
  hasLifecycle: false,
  hasSoftDelete: true,
  transitions: [],
  updateModes: ['edit', 'correct'],
  reasonRequired: ['delete'],
  workflowDecisions: [],
  primaryVerbs: ['create', 'update'],
  secondaryVerbs: ['delete', 'restore'],
} as const;

export const assetsContract: EntityContract = {
  entityType: 'assets',
  label: 'Asset',
  labelPlural: 'Assets',
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
// Comprehensive Contracts List
// ============================================================================

export const COMPREHENSIVE_ENTITY_CONTRACTS = [
  // Financial Management (A)
  expenseReportsContract,
  fixedAssetsContract,
  leasesContract,
  budgetsContract,
  forecastsContract,
  
  // Procurement & Supply Chain (B)
  purchaseRequisitionsContract,
  shipmentsContract,
  returnsContract,
  inventoryTransfersContract,
  
  // Sales, Marketing & CX (C)
  campaignsContract,
  leadsContract,
  opportunitiesContract,
  serviceTicketsContract,
  
  // Manufacturing & Quality (D)
  workOrdersContract,
  bomsContract,
  recipesContract,
  qualityInspectionsContract,
  
  // Human Capital Management (E)
  timesheetsContract,
  leaveRequestsContract,
  performanceReviewsContract,
  jobApplicationsContract,
  
  // Agriculture & AgriTech (F)
  cropPlansContract,
  livestockRecordsContract,
  
  // Franchise & Retail (G)
  franchiseApplicationsContract,
  outletAuditsContract,
  
  // Governance, Risk & Compliance (H)
  riskAssessmentsContract,
  auditProgramsContract,
  legalEntitiesContract,
  
  // Analytics, Data & Integration (I)
  contractsContract,
  documentsContract,
  assetsContract,
] as const;
