export { users } from './users';
export type { NewUser, User } from './users';

export { r2Files } from './r2-files';
export type { NewR2File, R2File } from './r2-files';

export { deliveryNoteLinesRelations, deliveryNotesRelations, r2FilesRelations, usersRelations } from './relations';

export { auditLogs } from './audit-logs';
export type { AuditLog, NewAuditLog } from './audit-logs';

export { entityVersions } from './entity-versions';
export type { EntityVersion, NewEntityVersion } from './entity-versions';

export { mutationBatches } from './mutation-batches';
export type { MutationBatch, NewMutationBatch } from './mutation-batches';

export { contacts } from './contacts';
export type { Contact, NewContact } from './contacts';

export { advisories } from './advisories';
export type { Advisory, NewAdvisory } from './advisories';

export { advisoryEvidence } from './advisory-evidence';
export type { AdvisoryEvidence, NewAdvisoryEvidence } from './advisory-evidence';

export { workflowRules } from './workflow-rules';
export type { NewWorkflowRuleRow, WorkflowRuleRow } from './workflow-rules';

export { workflowExecutions } from './workflow-executions';
export type { NewWorkflowExecution, WorkflowExecution } from './workflow-executions';

// ── Phase A: ERP Spine Tables ────────────────────────────
export { companies } from './companies';
export type { Company, NewCompany } from './companies';

export { sites } from './sites';
export type { NewSite, Site } from './sites';

export { currencies } from './currencies';
export type { Currency, NewCurrency } from './currencies';

export { uom } from './uom';
export type { NewUom, Uom } from './uom';

export { uomConversions } from './uom-conversions';
export type { NewUomConversion, UomConversion } from './uom-conversions';

export { numberSequences } from './number-sequences';
export type { NewNumberSequence, NumberSequence } from './number-sequences';

// ── Phase A: Custom Fields ───────────────────────────────
export { customFields } from './custom-fields';
export type { CustomField, NewCustomField } from './custom-fields';

export { customFieldValues } from './custom-field-values';
export type { CustomFieldValue, NewCustomFieldValue } from './custom-field-values';

export { customFieldSyncQueue } from './custom-field-sync-queue';
export type { CustomFieldSyncQueueRow, NewCustomFieldSyncQueueRow } from './custom-field-sync-queue';

// ── Phase A: Entity Views ────────────────────────────────
export { entityViews } from './entity-views';
export type { EntityView, NewEntityView } from './entity-views';

export { entityViewFields } from './entity-view-fields';
export type { EntityViewField, NewEntityViewField } from './entity-view-fields';

// ── Phase A: LiteMetadata ────────────────────────────────
export { metaAssets } from './meta-assets';
export type { MetaAsset, NewMetaAsset } from './meta-assets';

export { metaLineageEdges } from './meta-lineage-edges';
export type { MetaLineageEdge, NewMetaLineageEdge } from './meta-lineage-edges';

export { metaQualityChecks } from './meta-quality-checks';
export type { MetaQualityCheck, NewMetaQualityCheck } from './meta-quality-checks';

// ── Phase A: Aliasing ────────────────────────────────────
export { metaAliasSets } from './meta-alias-sets';
export type { MetaAliasSet, NewMetaAliasSet } from './meta-alias-sets';

export { metaAliases } from './meta-aliases';
export type { MetaAlias, NewMetaAlias } from './meta-aliases';

export { metaAliasResolutionRules } from './meta-alias-resolution-rules';
export type { MetaAliasResolutionRule, NewMetaAliasResolutionRule } from './meta-alias-resolution-rules';

export { metaValueAliases } from './meta-value-aliases';
export type { MetaValueAlias, NewMetaValueAlias } from './meta-value-aliases';

// ── Phase A: Semantic Terms ──────────────────────────────
export { metaSemanticTerms } from './meta-semantic-terms';
export type { MetaSemanticTerm, NewMetaSemanticTerm } from './meta-semantic-terms';

export { metaTermLinks } from './meta-term-links';
export type { MetaTermLink, NewMetaTermLink } from './meta-term-links';

// ── Phase B: Policy Engine ──────────────────────────────
export { roles } from './roles';
export type { NewRole, Role } from './roles';

export { userRoles } from './user-roles';
export type { NewUserRole, UserRole } from './user-roles';

export { rolePermissions } from './role-permissions';
export type { NewRolePermission, RolePermission } from './role-permissions';

