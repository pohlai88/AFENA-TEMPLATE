export { users } from './users';
export type { User, NewUser } from './users';

export { r2Files } from './r2-files';
export type { R2File, NewR2File } from './r2-files';

export { usersRelations, r2FilesRelations } from './relations';

export {
    itemGroupsRelations,
    itemsRelations,
    salesInvoicesRelations,
    salesInvoiceLinesRelations,
    paymentsRelations,
    salesOrdersRelations,
    salesOrderLinesRelations,
    deliveryNotesRelations,
    deliveryNoteLinesRelations,
    purchaseOrdersRelations,
    purchaseOrderLinesRelations,
    goodsReceiptsRelations,
    goodsReceiptLinesRelations,
    purchaseInvoicesRelations,
    purchaseInvoiceLinesRelations,
    quotationsRelations,
    quotationLinesRelations,
    docPostingsRelations,
} from './spine-relations';

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

// ── Transactional Spine: Migration 0031 — Master Data ────
export { itemGroups } from './item-groups';
export type { ItemGroup, NewItemGroup } from './item-groups';

export { items } from './items';
export type { Item, NewItem } from './items';

export { warehouses } from './warehouses';
export type { Warehouse, NewWarehouse } from './warehouses';

export { addresses } from './addresses';
export type { Address, NewAddress } from './addresses';

export { contactAddresses } from './contact-addresses';
export type { ContactAddress, NewContactAddress } from './contact-addresses';

export { companyAddresses } from './company-addresses';
export type { CompanyAddress, NewCompanyAddress } from './company-addresses';

// ── Transactional Spine: Migration 0032 — Posting Bridge ──
export { docPostings } from './doc-postings';
export type { DocPosting, NewDocPosting } from './doc-postings';

export { docLinks } from './doc-links';
export type { DocLink, NewDocLink } from './doc-links';

// ── Transactional Spine: Migration 0033 — Sales Invoice ───
export { salesInvoices } from './sales-invoices';
export type { SalesInvoice, NewSalesInvoice } from './sales-invoices';

export { salesInvoiceLines } from './sales-invoice-lines';
export type { SalesInvoiceLine, NewSalesInvoiceLine } from './sales-invoice-lines';

// ── Transactional Spine: Migration 0034 — Payments ────────
export { payments } from './payments';
export type { Payment, NewPayment } from './payments';

// ── Transactional Spine: Migration 0035 — Selling Cycle ───
export { salesOrders } from './sales-orders';
export type { SalesOrder, NewSalesOrder } from './sales-orders';

export { salesOrderLines } from './sales-order-lines';
export type { SalesOrderLine, NewSalesOrderLine } from './sales-order-lines';

export { deliveryNotes } from './delivery-notes';
export type { DeliveryNote, NewDeliveryNote } from './delivery-notes';

export { deliveryNoteLines } from './delivery-note-lines';
export type { DeliveryNoteLine, NewDeliveryNoteLine } from './delivery-note-lines';

// ── Transactional Spine: Migration 0036 — Buying Cycle ────
export { purchaseOrders } from './purchase-orders';
export type { PurchaseOrder, NewPurchaseOrder } from './purchase-orders';

export { purchaseOrderLines } from './purchase-order-lines';
export type { PurchaseOrderLine, NewPurchaseOrderLine } from './purchase-order-lines';

export { goodsReceipts } from './goods-receipts';
export type { GoodsReceipt, NewGoodsReceipt } from './goods-receipts';

export { goodsReceiptLines } from './goods-receipt-lines';
export type { GoodsReceiptLine, NewGoodsReceiptLine } from './goods-receipt-lines';

export { purchaseInvoices } from './purchase-invoices';
export type { PurchaseInvoice, NewPurchaseInvoice } from './purchase-invoices';

export { purchaseInvoiceLines } from './purchase-invoice-lines';
export type { PurchaseInvoiceLine, NewPurchaseInvoiceLine } from './purchase-invoice-lines';

// ── Transactional Spine: Migration 0037 — Quotations ──────
export { quotations } from './quotations';
export type { Quotation, NewQuotation } from './quotations';

export { quotationLines } from './quotation-lines';
export type { QuotationLine, NewQuotationLine } from './quotation-lines';

// ── Workflow V2: Migration 0040 — Contracted Workflow Envelope ──
export { workflowDefinitions } from './workflow-definitions';
export type { WorkflowDefinitionRow, NewWorkflowDefinitionRow } from './workflow-definitions';

export { workflowInstances } from './workflow-instances';
export type { WorkflowInstanceRow, NewWorkflowInstanceRow } from './workflow-instances';

export { workflowStepExecutions } from './workflow-step-executions';
export type { WorkflowStepExecutionRow, NewWorkflowStepExecutionRow } from './workflow-step-executions';

export { workflowEventsOutbox } from './workflow-events-outbox';
export type { WorkflowEventsOutboxRow, NewWorkflowEventsOutboxRow } from './workflow-events-outbox';

export { workflowSideEffectsOutbox } from './workflow-side-effects-outbox';
export type { WorkflowSideEffectsOutboxRow, NewWorkflowSideEffectsOutboxRow } from './workflow-side-effects-outbox';

export { workflowStepReceipts } from './workflow-step-receipts';
export type { WorkflowStepReceiptRow, NewWorkflowStepReceiptRow } from './workflow-step-receipts';

export { workflowOutboxReceipts } from './workflow-outbox-receipts';
export type { WorkflowOutboxReceiptRow, NewWorkflowOutboxReceiptRow } from './workflow-outbox-receipts';

// ── Audit Gap Closure: Migration 0043 ────────────────────
export { bankAccounts } from './bank-accounts';
export type { BankAccount, NewBankAccount } from './bank-accounts';

export { debitNotes } from './debit-notes';
export type { DebitNote, NewDebitNote } from './debit-notes';

export { customerProfiles } from './customer-profiles';
export type { CustomerProfile, NewCustomerProfile } from './customer-profiles';

export { supplierProfiles } from './supplier-profiles';
export type { SupplierProfile, NewSupplierProfile } from './supplier-profiles';

export { paymentTerms } from './payment-terms';
export type { PaymentTerm, NewPaymentTerm } from './payment-terms';

export { bankReconciliationSessions } from './bank-reconciliation-sessions';
export type { BankReconciliationSession, NewBankReconciliationSession } from './bank-reconciliation-sessions';

export { contracts } from './contracts';
export type { Contract, NewContract } from './contracts';

export { purchaseRequests } from './purchase-requests';
export type { PurchaseRequest, NewPurchaseRequest } from './purchase-requests';

export { stockBalances } from './stock-balances';
export type { StockBalance, NewStockBalance } from './stock-balances';

// @entity-gen:schema-barrel
