export { docStatusEnum } from '../helpers/doc-status';

export { users } from './users';
export type { NewUser, User } from './users';

export { r2Files } from './r2-files';
export type { NewR2File, R2File } from './r2-files';

export {
  deliveryNoteLinesRelations,
  deliveryNotesRelations,
  r2FilesRelations,
  usersRelations
} from './relations';

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
export type {
  CustomFieldSyncQueueRow,
  NewCustomFieldSyncQueueRow
} from './custom-field-sync-queue';

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
export type {
  MetaAliasResolutionRule,
  NewMetaAliasResolutionRule
} from './meta-alias-resolution-rules';

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
export type {
  MigrationRowSnapshotRow,
  NewMigrationRowSnapshotRow
} from './migration-row-snapshots';

export { migrationConflicts } from './migration-conflicts';
export type { MigrationConflictRow, NewMigrationConflictRow } from './migration-conflicts';

export { migrationConflictResolutions } from './migration-conflict-resolutions';
export type {
  MigrationConflictResolutionRow,
  NewMigrationConflictResolutionRow
} from './migration-conflict-resolutions';

export { migrationReports } from './migration-reports';
export type { MigrationReportRow, NewMigrationReportRow } from './migration-reports';

export { migrationQuarantine } from './migration-quarantine';
export type { MigrationQuarantineRow, NewMigrationQuarantineRow } from './migration-quarantine';

export { migrationCheckpoints } from './migration-checkpoints';
export type { MigrationCheckpointRow, NewMigrationCheckpointRow } from './migration-checkpoints';

export { migrationMergeExplanations } from './migration-merge-explanations';
export type {
  MigrationMergeExplanationRow,
  NewMigrationMergeExplanationRow
} from './migration-merge-explanations';

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
export { integrationOutbox, searchOutbox, webhookOutbox, workflowOutbox } from './outbox';
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

// ── Accounting Domain (Phase B) ──────────────────────────
export { chartOfAccounts } from './chart-of-accounts';
export type { ChartOfAccount, NewChartOfAccount } from './chart-of-accounts';

export { journalEntries } from './journal-entries';
export type { JournalEntry, NewJournalEntry } from './journal-entries';

export { journalLines } from './journal-lines';
export type { JournalLine, NewJournalLine } from './journal-lines';

// ── GL Platform (Phase 3) ───────────────────────────────
export { ledgers } from './ledgers';
export type { Ledger, NewLedger } from './ledgers';

export { postingPeriods } from './posting-periods';
export type { NewPostingPeriod, PostingPeriod } from './posting-periods';

export { documentTypes } from './document-types';
export type { DocumentType, NewDocumentType } from './document-types';

// ── Accounting Hub (Phase 3) ────────────────────────────
export { acctEvents } from './acct-events';
export type { AcctEvent, NewAcctEvent } from './acct-events';

export { acctMappings } from './acct-mappings';
export type { AcctMapping, NewAcctMapping } from './acct-mappings';

export { acctMappingVersions } from './acct-mapping-versions';
export type { AcctMappingVersion, NewAcctMappingVersion } from './acct-mapping-versions';

export { acctDerivedEntries } from './acct-derived-entries';
export type { AcctDerivedEntry, NewAcctDerivedEntry } from './acct-derived-entries';

// ── Financial Close (Phase 3) ───────────────────────────
export { closeTasks } from './close-tasks';
export type { CloseTask, NewCloseTask } from './close-tasks';

export { closeEvidence } from './close-evidence';
export type { CloseEvidence, NewCloseEvidence } from './close-evidence';

// ── Statutory Reporting (Phase 3) ───────────────────────
export { statementLayouts } from './statement-layouts';
export type { NewStatementLayout, StatementLayout } from './statement-layouts';

export { statementLines } from './statement-lines';
export type { NewStatementLine, StatementLine } from './statement-lines';

// ── WHT (Phase 3) ──────────────────────────────────────
export { whtCodes } from './wht-codes';
export type { NewWhtCode, WhtCode } from './wht-codes';

export { whtRates } from './wht-rates';
export type { NewWhtRate, WhtRate } from './wht-rates';

export { whtCertificates } from './wht-certificates';
export type { NewWhtCertificate, WhtCertificate } from './wht-certificates';

// ── Transfer Pricing (Phase 3) ──────────────────────────
export { tpPolicies } from './tp-policies';
export type { NewTpPolicy, TpPolicy } from './tp-policies';

export { tpCalculations } from './tp-calculations';
export type { NewTpCalculation, TpCalculation } from './tp-calculations';

// ── IFRS P2 (Phase 3) ──────────────────────────────────
export { provisions } from './provisions';
export type { NewProvision, Provision } from './provisions';

export { provisionMovements } from './provision-movements';
export type { NewProvisionMovement, ProvisionMovement } from './provision-movements';

export { intangibleAssets } from './intangible-assets';
export type { IntangibleAsset, NewIntangibleAsset } from './intangible-assets';

export { financialInstruments } from './financial-instruments';
export type { FinancialInstrument, NewFinancialInstrument } from './financial-instruments';

export { hedgeDesignations } from './hedge-designations';
export type { HedgeDesignation, NewHedgeDesignation } from './hedge-designations';