export { userScopes } from './user-scopes';
export type { NewUserScope, UserScope } from './user-scopes';

// ── Phase B: Governors ──────────────────────────────────
export { orgUsageDaily } from './org-usage-daily';
export type { NewOrgUsageDaily, OrgUsageDaily } from './org-usage-daily';

// ── Phase B: Trust Hooks (Evidence & Compliance) ────────
export { entityAttachments } from './entity-attachments';
export type { EntityAttachment, NewEntityAttachment } from './entity-attachments';

export { communications } from './communications';
export type { Communication, NewCommunication } from './communications';

// ── API Keys ────────────────────────────────────────────
export { apiKeys } from './api-keys';
export type { ApiKey, NewApiKey } from './api-keys';

// ── Migration Engine ───────────────────────────────────────
export { migrationJobs } from './migration-jobs';
export type { MigrationJobRow, NewMigrationJobRow } from './migration-jobs';

export { migrationLineage } from './migration-lineage';
export type { MigrationLineageRow, NewMigrationLineageRow } from './migration-lineage';

export { migrationRowSnapshots } from './migration-row-snapshots';
export type { MigrationRowSnapshotRow, NewMigrationRowSnapshotRow } from './migration-row-snapshots';

export { migrationConflicts } from './migration-conflicts';
export type { MigrationConflictRow, NewMigrationConflictRow } from './migration-conflicts';

export { migrationConflictResolutions } from './migration-conflict-resolutions';
export type { MigrationConflictResolutionRow, NewMigrationConflictResolutionRow } from './migration-conflict-resolutions';

export { migrationReports } from './migration-reports';
export type { MigrationReportRow, NewMigrationReportRow } from './migration-reports';

export { migrationQuarantine } from './migration-quarantine';
export type { MigrationQuarantineRow, NewMigrationQuarantineRow } from './migration-quarantine';

export { migrationCheckpoints } from './migration-checkpoints';
export type { MigrationCheckpointRow, NewMigrationCheckpointRow } from './migration-checkpoints';

export { migrationMergeExplanations } from './migration-merge-explanations';
export type { MigrationMergeExplanationRow, NewMigrationMergeExplanationRow } from './migration-merge-explanations';

// ── Comprehensive Entity Registry (56 entities) ─────────────

// Master Data Entities
export { products } from './products';
export type { NewProduct, Product } from './products';

export { customers } from './customers';
export type { Customer, NewCustomer } from './customers';

export { suppliers } from './suppliers';
export type { NewSupplier, Supplier } from './suppliers';

export { employees } from './employees';
export type { Employee, NewEmployee } from './employees';

export { warehouses } from './warehouses';
export type { NewWarehouse, Warehouse } from './warehouses';

export { projects } from './projects';
export type { NewProject, Project } from './projects';

export { costCenters } from './cost-centers';
export type { CostCenter, NewCostCenter } from './cost-centers';

export { leads } from './leads';
export type { Lead, NewLead } from './leads';

export { opportunities } from './opportunities';
export type { NewOpportunity, Opportunity } from './opportunities';

export { serviceTickets } from './service-tickets';
export type { NewServiceTicket, ServiceTicket } from './service-tickets';

export { boms } from './boms';
export type { Bom, NewBom } from './boms';

export { recipes } from './recipes';
export type { NewRecipe, Recipe } from './recipes';

export { jobApplications } from './job-applications';
export type { JobApplication, NewJobApplication } from './job-applications';

export { cropPlans } from './crop-plans';
export type { CropPlan, NewCropPlan } from './crop-plans';

export { livestockRecords } from './livestock-records';
export type { LivestockRecord, NewLivestockRecord } from './livestock-records';

export { legalEntities } from './legal-entities';
export type { LegalEntity, NewLegalEntity } from './legal-entities';

export { contracts } from './contracts';
export type { Contract, NewContract } from './contracts';

export { documents } from './documents';
export type { Document, NewDocument } from './documents';

export { assets } from './assets';
export type { Asset, NewAsset } from './assets';

export { fixedAssets } from './fixed-assets';
export type { FixedAsset, NewFixedAsset } from './fixed-assets';

export { auditPrograms } from './audit-programs';
export type { AuditProgram, NewAuditProgram } from './audit-programs';

export { riskAssessments } from './risk-assessments';
export type { NewRiskAssessment, RiskAssessment } from './risk-assessments';

