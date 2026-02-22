// ── Existing Payload Types ────────────────────────────────

export type JournalPostPayload = {
  journalId: string;
  effectiveAt: string;
  lines: Array<{
    lineNo: number;
    accountId: string;
    side: 'debit' | 'credit';
    amountMinor: number;
    currency: string;
    memo?: string;
  }>;
};

export type StockAdjustPayload = {
  itemId: string;
  deltaQty: number;
  reason: string;
};

export type TaxAdjustPayload = {
  documentId: string;
  lineId: string;
  effectiveAt: string;
  taxCode: string;
  adjustedTaxMinor: number;
  reason: string;
};

// ── Finance Intent Payloads ─────────────────────────────

/** accounting — journal reversal */
export type JournalReversePayload = {
  originalJournalId: string;
  reversalDate: string;
  effectiveAt: string;
  reason: string;
};

/** accounting — accrual posting */
export type AccrualPostPayload = {
  accrualType: 'expense' | 'revenue';
  accountId: string;
  effectiveAt: string;
  amountMinor: number;
  reversalPeriodKey: string;
  memo?: string;
};

/** fx-management — balance revaluation */
export type FxRevaluePayload = {
  ledgerId: string;
  periodKey: string;
  rateType: 'closing' | 'average';
  baseCurrency: string;
};

/** fx-management — hedge designation */
export type FxHedgeDesignatePayload = {
  hedgeId: string;
  hedgeType: 'fair_value' | 'cash_flow' | 'net_investment';
  hedgedItemId: string;
  hedgingInstrumentId: string;
  designationDate: string;
};

/** fixed-assets — depreciation run */
export type AssetDepreciatePayload = {
  assetId: string;
  periodKey: string;
  depreciationMinor: number;
  method:
  | 'straight_line'
  | 'declining_balance'
  | 'double_declining'
  | 'sum_of_years'
  | 'units_of_production';
};

/** fixed-assets — disposal */
export type AssetDisposePayload = {
  assetId: string;
  disposalDate: string;
  proceedsMinor: number;
  reason: string;
};

/** fixed-assets — revaluation */
export type AssetRevaluePayload = {
  assetId: string;
  newFairValueMinor: number;
  revaluationDate: string;
  valuerId?: string;
};

/** revenue-recognition — recognize revenue */
export type RevenueRecognizePayload = {
  contractId: string;
  obligationId: string;
  amountMinor: number;
  method: 'point_in_time' | 'over_time';
  periodKey: string;
};

/** revenue-recognition — defer revenue */
export type RevenueDeferPayload = {
  contractId: string;
  amountMinor: number;
  deferralAccountId: string;
  periodKey: string;
};

/** lease-accounting — amortize */
export type LeaseAmortizePayload = {
  leaseId: string;
  periodKey: string;
  principalMinor: number;
  interestMinor: number;
};

/** lease-accounting — modify */
export type LeaseModifyPayload = {
  leaseId: string;
  modificationDate: string;
  newTermMonths?: number;
  newPaymentMinor?: number;
  reason: string;
};

/** payables — payment run */
export type PayablesPayPayload = {
  paymentRunId: string;
  invoiceIds: string[];
  bankAccountId: string;
  paymentDate: string;
  totalMinor: number;
};

/** payables — AP invoice posting */
export type PayablesInvoicePostPayload = {
  invoiceId: string;
  vendorId: string;
  companyId: string;
  ledgerId: string;
  totalMinor: number;
  currency: string;
  effectiveAt: string;
  lines: Array<{ accountId: string; amountMinor: number; costCenter?: string }>;
};

/** payables — AP invoice approval */
export type PayablesInvoiceApprovePayload = {
  invoiceId: string;
  approverId: string;
  decision: 'approve' | 'reject';
  reason?: string;
};

/** payables — payment approval */
export type PayablesPaymentApprovePayload = {
  paymentRunId: string;
  approverId: string;
  decision: 'approve' | 'reject';
  reason?: string;
};

/** receivables — AR invoice posting */
export type ReceivablesInvoicePostPayload = {
  invoiceId: string;
  customerId: string;
  companyId: string;
  ledgerId: string;
  totalMinor: number;
  currency: string;
  effectiveAt: string;
  lines: Array<{ accountId: string; amountMinor: number }>;
};

