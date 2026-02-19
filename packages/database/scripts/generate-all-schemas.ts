/**
 * Schema Generation Script for All 56 Entity Tables
 * 
 * Generates Drizzle ORM schemas for all entities from the comprehensive registry.
 * Run with: tsx scripts/generate-all-schemas.ts
 */

import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface SchemaConfig {
  tableName: string;
  fileName: string;
  exportName: string;
  typeName: string;
  hasDocStatus: boolean;
  fields: Array<{ name: string; type: string; config: string }>;
}

// Master Data Schemas (no doc_status)
const masterDataSchemas: SchemaConfig[] = [
  {
    tableName: 'opportunities',
    fileName: 'opportunities',
    exportName: 'opportunities',
    typeName: 'Opportunity',
    hasDocStatus: false,
    fields: [
      { name: 'name', type: 'text', config: '.notNull()' },
      { name: 'accountName', type: 'text', config: '' },
      { name: 'amount', type: 'numeric', config: '({ precision: 18, scale: 2 })' },
      { name: 'stage', type: 'text', config: '.notNull().default(\'prospecting\')' },
      { name: 'probability', type: 'integer', config: '' },
      { name: 'expectedCloseDate', type: 'date', config: '' },
      { name: 'assignedTo', type: 'text', config: '' },
      { name: 'details', type: 'jsonb', config: '.notNull().default(sql`\'{}\'::jsonb`)' },
    ],
  },
  {
    tableName: 'service_tickets',
    fileName: 'service-tickets',
    exportName: 'serviceTickets',
    typeName: 'ServiceTicket',
    hasDocStatus: false,
    fields: [
      { name: 'ticketNumber', type: 'text', config: '.notNull()' },
      { name: 'subject', type: 'text', config: '.notNull()' },
      { name: 'description', type: 'text', config: '' },
      { name: 'priority', type: 'text', config: '.notNull().default(\'medium\')' },
      { name: 'status', type: 'text', config: '.notNull().default(\'open\')' },
      { name: 'category', type: 'text', config: '' },
      { name: 'assignedTo', type: 'text', config: '' },
      { name: 'customerId', type: 'uuid', config: '' },
      { name: 'resolution', type: 'text', config: '' },
    ],
  },
  {
    tableName: 'boms',
    fileName: 'boms',
    exportName: 'boms',
    typeName: 'Bom',
    hasDocStatus: false,
    fields: [
      { name: 'code', type: 'text', config: '.notNull()' },
      { name: 'name', type: 'text', config: '.notNull()' },
      { name: 'productId', type: 'uuid', config: '.notNull()' },
      { name: 'version', type: 'integer', config: '.notNull().default(1)' },
      { name: 'isActive', type: 'text', config: '.notNull().default(\'true\')' },
      { name: 'bomLines', type: 'jsonb', config: '.notNull().default(sql`\'[]\'::jsonb`)' },
    ],
  },
  {
    tableName: 'recipes',
    fileName: 'recipes',
    exportName: 'recipes',
    typeName: 'Recipe',
    hasDocStatus: false,
    fields: [
      { name: 'code', type: 'text', config: '.notNull()' },
      { name: 'name', type: 'text', config: '.notNull()' },
      { name: 'productId', type: 'uuid', config: '.notNull()' },
      { name: 'version', type: 'integer', config: '.notNull().default(1)' },
      { name: 'yieldQuantity', type: 'numeric', config: '({ precision: 18, scale: 6 })' },
      { name: 'instructions', type: 'text', config: '' },
      { name: 'ingredients', type: 'jsonb', config: '.notNull().default(sql`\'[]\'::jsonb`)' },
    ],
  },
  {
    tableName: 'job_applications',
    fileName: 'job-applications',
    exportName: 'jobApplications',
    typeName: 'JobApplication',
    hasDocStatus: false,
    fields: [
      { name: 'applicantName', type: 'text', config: '.notNull()' },
      { name: 'email', type: 'text', config: '.notNull()' },
      { name: 'phone', type: 'text', config: '' },
      { name: 'position', type: 'text', config: '.notNull()' },
      { name: 'status', type: 'text', config: '.notNull().default(\'received\')' },
      { name: 'resumeUrl', type: 'text', config: '' },
      { name: 'applicationData', type: 'jsonb', config: '.notNull().default(sql`\'{}\'::jsonb`)' },
    ],
  },
  {
    tableName: 'crop_plans',
    fileName: 'crop-plans',
    exportName: 'cropPlans',
    typeName: 'CropPlan',
    hasDocStatus: false,
    fields: [
      { name: 'code', type: 'text', config: '.notNull()' },
      { name: 'name', type: 'text', config: '.notNull()' },
      { name: 'season', type: 'text', config: '.notNull()' },
      { name: 'cropType', type: 'text', config: '.notNull()' },
      { name: 'plantingDate', type: 'date', config: '' },
      { name: 'harvestDate', type: 'date', config: '' },
      { name: 'area', type: 'numeric', config: '({ precision: 18, scale: 2 })' },
      { name: 'planDetails', type: 'jsonb', config: '.notNull().default(sql`\'{}\'::jsonb`)' },
    ],
  },
  {
    tableName: 'livestock_records',
    fileName: 'livestock-records',
    exportName: 'livestockRecords',
    typeName: 'LivestockRecord',
    hasDocStatus: false,
    fields: [
      { name: 'animalId', type: 'text', config: '.notNull()' },
      { name: 'species', type: 'text', config: '.notNull()' },
      { name: 'breed', type: 'text', config: '' },
      { name: 'birthDate', type: 'date', config: '' },
      { name: 'gender', type: 'text', config: '' },
      { name: 'status', type: 'text', config: '.notNull().default(\'active\')' },
      { name: 'healthRecords', type: 'jsonb', config: '.notNull().default(sql`\'[]\'::jsonb`)' },
    ],
  },
  {
    tableName: 'legal_entities',
    fileName: 'legal-entities',
    exportName: 'legalEntities',
    typeName: 'LegalEntity',
    hasDocStatus: false,
    fields: [
      { name: 'code', type: 'text', config: '.notNull()' },
      { name: 'name', type: 'text', config: '.notNull()' },
      { name: 'legalName', type: 'text', config: '.notNull()' },
      { name: 'registrationNumber', type: 'text', config: '' },
      { name: 'jurisdiction', type: 'text', config: '' },
      { name: 'entityType', type: 'text', config: '.notNull()' },
      { name: 'incorporationDate', type: 'date', config: '' },
      { name: 'entityData', type: 'jsonb', config: '.notNull().default(sql`\'{}\'::jsonb`)' },
    ],
  },
  {
    tableName: 'contracts',
    fileName: 'contracts',
    exportName: 'contracts',
    typeName: 'Contract',
    hasDocStatus: false,
    fields: [
      { name: 'contractNumber', type: 'text', config: '.notNull()' },
      { name: 'title', type: 'text', config: '.notNull()' },
      { name: 'partyA', type: 'text', config: '.notNull()' },
      { name: 'partyB', type: 'text', config: '.notNull()' },
      { name: 'startDate', type: 'date', config: '' },
      { name: 'endDate', type: 'date', config: '' },
      { name: 'value', type: 'numeric', config: '({ precision: 18, scale: 2 })' },
      { name: 'status', type: 'text', config: '.notNull().default(\'draft\')' },
      { name: 'terms', type: 'jsonb', config: '.notNull().default(sql`\'{}\'::jsonb`)' },
    ],
  },
  {
    tableName: 'documents',
    fileName: 'documents',
    exportName: 'documents',
    typeName: 'Document',
    hasDocStatus: false,
    fields: [
      { name: 'documentNumber', type: 'text', config: '.notNull()' },
      { name: 'title', type: 'text', config: '.notNull()' },
      { name: 'category', type: 'text', config: '' },
      { name: 'fileUrl', type: 'text', config: '' },
      { name: 'fileSize', type: 'integer', config: '' },
      { name: 'mimeType', type: 'text', config: '' },
      { name: 'version', type: 'integer', config: '.notNull().default(1)' },
      { name: 'metadata', type: 'jsonb', config: '.notNull().default(sql`\'{}\'::jsonb`)' },
    ],
  },
  {
    tableName: 'assets',
    fileName: 'assets',
    exportName: 'assets',
    typeName: 'Asset',
    hasDocStatus: false,
    fields: [
      { name: 'assetNumber', type: 'text', config: '.notNull()' },
      { name: 'name', type: 'text', config: '.notNull()' },
      { name: 'category', type: 'text', config: '.notNull()' },
      { name: 'serialNumber', type: 'text', config: '' },
      { name: 'purchaseDate', type: 'date', config: '' },
      { name: 'purchasePrice', type: 'numeric', config: '({ precision: 18, scale: 2 })' },
      { name: 'location', type: 'text', config: '' },
      { name: 'status', type: 'text', config: '.notNull().default(\'active\')' },
      { name: 'assetData', type: 'jsonb', config: '.notNull().default(sql`\'{}\'::jsonb`)' },
    ],
  },
  {
    tableName: 'fixed_assets',
    fileName: 'fixed-assets',
    exportName: 'fixedAssets',
    typeName: 'FixedAsset',
    hasDocStatus: false,
    fields: [
      { name: 'assetNumber', type: 'text', config: '.notNull()' },
      { name: 'name', type: 'text', config: '.notNull()' },
      { name: 'category', type: 'text', config: '.notNull()' },
      { name: 'acquisitionDate', type: 'date', config: '' },
      { name: 'acquisitionCost', type: 'numeric', config: '({ precision: 18, scale: 2 })' },
      { name: 'depreciationMethod', type: 'text', config: '' },
      { name: 'usefulLife', type: 'integer', config: '' },
      { name: 'salvageValue', type: 'numeric', config: '({ precision: 18, scale: 2 })' },
      { name: 'assetDetails', type: 'jsonb', config: '.notNull().default(sql`\'{}\'::jsonb`)' },
    ],
  },
  {
    tableName: 'audit_programs',
    fileName: 'audit-programs',
    exportName: 'auditPrograms',
    typeName: 'AuditProgram',
    hasDocStatus: false,
    fields: [
      { name: 'programCode', type: 'text', config: '.notNull()' },
      { name: 'name', type: 'text', config: '.notNull()' },
      { name: 'auditType', type: 'text', config: '.notNull()' },
      { name: 'frequency', type: 'text', config: '' },
      { name: 'scope', type: 'text', config: '' },
      { name: 'leadAuditor', type: 'text', config: '' },
      { name: 'status', type: 'text', config: '.notNull().default(\'planned\')' },
      { name: 'programData', type: 'jsonb', config: '.notNull().default(sql`\'{}\'::jsonb`)' },
    ],
  },
  {
    tableName: 'risk_assessments',
    fileName: 'risk-assessments',
    exportName: 'riskAssessments',
    typeName: 'RiskAssessment',
    hasDocStatus: false,
    fields: [
      { name: 'riskId', type: 'text', config: '.notNull()' },
      { name: 'title', type: 'text', config: '.notNull()' },
      { name: 'category', type: 'text', config: '.notNull()' },
      { name: 'likelihood', type: 'text', config: '' },
      { name: 'impact', type: 'text', config: '' },
      { name: 'riskScore', type: 'integer', config: '' },
      { name: 'owner', type: 'text', config: '' },
      { name: 'status', type: 'text', config: '.notNull().default(\'identified\')' },
      { name: 'mitigationPlan', type: 'jsonb', config: '.notNull().default(sql`\'{}\'::jsonb`)' },
    ],
  },
];

