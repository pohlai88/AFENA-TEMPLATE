// ── K-05: packages/crud exports ONLY these 3 functions ──
// Internal handlers, audit writer, version helpers are NEVER exported.
export { mutate } from './mutate';
export { readEntity, listEntities } from './read';
export { readDeliveryNoteWithLines } from './read-delivery-note';

// ── Re-export context type + system context builder for callers ──
export type { MutationContext } from './context';
export { buildSystemContext } from './context';

// ── Governors: Rate Limiting + Job Quotas + Metering ────
export {
    checkRateLimit,
    getRateLimitConfig,
    _resetRateLimitStore,
} from './rate-limiter';
export type {
    RateLimitConfig,
    RateLimitResult,
} from './rate-limiter';

export {
    acquireJobSlot,
    releaseJob,
    getJobQuotaState,
    getJobQuotaConfig,
    _resetJobQuotaStore,
} from './job-quota';
export type {
    JobQuotaConfig,
    JobQuotaResult,
    JobQuotaDenyReason,
} from './job-quota';

export {
    meterApiRequest,
    meterJobRun,
    meterDbTimeout,
    meterStorageBytes,
} from './metering';

// ── Custom field services ────────────────────────────────
export {
    loadFieldDefs,
    validateCustomData,
    getValueColumn,
    computeSchemaHash,
} from './services/custom-field-validation';
export type {
    CustomFieldDef,
    ValidationError,
} from './services/custom-field-validation';

export {
    syncCustomFieldValues,
    processSyncQueue,
} from './services/custom-field-sync';

// ── Doc number allocation ───────────────────────────────
export {
    allocateDocNumber,
    resolveFiscalYear,
} from './services/doc-number';
export type {
    DocNumberResult,
} from './services/doc-number';

// ── FX rate lookup ──────────────────────────────────────
export {
    lookupFxRate,
} from './services/fx-lookup';
export type {
    FxRateResult,
} from './services/fx-lookup';

// ── Fiscal period guards ────────────────────────────────
export {
    checkPeriodOpen,
    assertPeriodOpen,
} from './services/fiscal-period';
export type {
    FiscalPeriodStatus,
} from './services/fiscal-period';

// ── Tax calculation ────────────────────────────────────
export {
    resolveTaxRate,
    calculateLineTax,
    calculateTaxForLine,
} from './services/tax-calc';
export type {
    ResolvedTaxRate,
    TaxLineResult,
} from './services/tax-calc';

// ── Payment allocation ────────────────────────────────
export {
    allocatePayment,
    getPaymentAllocationSummary,
    getAllocationsForTarget,
} from './services/payment-allocation';
export type {
    AllocationResult,
    PaymentAllocationSummary,
} from './services/payment-allocation';

// ── Webhook dispatch ──────────────────────────────────
export {
    dispatchWebhookEvent,
    verifyWebhookSignature,
} from './services/webhook-dispatch';
export type {
    WebhookDeliveryResult,
    WebhookDispatchResult,
} from './services/webhook-dispatch';

// ── Pricing engine ────────────────────────────────────
export {
    resolvePrice,
    evaluateDiscounts,
    priceLineItem,
} from './services/pricing-engine';
export type {
    ResolvedPrice,
    AppliedDiscount,
    LinePricingResult,
} from './services/pricing-engine';

// ── 3-way match ───────────────────────────────────────
export {
    evaluateMatch,
    matchDocumentLines,
    overrideMatchException,
} from './services/three-way-match';
export type {
    MatchInput,
    MatchTolerance,
    MatchEvaluation,
} from './services/three-way-match';

// ── UOM conversion ────────────────────────────────────
export {
    resolveConversion,
    convertQuantity,
    convertUom,
} from './services/uom-conversion';
export type {
    ResolvedConversion,
    ConversionResult,
} from './services/uom-conversion';

// ── Depreciation engine ───────────────────────────────
export {
    generateDepreciationSchedule,
    calculateDepreciation,
} from './services/depreciation-engine';
export type {
    DepreciationPeriodResult,
    DepreciationScheduleResult,
} from './services/depreciation-engine';

// ── Revenue recognition ───────────────────────────────
export {
    generateStraightLineSchedule,
    createRevenueSchedule,
    recognizeRevenue,
} from './services/revenue-recognition';
export type {
    RecognitionLineResult,
    RecognitionScheduleResult,
} from './services/revenue-recognition';

// ── Budget enforcement ────────────────────────────────
export {
    checkBudget,
    commitBudget,
    releaseBudgetCommitment,
} from './services/budget-enforcement';
export type {
    BudgetCheckResult,
} from './services/budget-enforcement';

// ── Landed cost allocation ────────────────────────────
export {
    allocateLandedCost,
} from './services/landed-cost-engine';
export type {
    ReceiptLineInput,
    LandedCostLineAllocation,
    LandedCostAllocationResult,
} from './services/landed-cost-engine';

// ── Lot recall / traceability ─────────────────────────
export {
    traceForward,
    traceBackward,
    traceRecall,
} from './services/lot-recall';
export type {
    AffectedMovement,
    RecallTraceResult,
} from './services/lot-recall';

// ── Intercompany elimination ─────────────────────────
export {
    createIntercompanyTransaction,
    generateEliminationEntries,
    markEliminated,
} from './services/intercompany';
export type {
    IntercompanyPairResult,
    EliminationEntry,
} from './services/intercompany';

// ── Bank reconciliation auto-match ───────────────────
export {
    scoreMatch,
    autoMatchBatch,
    persistReconciliationMatch,
} from './services/bank-reconciliation';
export type {
    StatementLineForMatch,
    MatchCandidate,
    AutoMatchResult,
} from './services/bank-reconciliation';


// ── Manufacturing engine ─────────────────────────────
export {
    explodeBom,
    explodeBomFromDb,
    calculateCostRollup,
    getCostRollup,
    generateWipJournalEntries,
} from './services/manufacturing-engine';
export type {
    WipMovementType,
    BomExplosionLine,
    BomExplosionResult,
    CostRollupResult,
    WipJournalSpec,
    WipJournalEntry,
} from './services/manufacturing-engine';