/** receivables — payment allocation */
export type ReceivablesAllocatePayload = {
  paymentId: string;
  effectiveAt: string;
  allocations: Array<{
    invoiceId: string;
    amountMinor: number;
  }>;
  method: 'fifo' | 'specific' | 'oldest_first';
};

/** budgeting — budget commit */
export type BudgetCommitPayload = {
  budgetVersionId: string;
  periodKey: string;
  accountId: string;
  amountMinor: number;
};

/** intercompany — match */
export type IcMatchPayload = {
  senderTransactionId: string;
  receiverTransactionId: string;
  matchConfidence: number;
};

/** intercompany — elimination */
export type IcEliminatePayload = {
  matchId: string;
  eliminationJournalId: string;
  effectiveAt: string;
  amountMinor: number;
};

/** intercompany — mirror (bidirectional IC transaction creation) */
export type IcMirrorPayload = {
  senderCompanyId: string;
  receiverCompanyId: string;
  amountMinor: number;
  currency: string;
  reference: string;
  transactionId: string;
  side: 'sender' | 'receiver';
};

/** intercompany — netting */
export type IcNetPayload = {
  companyPairKey: string;
  periodKey: string;
  netAmountMinor: number;
  currency: string;
};

/** expense-management — reimburse */
export type ExpenseReimbursePayload = {
  expenseReportId: string;
  employeeId: string;
  effectiveAt: string;
  amountMinor: number;
  currency: string;
};

/** subscription-billing — invoice */
export type SubscriptionInvoicePayload = {
  subscriptionId: string;
  billingCycleId: string;
  amountMinor: number;
  periodStart: string;
  periodEnd: string;
};

/** project-accounting — cost posting */
export type ProjectCostPayload = {
  projectId: string;
  costType: 'labor' | 'material' | 'overhead' | 'subcontract';
  amountMinor: number;
  periodKey: string;
};

/** gl-platform — period management */
export type GlPeriodOpenPayload = {
  ledgerId: string;
  periodKey: string;
  companyId: string;
};

export type GlPeriodClosePayload = {
  ledgerId: string;
  periodKey: string;
  companyId: string;
  closeType: 'soft' | 'hard';
};

export type GlCoaPublishPayload = {
  ledgerId: string;
  version: number;
  accountCount: number;
};

/** accounting-hub — derivation engine */
export type AcctDeriveCommitPayload = {
  eventId: string;
  mappingVersion: number;
  effectiveAt: string;
  derivationId: string;
  journalLines: Array<{
    accountId: string;
    side: 'debit' | 'credit';
    amountMinor: number;
  }>;
};

export type AcctMappingPublishPayload = {
  mappingId: string;
  version: number;
  ruleCount: number;
};

export type GlReclassRunPayload = {
  periodKey: string;
  effectiveAt: string;
  reclassCount: number;
  totalMinor: number;
  /** M-12: Captured reclassification derivation evidence */
  reclassEvidence?: unknown[];
};

export type GlAllocationRunPayload = {
  periodKey: string;
  effectiveAt: string;
  allocationMethod: 'proportional' | 'fixed' | 'step_down';
  poolCount: number;
  /** M-12: Captured allocation derivation evidence */
  allocationEvidence?: unknown[];
};

export type GlAccrualRunPayload = {
  periodKey: string;
  effectiveAt: string;
  accrualCount: number;
  totalMinor: number;
};

/** financial-close — period close engine */
export type CloseTaskCompletePayload = {
  closeRunId: string;
  taskId: string;
  evidenceRef?: string;
};

export type CloseRunFinalizePayload = {
  closeRunId: string;
  periodKey: string;
  companyId: string;
  taskCount: number;
};

export type CloseAdjustmentPostPayload = {
  closeRunId: string;
  journalId: string;
  effectiveAt: string;
  adjustmentType: 'accrual' | 'reclassification' | 'allocation' | 'manual';
};

export type CloseLockHardPayload = {
  closeRunId: string;
  periodKey: string;
  companyId: string;
  ledgerId: string;
};

/** withholding-tax — WHT engine */
export type WhtCertificateIssuePayload = {
  certificateNo: string;
  supplierId: string;
  amountMinor: number;
  whtCode: string;
  taxPeriod: string;
};