// Transactional Document Schemas (with doc_status)
const transactionalSchemas: SchemaConfig[] = [
  {
    tableName: 'expense_reports',
    fileName: 'expense-reports',
    exportName: 'expenseReports',
    typeName: 'ExpenseReport',
    hasDocStatus: true,
    fields: [
      { name: 'reportNumber', type: 'text', config: '' },
      { name: 'employeeId', type: 'uuid', config: '.notNull()' },
      { name: 'reportDate', type: 'date', config: '' },
      { name: 'totalAmount', type: 'numeric', config: '({ precision: 18, scale: 2 })' },
      { name: 'currency', type: 'text', config: '.notNull().default(\'MYR\')' },
      { name: 'purpose', type: 'text', config: '' },
      { name: 'expenseLines', type: 'jsonb', config: '.notNull().default(sql`\'[]\'::jsonb`)' },
    ],
  },
  {
    tableName: 'leases',
    fileName: 'leases',
    exportName: 'leases',
    typeName: 'Lease',
    hasDocStatus: true,
    fields: [
      { name: 'leaseNumber', type: 'text', config: '' },
      { name: 'lessor', type: 'text', config: '.notNull()' },
      { name: 'lessee', type: 'text', config: '.notNull()' },
      { name: 'startDate', type: 'date', config: '' },
      { name: 'endDate', type: 'date', config: '' },
      { name: 'monthlyPayment', type: 'numeric', config: '({ precision: 18, scale: 2 })' },
      { name: 'leaseType', type: 'text', config: '.notNull()' },
      { name: 'leaseTerms', type: 'jsonb', config: '.notNull().default(sql`\'{}\'::jsonb`)' },
    ],
  },
  {
    tableName: 'budgets',
    fileName: 'budgets',
    exportName: 'budgets',
    typeName: 'Budget',
    hasDocStatus: true,
    fields: [
      { name: 'budgetNumber', type: 'text', config: '' },
      { name: 'fiscalYear', type: 'integer', config: '.notNull()' },
      { name: 'department', type: 'text', config: '' },
      { name: 'totalAmount', type: 'numeric', config: '({ precision: 18, scale: 2 })' },
      { name: 'currency', type: 'text', config: '.notNull().default(\'MYR\')' },
      { name: 'budgetLines', type: 'jsonb', config: '.notNull().default(sql`\'[]\'::jsonb`)' },
    ],
  },
  {
    tableName: 'forecasts',
    fileName: 'forecasts',
    exportName: 'forecasts',
    typeName: 'Forecast',
    hasDocStatus: true,
    fields: [
      { name: 'forecastNumber', type: 'text', config: '' },
      { name: 'period', type: 'text', config: '.notNull()' },
      { name: 'forecastType', type: 'text', config: '.notNull()' },
      { name: 'totalAmount', type: 'numeric', config: '({ precision: 18, scale: 2 })' },
      { name: 'currency', type: 'text', config: '.notNull().default(\'MYR\')' },
      { name: 'forecastLines', type: 'jsonb', config: '.notNull().default(sql`\'[]\'::jsonb`)' },
    ],
  },
  {
    tableName: 'purchase_requisitions',
    fileName: 'purchase-requisitions',
    exportName: 'purchaseRequisitions',
    typeName: 'PurchaseRequisition',
    hasDocStatus: true,
    fields: [
      { name: 'prNumber', type: 'text', config: '' },
      { name: 'requestorId', type: 'uuid', config: '.notNull()' },
      { name: 'requestDate', type: 'date', config: '' },
      { name: 'requiredDate', type: 'date', config: '' },
      { name: 'totalAmount', type: 'numeric', config: '({ precision: 18, scale: 2 })' },
      { name: 'currency', type: 'text', config: '.notNull().default(\'MYR\')' },
      { name: 'prLines', type: 'jsonb', config: '.notNull().default(sql`\'[]\'::jsonb`)' },
    ],
  },
  {
    tableName: 'shipments',
    fileName: 'shipments',
    exportName: 'shipments',
    typeName: 'Shipment',
    hasDocStatus: true,
    fields: [
      { name: 'shipmentNumber', type: 'text', config: '' },
      { name: 'carrier', type: 'text', config: '' },
      { name: 'trackingNumber', type: 'text', config: '' },
      { name: 'shipDate', type: 'date', config: '' },
      { name: 'expectedDeliveryDate', type: 'date', config: '' },
      { name: 'origin', type: 'text', config: '' },
      { name: 'destination', type: 'text', config: '' },
      { name: 'shipmentLines', type: 'jsonb', config: '.notNull().default(sql`\'[]\'::jsonb`)' },
    ],
  },
  {
    tableName: 'returns',
    fileName: 'returns',
    exportName: 'returns',
    typeName: 'Return',
    hasDocStatus: true,
    fields: [
      { name: 'returnNumber', type: 'text', config: '' },
      { name: 'returnType', type: 'text', config: '.notNull()' },
      { name: 'returnDate', type: 'date', config: '' },
      { name: 'reason', type: 'text', config: '' },
      { name: 'totalAmount', type: 'numeric', config: '({ precision: 18, scale: 2 })' },
      { name: 'currency', type: 'text', config: '.notNull().default(\'MYR\')' },
      { name: 'returnLines', type: 'jsonb', config: '.notNull().default(sql`\'[]\'::jsonb`)' },
    ],
  },
  {
    tableName: 'inventory_transfers',
    fileName: 'inventory-transfers',
    exportName: 'inventoryTransfers',
    typeName: 'InventoryTransfer',
    hasDocStatus: true,
    fields: [
      { name: 'transferNumber', type: 'text', config: '' },
      { name: 'fromWarehouse', type: 'uuid', config: '.notNull()' },
      { name: 'toWarehouse', type: 'uuid', config: '.notNull()' },
      { name: 'transferDate', type: 'date', config: '' },
      { name: 'transferLines', type: 'jsonb', config: '.notNull().default(sql`\'[]\'::jsonb`)' },
    ],
  },
  {
    tableName: 'campaigns',
    fileName: 'campaigns',
    exportName: 'campaigns',
    typeName: 'Campaign',
    hasDocStatus: true,
    fields: [
      { name: 'campaignCode', type: 'text', config: '' },
      { name: 'name', type: 'text', config: '.notNull()' },
      { name: 'campaignType', type: 'text', config: '.notNull()' },
      { name: 'startDate', type: 'date', config: '' },
      { name: 'endDate', type: 'date', config: '' },
      { name: 'budget', type: 'numeric', config: '({ precision: 18, scale: 2 })' },
      { name: 'targetAudience', type: 'text', config: '' },
      { name: 'campaignData', type: 'jsonb', config: '.notNull().default(sql`\'{}\'::jsonb`)' },
    ],
  },
  {
    tableName: 'work_orders',
    fileName: 'work-orders',
    exportName: 'workOrders',
    typeName: 'WorkOrder',
    hasDocStatus: true,
    fields: [
      { name: 'woNumber', type: 'text', config: '' },
      { name: 'productId', type: 'uuid', config: '.notNull()' },
      { name: 'quantity', type: 'numeric', config: '({ precision: 18, scale: 6 }).notNull()' },
      { name: 'startDate', type: 'date', config: '' },
      { name: 'dueDate', type: 'date', config: '' },
      { name: 'priority', type: 'text', config: '.notNull().default(\'normal\')' },
      { name: 'woLines', type: 'jsonb', config: '.notNull().default(sql`\'[]\'::jsonb`)' },
    ],
  },
  {
    tableName: 'quality_inspections',
    fileName: 'quality-inspections',
    exportName: 'qualityInspections',
    typeName: 'QualityInspection',
    hasDocStatus: true,
    fields: [
      { name: 'inspectionNumber', type: 'text', config: '' },
      { name: 'inspectionType', type: 'text', config: '.notNull()' },
      { name: 'inspectionDate', type: 'date', config: '' },
      { name: 'inspector', type: 'text', config: '' },
      { name: 'result', type: 'text', config: '' },
      { name: 'inspectionData', type: 'jsonb', config: '.notNull().default(sql`\'{}\'::jsonb`)' },
    ],
  },
  {
    tableName: 'timesheets',
    fileName: 'timesheets',
    exportName: 'timesheets',
    typeName: 'Timesheet',
    hasDocStatus: true,
    fields: [
      { name: 'employeeId', type: 'uuid', config: '.notNull()' },
      { name: 'periodStart', type: 'date', config: '.notNull()' },
      { name: 'periodEnd', type: 'date', config: '.notNull()' },
      { name: 'totalHours', type: 'numeric', config: '({ precision: 10, scale: 2 })' },
      { name: 'timeEntries', type: 'jsonb', config: '.notNull().default(sql`\'[]\'::jsonb`)' },
    ],
  },
  {
    tableName: 'leave_requests',
    fileName: 'leave-requests',
    exportName: 'leaveRequests',
    typeName: 'LeaveRequest',
    hasDocStatus: true,
    fields: [
      { name: 'employeeId', type: 'uuid', config: '.notNull()' },
      { name: 'leaveType', type: 'text', config: '.notNull()' },
      { name: 'startDate', type: 'date', config: '.notNull()' },
      { name: 'endDate', type: 'date', config: '.notNull()' },
      { name: 'days', type: 'numeric', config: '({ precision: 5, scale: 2 })' },
      { name: 'reason', type: 'text', config: '' },
    ],
  },
  {
    tableName: 'performance_reviews',
    fileName: 'performance-reviews',
    exportName: 'performanceReviews',
    typeName: 'PerformanceReview',
    hasDocStatus: true,
    fields: [
      { name: 'employeeId', type: 'uuid', config: '.notNull()' },
      { name: 'reviewPeriod', type: 'text', config: '.notNull()' },
      { name: 'reviewDate', type: 'date', config: '' },
      { name: 'reviewer', type: 'text', config: '' },
      { name: 'overallRating', type: 'integer', config: '' },
      { name: 'reviewData', type: 'jsonb', config: '.notNull().default(sql`\'{}\'::jsonb`)' },
    ],
  },
  {
    tableName: 'franchise_applications',
    fileName: 'franchise-applications',
    exportName: 'franchiseApplications',
    typeName: 'FranchiseApplication',
    hasDocStatus: true,
    fields: [
      { name: 'applicationNumber', type: 'text', config: '' },
      { name: 'applicantName', type: 'text', config: '.notNull()' },
      { name: 'email', type: 'text', config: '.notNull()' },
      { name: 'phone', type: 'text', config: '' },
      { name: 'territory', type: 'text', config: '' },
      { name: 'investmentCapacity', type: 'numeric', config: '({ precision: 18, scale: 2 })' },
      { name: 'applicationData', type: 'jsonb', config: '.notNull().default(sql`\'{}\'::jsonb`)' },
    ],
  },
  {
    tableName: 'outlet_audits',
    fileName: 'outlet-audits',
    exportName: 'outletAudits',
    typeName: 'OutletAudit',
    hasDocStatus: true,
    fields: [
      { name: 'auditNumber', type: 'text', config: '' },
      { name: 'outletId', type: 'uuid', config: '.notNull()' },
      { name: 'auditDate', type: 'date', config: '' },
      { name: 'auditor', type: 'text', config: '' },
      { name: 'score', type: 'integer', config: '' },
      { name: 'findings', type: 'jsonb', config: '.notNull().default(sql`\'[]\'::jsonb`)' },
    ],
  },
];

