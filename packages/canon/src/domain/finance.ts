/**
 * afenda-canon/domain/finance — Finance domain intent payloads & ports.
 *
 * 37 packages across: Core GL, Sub-Ledgers, Assets, Treasury, Tax,
 * Consolidation, Planning, and 12 IFRS standards.
 *
 * ADDING A NEW FINANCE INTENT PAYLOAD:
 * 1. Define the type in ../types/domain-intent.ts
 * 2. Add the variant to the DomainIntentVariant union (same file)
 * 3. Re-export the type HERE
 * 4. Re-export from ../index.ts (root barrel, backward compat)
 * 5. Register in ../registries/domain-intent-registry.ts
 * 6. Grep all domain consumers and supply every required field
 * 7. Run: pnpm --filter "./business-domain/finance/**" exec tsc --noEmit
 */

// ── Re-export shared types for convenience ──────────────────
export type { CalculatorResult } from '../types/calculator-result';
export type { DomainContext } from '../types/domain-context';
export { DomainError } from '../types/domain-error';
export type { DomainIntent } from '../types/domain-intent';
export type { DomainResult } from '../types/domain-result';
export { stableCanonicalJson } from '../utils/stable-json';

// ── Branded types used by finance adapters ──────────────────
export {
  asCompanyId,
  asFiscalPeriodKey,
  asLedgerId,
  asSiteId,
  isCompanyId,
  isFiscalPeriodKey,
  isLedgerId,
  isSiteId,
  parseCompanyId,
  parseFiscalPeriodKey,
  parseLedgerId,
  parseSiteId
} from '../types/branded';
export type { CompanyId, FiscalPeriodKey, LedgerId, SiteId } from '../types/branded';

// ── Core Ledger & GL ────────────────────────────────────────
export type {
  AccrualPostPayload,
  AcctDeriveCommitPayload,
  AcctMappingPublishPayload,
  GlAccrualRunPayload,
  GlAllocationRunPayload,
  GlCoaPublishPayload,
  GlPeriodClosePayload,
  GlPeriodOpenPayload,
  GlReclassRunPayload,
  JournalPostPayload,
  JournalReversePayload
} from '../types/domain-intent';

// ── Sub-Ledgers ─────────────────────────────────────────────
export type {
  ExpenseReimbursePayload,
  PayablesInvoiceApprovePayload,
  PayablesInvoicePostPayload,
  PayablesPayPayload,
  PayablesPaymentApprovePayload,
  ProjectCostPayload,
  ReceivablesAllocatePayload,
  ReceivablesInvoicePostPayload,
  RevenueDeferPayload,
  RevenueRecognizePayload,
  SubscriptionInvoicePayload
} from '../types/domain-intent';

// ── Intercompany ────────────────────────────────────────────
export type { IcEliminatePayload, IcMatchPayload, IcMirrorPayload, IcNetPayload } from '../types/domain-intent';

// ── Assets & Liabilities ────────────────────────────────────
export type {
  AssetDepreciatePayload,
  AssetDisposePayload,
  AssetRevaluePayload,
  IntangibleAmortisePayload,
  IntangibleCapitalisePayload,
  IntangibleImpairPayload,
  LeaseAmortizePayload,
  LeaseModifyPayload
} from '../types/domain-intent';

// ── Treasury & FX ───────────────────────────────────────────
export type {
  BankReconConfirmPayload,
  CreditLimitUpdatePayload,
  DunningRunCreatePayload,
  FxHedgeDesignatePayload,
  FxRevaluePayload,
  PaymentCreatePayload,
  TreasuryTransferPayload
} from '../types/domain-intent';

// ── Tax & Transfer Pricing ──────────────────────────────────
export type {
  TaxAdjustPayload,
  TpPolicyPublishPayload,
  TpPriceComputePayload,
  WhtCertificateIssuePayload,
  WhtRemitPayload
} from '../types/domain-intent';

// ── Consolidation & Close ───────────────────────────────────
export type {
  CloseAdjustmentPostPayload,
  CloseLockHardPayload,
  CloseRunFinalizePayload,
  CloseTaskCompletePayload,
  ConsolidationEliminatePayload,
  ConsolidationTranslatePayload
} from '../types/domain-intent';

// ── Planning & Costing ──────────────────────────────────────
export type { BudgetCommitPayload, CostAllocatePayload } from '../types/domain-intent';

// ── IFRS Packages ───────────────────────────────────────────
export type {
  BioAssetHarvestPayload,
  BioAssetMeasurePayload,
  BorrowCostCapitalisePayload,
  BorrowCostCeasePayload,
  DeferredTaxCalculatePayload,
  DeferredTaxRecognisePayload,
  EmpBenefitAccruePayload,
  EmpBenefitRemeasurePayload,
  FiEirAccrualPayload,
  FiFvChangePayload,
  GrantAmortisePayload,
  GrantRecognisePayload,
  HedgeDesignatePayload,
  HedgeEffectivenessPayload,
  HedgeOciReclassPayload,
  ImpairmentRecognisePayload,
  ImpairmentReversePayload,
  ImpairmentTestPayload,
  InvPropertyMeasurePayload,
  InvPropertyTransferPayload,
  InventoryCostingPayload,
  InventoryNrvAdjustPayload,
  ProvisionRecognisePayload,
  ProvisionReversePayload,
  ProvisionUtilisePayload,
  SbpExpensePayload,
  SbpGrantPayload,
  SbpVestPayload
} from '../types/domain-intent';

// ── Inventory (shared with supply-chain) ────────────────────
export type { StockAdjustPayload } from '../types/domain-intent';

// ── Port Interfaces (cross-cutting finance reads) ───────────
export type {
  AccountingReadPort,
  DocumentNumberPort,
  FxRateInfo,
  FxRatePort,
  FxRateType,
  JournalEntrySummary,
  LedgerControlPort,
  LedgerInfo,
  NumberSequenceInfo,
  PartyAddress,
  PartyInfo,
  PartyMasterPort,
  PartyType,
  PeriodInfo,
  PeriodStatus,
  TaxRateInfo,
  TaxRatePort,
  TaxType,
  TrialBalanceRow
} from '../ports/index';