export type WhtRemitPayload = {
  remittanceId: string;
  taxAuthority: string;
  totalMinor: number;
  taxPeriod: string;
};

/** transfer-pricing — arm's-length validation */
export type TpPolicyPublishPayload = {
  policyId: string;
  version: number;
  method: 'cup' | 'rpm' | 'cpm' | 'tnmm' | 'psm';
};

export type TpPriceComputePayload = {
  transactionId: string;
  policyId: string;
  effectiveAt: string;
  computedPriceMinor: number;
  armLengthRange: { lowMinor: number; highMinor: number };
};

/** treasury — internal cash transfer */
export type TreasuryTransferPayload = {
  fromAccountId: string;
  toAccountId: string;
  amountMinor: number;
  currency: string;
  transferDate: string;
  memo?: string;
};

/** consolidation — IC elimination posting */
export type ConsolidationEliminatePayload = {
  subsidiaryId: string;
  periodKey: string;
  eliminationEntries: Array<{
    accountId: string;
    side: 'debit' | 'credit';
    amountMinor: number;
  }>;
  /** Source discriminator for unified elimination routing (M-09) */
  sourceType?: 'ic_elimination' | 'consolidation_adjustment' | 'translation' | 'ownership_change';
  /** Traceability ref back to source document / run */
  sourceRefId?: string;
  /** Ownership percentage at time of elimination (for ownership changes) */
  ownershipPct?: number;
  /** Consolidation method applied */
  consolidationMethod?: 'full' | 'equity' | 'fair_value';
};

/** consolidation — FX translation posting */
export type ConsolidationTranslatePayload = {
  subsidiaryId: string;
  periodKey: string;
  targetCurrency: string;
  ctaAmountMinor: number;
};

/** cost-accounting — cost allocation posting */
export type CostAllocatePayload = {
  allocationRunId: string;
  periodKey: string;
  poolAccountId: string;
  allocations: Array<{
    costCenterId: string;
    amountMinor: number;
  }>;
};

/** credit-management — credit limit update */
export type CreditLimitUpdatePayload = {
  customerId: string;
  newLimitMinor: number;
  effectiveAt: string;
  currency: string;
  reason: string;
  approvedBy: string;
};

/** bank-reconciliation — confirm match */
export type BankReconConfirmPayload = {
  bankStatementId: string;
  matches: Array<{
    bankLineId: string;
    ledgerEntryId: string;
    confidence: number;
  }>;
};

/** credit-management — create dunning run with notices */
export type DunningRunCreatePayload = {
  runDate: string;
  cutoffDate: string;
  notices: Array<{
    customerId: string;
    invoiceId?: string;
    noticeLevel: 1 | 2 | 3;
    actionType: 'friendly_reminder' | 'formal_demand' | 'legal_notice';
    amountOutstandingMinor: number;
    dueDate?: string;
  }>;
};

/** payments — create payment */
export type PaymentCreatePayload = {
  paymentType: 'receive' | 'pay' | 'internal_transfer';
  partyType?: 'customer' | 'supplier' | 'employee' | 'other';
  partyId?: string;
  paidFromAccountId: string;
  paidToAccountId: string;
  paidAmountMinor: number;
  paidCurrencyCode: string;
  receivedAmountMinor: number;
  receivedCurrencyCode: string;
  fxRate?: string;
  paymentDate: string;
  paymentMethodId?: string;
  bankAccountId?: string;
  referenceNo?: string;
  memo?: string;
};

// ── Provisions (IAS 37) ──────────────────────────────────

/** provisions — recognise provision */
export type ProvisionRecognisePayload = {
  provisionId: string;
  obligationType:
  | 'legal'
  | 'constructive'
  | 'onerous-contract'
  | 'decommissioning'
  | 'warranty'
  | 'restructuring';
  bestEstimateMinor: number;
  discountRate?: number;
  recognitionDate: string;
};

/** provisions — utilise provision */
export type ProvisionUtilisePayload = {
  provisionId: string;
  amountMinor: number;
  utilisationDate: string;
  reason: string;
};

/** provisions — reverse provision */
export type ProvisionReversePayload = {
  provisionId: string;
  amountMinor: number;
  reversalDate: string;
  reason: string;
};

// ── Intangible Assets (IAS 38) ───────────────────────────