// Transactional Document Entities
export { expenseReports } from './expense-reports';
export type { ExpenseReport, NewExpenseReport } from './expense-reports';

export { leases } from './leases';
export type { Lease, NewLease } from './leases';

export { budgets } from './budgets';
export type { Budget, NewBudget } from './budgets';

export { forecasts } from './forecasts';
export type { Forecast, NewForecast } from './forecasts';

export { purchaseRequisitions } from './purchase-requisitions';
export type { NewPurchaseRequisition, PurchaseRequisition } from './purchase-requisitions';

export { shipments } from './shipments';
export type { NewShipment, Shipment } from './shipments';

export { returns } from './returns';
export type { NewReturn, Return } from './returns';

export { inventoryTransfers } from './inventory-transfers';
export type { InventoryTransfer, NewInventoryTransfer } from './inventory-transfers';

export { campaigns } from './campaigns';
export type { Campaign, NewCampaign } from './campaigns';

export { workOrders } from './work-orders';
export type { NewWorkOrder, WorkOrder } from './work-orders';

export { qualityInspections } from './quality-inspections';
export type { NewQualityInspection, QualityInspection } from './quality-inspections';

export { timesheets } from './timesheets';
export type { NewTimesheet, Timesheet } from './timesheets';

export { leaveRequests } from './leave-requests';
export type { LeaveRequest, NewLeaveRequest } from './leave-requests';

export { performanceReviews } from './performance-reviews';
export type { NewPerformanceReview, PerformanceReview } from './performance-reviews';

export { franchiseApplications } from './franchise-applications';
export type { FranchiseApplication, NewFranchiseApplication } from './franchise-applications';

export { outletAudits } from './outlet-audits';
export type { NewOutletAudit, OutletAudit } from './outlet-audits';

// ── Procurement: Delivery Notes ──────────────────────────
export { deliveryNotes } from './delivery-notes';
export type { DeliveryNote, NewDeliveryNote } from './delivery-notes';

export { deliveryNoteLines } from './delivery-note-lines';
export type { DeliveryNoteLine, NewDeliveryNoteLine } from './delivery-note-lines';

// ── Webhooks ─────────────────────────────────────────────
export { webhookEndpoints } from './webhook-endpoints';
export type { NewWebhookEndpoint, WebhookEndpoint } from './webhook-endpoints';

export { webhookDeliveries } from './webhook-deliveries';
export type { NewWebhookDelivery, WebhookDelivery } from './webhook-deliveries';

// ── Transactional Outbox (Phase 2 K-12) ──────────────────
export {
    integrationOutbox,
    searchOutbox,
    webhookOutbox,
    workflowOutbox
} from './outbox';
export type {
    IntegrationOutboxRow,
    SearchOutboxRow,
    WebhookOutboxRow,
    WorkflowOutboxRow
} from './outbox';

// ── Idempotency Keys (Phase 2 K-10) ──────────────────────
export { idempotencyKeys } from './idempotency-keys';
export type { IdempotencyKey, NewIdempotencyKey } from './idempotency-keys';

// ── FX / Media Settings ───────────────────────────────────
export { currencyExchanges } from './currency-exchanges';
export type { CurrencyExchange, NewCurrencyExchange } from './currency-exchanges';

export { videoSettings } from './video-settings';
export type { NewVideoSettings, VideoSettings } from './video-settings';

// ── Accounting Domain (Phase A) ──────────────────────────
export { fxRates } from './fx-rates';
export type { FxRate, NewFxRate } from './fx-rates';

export { fiscalPeriods } from './fiscal-periods';
export type { FiscalPeriod, NewFiscalPeriod } from './fiscal-periods';

export { taxRates } from './tax-rates';
export type { NewTaxRate, TaxRate } from './tax-rates';

export { depreciationSchedules } from './depreciation-schedules';
export type { DepreciationSchedule, NewDepreciationSchedule } from './depreciation-schedules';

export { matchResults } from './match-results';
export type { MatchResult, NewMatchResult } from './match-results';

export { paymentAllocations } from './payment-allocations';
export type { NewPaymentAllocation, PaymentAllocation } from './payment-allocations';

export { revenueSchedules } from './revenue-schedules';
export type { NewRevenueSchedule, RevenueSchedule } from './revenue-schedules';

export { revenueScheduleLines } from './revenue-schedule-lines';
export type { NewRevenueScheduleLine, RevenueScheduleLine } from './revenue-schedule-lines';

// @entity-gen:schema-barrel