function generateSchemaFile(config: SchemaConfig): string {
  const imports = config.hasDocStatus
    ? `import { sql } from 'drizzle-orm';
import { check, date, index, integer, jsonb, numeric, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';
import { docStatusEnum } from '../helpers/doc-status';`
    : `import { sql } from 'drizzle-orm';
import { check, date, index, integer, jsonb, numeric, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';`;

  const docStatusField = config.hasDocStatus
    ? `    docStatus: docStatusEnum('doc_status').notNull().default('draft'),
    docNo: text('doc_no'),`
    : '';

  const fields = config.fields
    .map((f) => {
      const fieldName = f.name.replace(/([A-Z])/g, '_$1').toLowerCase();
      const typeMap: Record<string, string> = {
        text: 'text',
        integer: 'integer',
        numeric: 'numeric',
        date: 'date',
        jsonb: 'jsonb',
        uuid: 'uuid',
      };

      // For numeric with precision config, don't add extra parentheses
      if (f.type === 'numeric' && f.config.startsWith('({ precision')) {
        return `    ${f.name}: ${typeMap[f.type]}('${fieldName}', ${f.config.slice(1, -1)})${f.config.includes('.notNull()') ? '.notNull()' : ''},`;
      }

      return `    ${f.name}: ${typeMap[f.type]}('${fieldName}')${f.config},`;
    })
    .join('\n');

  const docStatusCheck = config.hasDocStatus
    ? `    check('${config.tableName}_doc_status_valid', sql\`doc_status IN ('draft', 'submitted', 'active', 'cancelled')\`),`
    : '';

  return `${imports}

export const ${config.exportName} = pgTable(
  '${config.tableName}',
  {
    ...erpEntityColumns,
${docStatusField}
${fields}
  },
  (table) => [
    index('${config.tableName}_org_id_idx').on(table.orgId, table.id),
    index('${config.tableName}_org_created_idx').on(table.orgId, table.createdAt),
    check('${config.tableName}_org_not_empty', sql\`org_id <> ''\`),
${docStatusCheck}
    tenantPolicy(table),
  ],
);

export type ${config.typeName} = typeof ${config.exportName}.$inferSelect;
export type New${config.typeName} = typeof ${config.exportName}.$inferInsert;
`;
}

// Generate all schemas
console.log('Generating master data schemas...');
masterDataSchemas.forEach((config) => {
  const content = generateSchemaFile(config);
  const filePath = join(__dirname, '..', 'src', 'schema', `${config.fileName}.ts`);
  writeFileSync(filePath, content, 'utf-8');
  console.log(`✓ Created ${config.fileName}.ts`);
});

console.log('\nGenerating transactional document schemas...');
transactionalSchemas.forEach((config) => {
  const content = generateSchemaFile(config);
  const filePath = join(__dirname, '..', 'src', 'schema', `${config.fileName}.ts`);
  writeFileSync(filePath, content, 'utf-8');
  console.log(`✓ Created ${config.fileName}.ts`);
});

console.log('\n✅ All schemas generated successfully!');
console.log(`Total: ${masterDataSchemas.length + transactionalSchemas.length} schema files`);