/** intangible-assets — capitalise R&D / intangible */
export type IntangibleCapitalisePayload = {
  assetId: string;
  phase: 'research' | 'development';
  costsMinor: number;
  periodKey: string;
  criteriaMet?: boolean;
};

/** intangible-assets — amortise intangible */
export type IntangibleAmortisePayload = {
  assetId: string;
  periodKey: string;
  amortisationMinor: number;
  method: 'straight-line' | 'units-of-production' | 'reducing-balance';
};

/** intangible-assets — impair intangible */
export type IntangibleImpairPayload = {
  assetId: string;
  impairmentMinor: number;
  recoverableAmountMinor: number;
  impairmentDate: string;
};

// ── Financial Instruments (IFRS 9 / IAS 32) ─────────────

/** financial-instruments — fair value change */
export type FiFvChangePayload = {
  instrumentId: string;
  prevFvMinor: number;
  currFvMinor: number;
  classification: 'amortised-cost' | 'fvoci' | 'fvtpl';
  periodKey: string;
};

/** financial-instruments — EIR accrual */
export type FiEirAccrualPayload = {
  instrumentId: string;
  periodKey: string;
  effectiveAt: string;
  interestMinor: number;
  effectiveRate: number;
};

// ── Hedge Accounting (IFRS 9 §6) ────────────────────────

/** hedge-accounting — designate hedge */
export type HedgeDesignatePayload = {
  designationId: string;
  hedgingInstrumentId: string;
  hedgedItem: string;
  hedgeType: 'fair-value' | 'cash-flow' | 'net-investment';
  hedgedRisk: 'interest-rate' | 'fx' | 'commodity-price' | 'credit' | 'equity-price';
  designationDate: string;
};

/** hedge-accounting — effectiveness test */
export type HedgeEffectivenessPayload = {
  designationId: string;
  testType: 'prospective' | 'retrospective';
  testMethod: 'dollar-offset' | 'regression' | 'var-reduction' | 'critical-terms' | 'other';
  instrumentFvChangeMinor: number;
  hedgedItemFvChangeMinor: number;
  periodKey: string;
};

/** hedge-accounting — OCI reclassification */
export type HedgeOciReclassPayload = {
  designationId: string;
  reclassAmountMinor: number;
  fromReserve: 'oci' | 'pnl';
  periodKey: string;
  effectiveAt: string;
  reason: string;
};

// ── Deferred Tax (IAS 12) ─────────────────────────────────

/** deferred-tax — calculate temporary differences */
export type DeferredTaxCalculatePayload = {
  entityId: string;
  periodKey: string;
  taxRate: number;
  temporaryDifferences: Array<{
    accountId: string;
    carryingMinor: number;
    taxBaseMinor: number;
    differenceType: 'taxable' | 'deductible';
  }>;
};

/** deferred-tax — recognise DTA/DTL */
export type DeferredTaxRecognisePayload = {
  entityId: string;
  periodKey: string;
  dtaMinor: number;
  dtlMinor: number;
  movementMinor: number;
  recogniseTo: 'pnl' | 'oci' | 'equity';
};

// ── Impairment of Assets (IAS 36) ─────────────────────────

/** impairment — test for impairment */
export type ImpairmentTestPayload = {
  assetId: string;
  cguId?: string;
  carryingAmountMinor: number;
  recoverableAmountMinor: number;
  viuMinor: number;
  fvlcdMinor: number;
  periodKey: string;
};

/** impairment — recognise impairment loss */
export type ImpairmentRecognisePayload = {
  assetId: string;
  cguId?: string;
  lossMinor: number;
  assetType: 'ppe' | 'intangible' | 'goodwill' | 'rou';
  impairmentDate: string;
};

/** impairment — reverse impairment loss (not for goodwill) */
export type ImpairmentReversePayload = {
  assetId: string;
  reversalMinor: number;
  newCarryingMinor: number;
  reversalDate: string;
  reason: string;
};

// ── Inventory Valuation (IAS 2) ───────────────────────────

/** inventory-valuation — cost inventory (FIFO/WAC/specific) */
export type InventoryCostingPayload = {
  itemId: string;
  method: 'fifo' | 'weighted-average' | 'specific-identification';
  quantityOnHand: number;
  totalCostMinor: number;
  unitCostMinor: number;
  periodKey: string;
};

