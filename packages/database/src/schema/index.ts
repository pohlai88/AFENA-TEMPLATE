export { users } from './users';
export type { User, NewUser } from './users';

export { r2Files } from './r2-files';
export type { R2File, NewR2File } from './r2-files';

export { usersRelations, r2FilesRelations } from './relations';

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
export type { WorkflowRuleRow, NewWorkflowRuleRow } from './workflow-rules';

export { workflowExecutions } from './workflow-executions';
export type { WorkflowExecution, NewWorkflowExecution } from './workflow-executions';

// ── Phase A: ERP Spine Tables ────────────────────────────
export { companies } from './companies';
export type { Company, NewCompany } from './companies';

export { sites } from './sites';
export type { Site, NewSite } from './sites';

export { currencies } from './currencies';
export type { Currency, NewCurrency } from './currencies';

export { fxRates } from './fx-rates';
export type { FxRate, NewFxRate } from './fx-rates';

export { uom } from './uom';
export type { Uom, NewUom } from './uom';

export { uomConversions } from './uom-conversions';
export type { UomConversion, NewUomConversion } from './uom-conversions';

export { numberSequences } from './number-sequences';
export type { NumberSequence, NewNumberSequence } from './number-sequences';

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
export type { Role, NewRole } from './roles';

export { userRoles } from './user-roles';
export type { UserRole, NewUserRole } from './user-roles';

export { rolePermissions } from './role-permissions';
export type { RolePermission, NewRolePermission } from './role-permissions';

export { userScopes } from './user-scopes';
export type { UserScope, NewUserScope } from './user-scopes';

// ── Phase B: Governors ──────────────────────────────────
export { orgUsageDaily } from './org-usage-daily';
export type { OrgUsageDaily, NewOrgUsageDaily } from './org-usage-daily';

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

// ── Phase B: Finance Core ──────────────────────────────
export { fiscalPeriods } from './fiscal-periods';
export type { FiscalPeriod, NewFiscalPeriod } from './fiscal-periods';

export { chartOfAccounts } from './chart-of-accounts';
export type { ChartOfAccount, NewChartOfAccount } from './chart-of-accounts';

export { journalEntries } from './journal-entries';
export type { JournalEntry, NewJournalEntry } from './journal-entries';

export { journalLines } from './journal-lines';
export type { JournalLine, NewJournalLine } from './journal-lines';

// ── Phase B: Tax + Payments ────────────────────────────
export { taxRates } from './tax-rates';
export type { TaxRate, NewTaxRate } from './tax-rates';

export { paymentAllocations } from './payment-allocations';
export type { PaymentAllocation, NewPaymentAllocation } from './payment-allocations';

export { creditNotes } from './credit-notes';
export type { CreditNote, NewCreditNote } from './credit-notes';

// ── Phase C: Intercompany + Bank Reconciliation ──────
export { intercompanyTransactions } from './intercompany-transactions';
export type { IntercompanyTransaction, NewIntercompanyTransaction } from './intercompany-transactions';

export { bankStatementLines } from './bank-statements';
export type { BankStatementLine, NewBankStatementLine } from './bank-statements';

// ── Phase D: Ledger Dimensions ────────────────────────
export { costCenters } from './cost-centers';
export type { CostCenter, NewCostCenter } from './cost-centers';

export { projects } from './projects';
export type { Project, NewProject } from './projects';

// ── Phase D: Stock Ledger ─────────────────────────────
export { stockMovements } from './stock-movements';
export type { StockMovement, NewStockMovement } from './stock-movements';

// ── Phase D: Approval Chains ──────────────────────────
export { approvalChains, approvalSteps, approvalRequests, approvalDecisions } from './approval-chains';
export type {
    ApprovalChain, NewApprovalChain,
    ApprovalStep, NewApprovalStep,
    ApprovalRequest, NewApprovalRequest,
    ApprovalDecision, NewApprovalDecision,
} from './approval-chains';

// ── Phase D: Reporting + Pricing + 3-Way Match ───────
export { reportingSnapshots } from './reporting-snapshots';
export type { ReportingSnapshot, NewReportingSnapshot } from './reporting-snapshots';

export { priceLists, priceListItems } from './price-lists';
export type {
    PriceList, NewPriceList,
    PriceListItem, NewPriceListItem,
} from './price-lists';

export { matchResults } from './match-results';
export type { MatchResult, NewMatchResult } from './match-results';

// ── Phase E: Manufacturing ────────────────────────────
export { boms, bomLines } from './boms';
export type { Bom, NewBom, BomLine, NewBomLine } from './boms';

export { workOrders } from './work-orders';
export type { WorkOrder, NewWorkOrder } from './work-orders';

export { wipMovements } from './wip-movements';
export type { WipMovement, NewWipMovement } from './wip-movements';

// ── Phase E: Fixed Assets ─────────────────────────────
export { assets, depreciationSchedules, assetEvents } from './fixed-assets';
export type {
    Asset, NewAsset,
    DepreciationSchedule, NewDepreciationSchedule,
    AssetEvent, NewAssetEvent,
} from './fixed-assets';

// ── Phase E: Revenue Recognition ──────────────────────
export { revenueSchedules, revenueScheduleLines } from './revenue-schedules';
export type {
    RevenueSchedule, NewRevenueSchedule,
    RevenueScheduleLine, NewRevenueScheduleLine,
} from './revenue-schedules';

// ── Phase E: Budgeting + Encumbrance ──────────────────
export { budgets, budgetCommitments } from './budgets';
export type {
    Budget, NewBudget,
    BudgetCommitment, NewBudgetCommitment,
} from './budgets';

// ── Phase E: Lot/Batch/Serial Traceability ────────────
export { lotTracking } from './lot-tracking';
export type { LotTracking, NewLotTracking } from './lot-tracking';

// ── Phase E: Landed Cost ──────────────────────────────
export { landedCostDocs, landedCostAllocations } from './landed-costs';
export type {
    LandedCostDoc, NewLandedCostDoc,
    LandedCostAllocation, NewLandedCostAllocation,
} from './landed-costs';

// ── Gap Fixes: Webhooks + Trace DAG + Discount Rules ─
export { webhookEndpoints, webhookDeliveries } from './webhook-endpoints';
export type {
    WebhookEndpoint, NewWebhookEndpoint,
    WebhookDelivery, NewWebhookDelivery,
} from './webhook-endpoints';

export { inventoryTraceLinks } from './inventory-trace-links';
export type { InventoryTraceLink, NewInventoryTraceLink } from './inventory-trace-links';

export { discountRules } from './discount-rules';
export type { DiscountRule, NewDiscountRule } from './discount-rules';

// @entity-gen:schema-barrel