export { hedgeEffectivenessTests } from './hedge-effectiveness-tests';
export type {
  HedgeEffectivenessTest,
  NewHedgeEffectivenessTest
} from './hedge-effectiveness-tests';

// ── Sub-Ledger: Intercompany (Phase 3) ──────────────────
export { icTransactions } from './ic-transactions';
export type { IcTransaction, NewIcTransaction } from './ic-transactions';

export { icAgreements } from './ic-agreements';
export type { IcAgreement, NewIcAgreement } from './ic-agreements';

// ── Consolidation: Elimination Journals (M-09) ─────────
export { eliminationJournals } from './elimination-journals';
export type { EliminationJournal, NewEliminationJournal } from './elimination-journals';

// ── Sub-Ledger: Accounts Payable (Phase 3) ──────────────
export { supplierInvoices } from './supplier-invoices';
export type { NewSupplierInvoice, SupplierInvoice } from './supplier-invoices';

export { paymentRuns } from './payment-runs';
export type { NewPaymentRun, PaymentRun } from './payment-runs';

// ── Sub-Ledger: Credit Management (Phase 3) ─────────────
export { creditLimits } from './credit-limits';
export type { CreditLimit, NewCreditLimit } from './credit-limits';

export { creditExposures } from './credit-exposures';
export type { CreditExposure, NewCreditExposure } from './credit-exposures';

// ── Sub-Ledger: Subscription Billing (Phase 3) ──────────
export { subscriptions } from './subscriptions';
export type { NewSubscription, Subscription } from './subscriptions';

export { billingCycles } from './billing-cycles';
export type { BillingCycle, NewBillingCycle } from './billing-cycles';

// ── Sub-Ledger: Bank Reconciliation (Phase 3) ───────────
export { bankStatements } from './bank-statements';
export type { BankStatement, NewBankStatement } from './bank-statements';

export { reconciliationItems } from './reconciliation-items';
export type { NewReconciliationItem, ReconciliationItem } from './reconciliation-items';

// ── Finance Domain: Canon DB Integration (v3.1) ────────
export { treasuryAccounts } from './treasury-accounts';
export type { NewTreasuryAccountRow, TreasuryAccountRow } from './treasury-accounts';

export { deferredTaxItems } from './deferred-tax-items';
export type { DeferredTaxItemRow, NewDeferredTaxItemRow } from './deferred-tax-items';

export { employeeBenefitPlans } from './employee-benefit-plans';
export type { EmployeeBenefitPlanRow, NewEmployeeBenefitPlanRow } from './employee-benefit-plans';

export { borrowingCostItems } from './borrowing-cost-items';
export type { BorrowingCostItemRow, NewBorrowingCostItemRow } from './borrowing-cost-items';

export { biologicalAssetItems } from './biological-asset-items';
export type { BiologicalAssetItemRow, NewBiologicalAssetItemRow } from './biological-asset-items';

export { governmentGrantItems } from './government-grant-items';
export type { GovernmentGrantItemRow, NewGovernmentGrantItemRow } from './government-grant-items';

export { impairmentTests } from './impairment-tests';
export type { ImpairmentTestRow, NewImpairmentTestRow } from './impairment-tests';

export { investmentProperties } from './investment-properties';
export type { InvestmentPropertyRow, NewInvestmentPropertyRow } from './investment-properties';

export { sbpGrants } from './sbp-grants';
export type { NewSbpGrantRow, SbpGrantRow } from './sbp-grants';

export { inventoryValuationItems } from './inventory-valuation-items';
export type {
  InventoryValuationItemRow,
  NewInventoryValuationItemRow
} from './inventory-valuation-items';

// ── Finance Domain: ERPNext Gap Closure (v3.2) ──────────

export { bankAccounts } from './bank-accounts';
export type { BankAccount, NewBankAccount } from './bank-accounts';

export { payments } from './payments';
export type { NewPayment, Payment } from './payments';

export { paymentMethods } from './payment-methods';
export type { NewPaymentMethod, PaymentMethod } from './payment-methods';

export { paymentMethodAccounts } from './payment-method-accounts';
export type { NewPaymentMethodAccount, PaymentMethodAccount } from './payment-method-accounts';

export { paymentTermsTemplates } from './payment-terms-templates';
export type { NewPaymentTermsTemplate, PaymentTermsTemplate } from './payment-terms-templates';

export { paymentTermsTemplateDetails } from './payment-terms-template-details';
export type {
  NewPaymentTermsTemplateDetail,
  PaymentTermsTemplateDetail
} from './payment-terms-template-details';

export { dunningRuns } from './dunning-runs';
export type { DunningRun, NewDunningRun } from './dunning-runs';

export { dunningNotices } from './dunning-notices';
export type { DunningNotice, NewDunningNotice } from './dunning-notices';

export { bankMatchingRules } from './bank-matching-rules';
export type { BankMatchingRule, NewBankMatchingRule } from './bank-matching-rules';

export { openingBalanceBatches } from './opening-balance-batches';
export type { NewOpeningBalanceBatch, OpeningBalanceBatch } from './opening-balance-batches';

export { openingBalanceLines } from './opening-balance-lines';
export type { NewOpeningBalanceLine, OpeningBalanceLine } from './opening-balance-lines';

// @entity-gen:schema-barrel