/** inventory-valuation — NRV write-down/reversal */
export type InventoryNrvAdjustPayload = {
  itemId: string;
  costMinor: number;
  nrvMinor: number;
  writedownMinor: number;
  periodKey: string;
  direction: 'writedown' | 'reversal';
};

// ── Government Grants (IAS 20) ────────────────────────────

/** government-grants — recognise grant */
export type GrantRecognisePayload = {
  grantId: string;
  approach: 'income' | 'capital';
  amountMinor: number;
  grantDate: string;
  relatedAssetId?: string;
  conditions: string;
};

/** government-grants — amortise deferred grant income */
export type GrantAmortisePayload = {
  grantId: string;
  periodKey: string;
  amortisationMinor: number;
  remainingMinor: number;
};

// ── Biological Assets (IAS 41) ────────────────────────────

/** biological-assets — fair value measurement */
export type BioAssetMeasurePayload = {
  assetId: string;
  assetClass: 'bearer-plant' | 'consumable' | 'produce';
  prevFvMinor: number;
  currFvMinor: number;
  costsToSellMinor: number;
  periodKey: string;
};

/** biological-assets — harvest transfer to inventory */
export type BioAssetHarvestPayload = {
  assetId: string;
  produceId: string;
  harvestDate: string;
  fvAtHarvestMinor: number;
  costsToSellMinor: number;
  quantityHarvested: number;
  uom: string;
};

// ── Investment Property (IAS 40) ──────────────────────────

/** investment-property — fair value or cost model measurement */
export type InvPropertyMeasurePayload = {
  propertyId: string;
  model: 'fair-value' | 'cost';
  prevValueMinor: number;
  currValueMinor: number;
  periodKey: string;
  valuerId?: string;
};

/** investment-property — transfer to/from investment property */
export type InvPropertyTransferPayload = {
  propertyId: string;
  direction: 'to-investment' | 'from-investment';
  fromCategory: 'ppe' | 'inventory' | 'owner-occupied';
  toCategory: 'ppe' | 'inventory' | 'owner-occupied' | 'investment-property';
  transferDate: string;
  carryingMinor: number;
  fairValueMinor?: number;
};

// ── Employee Benefits (IAS 19) ────────────────────────────

/** employee-benefits — accrue short-term/post-employment benefits */
export type EmpBenefitAccruePayload = {
  planId: string;
  benefitType:
  | 'short-term'
  | 'post-employment-db'
  | 'post-employment-dc'
  | 'termination'
  | 'other-long-term';
  periodKey: string;
  effectiveAt: string;
  serviceCostMinor: number;
  interestCostMinor: number;
  expectedReturnMinor: number;
};

/** employee-benefits — remeasure DBO (actuarial gains/losses) */
export type EmpBenefitRemeasurePayload = {
  planId: string;
  periodKey: string;
  dboMinor: number;
  planAssetsMinor: number;
  actuarialGainLossMinor: number;
  recogniseTo: 'oci' | 'pnl';
  assumptions: {
    discountRate: number;
    salaryGrowthRate: number;
    mortalityTable?: string;
  };
};

// ── Borrowing Costs (IAS 23) ──────────────────────────────

/** borrowing-costs — capitalise borrowing costs to qualifying asset */
export type BorrowCostCapitalisePayload = {
  qualifyingAssetId: string;
  periodKey: string;
  borrowingCostMinor: number;
  capitalisationRate: number;
  eligibleExpenditureMinor: number;
};

/** borrowing-costs — cease capitalisation */
export type BorrowCostCeasePayload = {
  qualifyingAssetId: string;
  cessationDate: string;
  reason: 'completed' | 'suspended' | 'abandoned';
  totalCapitalisedMinor: number;
};

// ── Share-Based Payment (IFRS 2) ──────────────────────────

/** share-based-payment — record grant */
export type SbpGrantPayload = {
  grantId: string;
  settlementType: 'equity' | 'cash' | 'choice';
  grantDate: string;
  vestingPeriodMonths: number;
  instrumentsGranted: number;
  fairValuePerUnitMinor: number;
};

/** share-based-payment — record vesting expense */
export type SbpVestPayload = {
  grantId: string;
  periodKey: string;
  expenseMinor: number;
  cumulativeExpenseMinor: number;
  forfeitureRate: number;
};

/** share-based-payment — period expense recognition */
export type SbpExpensePayload = {
  grantId: string;
  periodKey: string;
  expenseMinor: number;
  recogniseTo: 'equity-reserve' | 'liability';
};

// ── Domain Intent Union ─────────────────────────────────

// ── Intent variant union (discriminated by `type`) ──────

type DomainIntentVariant =
  // Core (existing)
  | { type: 'accounting.post'; payload: JournalPostPayload }
  | { type: 'inventory.adjust'; payload: StockAdjustPayload }
  | { type: 'tax.adjust'; payload: TaxAdjustPayload }
  // Accounting
  | { type: 'accounting.reverse'; payload: JournalReversePayload }
  | { type: 'accounting.accrue'; payload: AccrualPostPayload }
  // FX Management
  | { type: 'fx.revalue'; payload: FxRevaluePayload }
  | { type: 'fx.hedge.designate'; payload: FxHedgeDesignatePayload }
  // Fixed Assets
  | { type: 'asset.depreciate'; payload: AssetDepreciatePayload }
  | { type: 'asset.dispose'; payload: AssetDisposePayload }
  | { type: 'asset.revalue'; payload: AssetRevaluePayload }
  // Revenue Recognition
  | { type: 'revenue.recognize'; payload: RevenueRecognizePayload }
  | { type: 'revenue.defer'; payload: RevenueDeferPayload }
  // Lease Accounting
  | { type: 'lease.amortize'; payload: LeaseAmortizePayload }
  | { type: 'lease.modify'; payload: LeaseModifyPayload }
  // Payables
  | { type: 'payables.pay'; payload: PayablesPayPayload }
  | { type: 'payables.invoice.post'; payload: PayablesInvoicePostPayload }
  | { type: 'payables.invoice.approve'; payload: PayablesInvoiceApprovePayload }
  | { type: 'payables.payment.approve'; payload: PayablesPaymentApprovePayload }
  // Receivables
  | { type: 'receivables.allocate'; payload: ReceivablesAllocatePayload }
  | { type: 'receivables.invoice.post'; payload: ReceivablesInvoicePostPayload }
  // Budgeting
  | { type: 'budget.commit'; payload: BudgetCommitPayload }
  // Intercompany
  | { type: 'ic.match'; payload: IcMatchPayload }
  | { type: 'ic.mirror'; payload: IcMirrorPayload }
  | { type: 'ic.eliminate'; payload: IcEliminatePayload }
  | { type: 'ic.net'; payload: IcNetPayload }
  // Expense Management
  | { type: 'expense.reimburse'; payload: ExpenseReimbursePayload }
  // Subscription Billing
  | { type: 'subscription.invoice'; payload: SubscriptionInvoicePayload }
  // Project Accounting
  | { type: 'project.cost'; payload: ProjectCostPayload }
  // GL Platform
  | { type: 'gl.period.open'; payload: GlPeriodOpenPayload }
  | { type: 'gl.period.close'; payload: GlPeriodClosePayload }
  | { type: 'gl.coa.publish'; payload: GlCoaPublishPayload }
  // Accounting Hub
  | { type: 'acct.derive.commit'; payload: AcctDeriveCommitPayload }
  | { type: 'acct.mapping.publish'; payload: AcctMappingPublishPayload }
  | { type: 'gl.reclass.run'; payload: GlReclassRunPayload }
  | { type: 'gl.allocation.run'; payload: GlAllocationRunPayload }
  | { type: 'gl.accrual.run'; payload: GlAccrualRunPayload }
  // Financial Close
  | { type: 'close.task.complete'; payload: CloseTaskCompletePayload }
  | { type: 'close.run.finalize'; payload: CloseRunFinalizePayload }
  | { type: 'close.adjustment.post'; payload: CloseAdjustmentPostPayload }
  | { type: 'close.lock.hard'; payload: CloseLockHardPayload }
  // Withholding Tax
  | { type: 'wht.certificate.issue'; payload: WhtCertificateIssuePayload }
  | { type: 'wht.remit'; payload: WhtRemitPayload }
  // Transfer Pricing
  | { type: 'tp.policy.publish'; payload: TpPolicyPublishPayload }
  | { type: 'tp.price.compute'; payload: TpPriceComputePayload }
  // Treasury
  | { type: 'treasury.transfer'; payload: TreasuryTransferPayload }
  // Consolidation
  | { type: 'consolidation.eliminate'; payload: ConsolidationEliminatePayload }
  | { type: 'consolidation.translate'; payload: ConsolidationTranslatePayload }
  // Cost Accounting
  | { type: 'cost.allocate'; payload: CostAllocatePayload }
  // Credit Management
  | { type: 'credit.limit.update'; payload: CreditLimitUpdatePayload }
  | { type: 'credit.dunning.create'; payload: DunningRunCreatePayload }
  // Bank Reconciliation
  | { type: 'bank-recon.confirm'; payload: BankReconConfirmPayload }
  // Payments
  | { type: 'payment.create'; payload: PaymentCreatePayload }
  // Provisions (IAS 37)
  | { type: 'provision.recognise'; payload: ProvisionRecognisePayload }
  | { type: 'provision.utilise'; payload: ProvisionUtilisePayload }
  | { type: 'provision.reverse'; payload: ProvisionReversePayload }
  // Intangible Assets (IAS 38)
  | { type: 'intangible.capitalise'; payload: IntangibleCapitalisePayload }
  | { type: 'intangible.amortise'; payload: IntangibleAmortisePayload }
  | { type: 'intangible.impair'; payload: IntangibleImpairPayload }
  // Financial Instruments (IFRS 9)
  | { type: 'fi.fv.change'; payload: FiFvChangePayload }
  | { type: 'fi.eir.accrue'; payload: FiEirAccrualPayload }
  // Hedge Accounting (IFRS 9 §6)
  | { type: 'hedge.designate'; payload: HedgeDesignatePayload }
  | { type: 'hedge.effectiveness'; payload: HedgeEffectivenessPayload }
  | { type: 'hedge.oci.reclass'; payload: HedgeOciReclassPayload }
  // Deferred Tax (IAS 12)
  | { type: 'deferred-tax.calculate'; payload: DeferredTaxCalculatePayload }
  | { type: 'deferred-tax.recognise'; payload: DeferredTaxRecognisePayload }
  // Impairment of Assets (IAS 36)
  | { type: 'impairment.test'; payload: ImpairmentTestPayload }
  | { type: 'impairment.recognise'; payload: ImpairmentRecognisePayload }
  | { type: 'impairment.reverse'; payload: ImpairmentReversePayload }
  // Inventory Valuation (IAS 2)
  | { type: 'inventory.costing'; payload: InventoryCostingPayload }
  | { type: 'inventory.nrv.adjust'; payload: InventoryNrvAdjustPayload }
  // Government Grants (IAS 20)
  | { type: 'grant.recognise'; payload: GrantRecognisePayload }
  | { type: 'grant.amortise'; payload: GrantAmortisePayload }
  // Biological Assets (IAS 41)
  | { type: 'bio-asset.measure'; payload: BioAssetMeasurePayload }
  | { type: 'bio-asset.harvest'; payload: BioAssetHarvestPayload }
  // Investment Property (IAS 40)
  | { type: 'inv-property.measure'; payload: InvPropertyMeasurePayload }
  | { type: 'inv-property.transfer'; payload: InvPropertyTransferPayload }
  // Employee Benefits (IAS 19)
  | { type: 'emp-benefit.accrue'; payload: EmpBenefitAccruePayload }
  | { type: 'emp-benefit.remeasure'; payload: EmpBenefitRemeasurePayload }
  // Borrowing Costs (IAS 23)
  | { type: 'borrow-cost.capitalise'; payload: BorrowCostCapitalisePayload }
  | { type: 'borrow-cost.cease'; payload: BorrowCostCeasePayload }
  // Share-Based Payment (IFRS 2)
  | { type: 'sbp.grant'; payload: SbpGrantPayload }
  | { type: 'sbp.vest'; payload: SbpVestPayload }
  | { type: 'sbp.expense'; payload: SbpExpensePayload };

/**
 * Domain intent with optional idempotency key (SK-09).
 * Every variant carries `type`, `payload`, and an optional `idempotencyKey`.
 */
export type DomainIntent = DomainIntentVariant & { idempotencyKey?: string };

/** Extract the discriminant type string from a DomainIntent */
export type IntentType = DomainIntent['type'];
