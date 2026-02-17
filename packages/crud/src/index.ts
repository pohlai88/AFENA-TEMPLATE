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

// ═══════════════════════════════════════════════════════
// Domain Services (re-exported from domain packages)
// ═══════════════════════════════════════════════════════

// ── Accounting Domain ───────────────────────────────────
export {
    lookupFxRate,
    checkPeriodOpen,
    assertPeriodOpen,
    resolveTaxRate,
    calculateLineTax,
    calculateTaxForLine,
    allocatePayment,
    getPaymentAllocationSummary,
    getAllocationsForTarget,
    generateDepreciationSchedule,
    calculateDepreciation,
    generateStraightLineSchedule,
    createRevenueSchedule,
    recognizeRevenue,
    scoreMatch,
    autoMatchStatementLines,
    recordReconciliationMatch,
} from 'afenda-accounting';
export type {
    FxRateResult,
    FiscalPeriodStatus,
    ResolvedTaxRate,
    TaxLineResult,
    AllocationResult,
    PaymentAllocationSummary,
    DepreciationPeriodResult,
    DepreciationScheduleResult,
    RecognitionLineResult,
    RecognitionScheduleResult,
    StatementLineForMatch,
    MatchCandidate,
    AutoMatchResult,
} from 'afenda-accounting';

// ── CRM Domain ──────────────────────────────────────────
export {
    resolvePrice,
    evaluateDiscounts,
    priceLineItem,
    checkBudget,
    commitBudget,
    releaseBudgetCommitment,
} from 'afenda-crm';
export type {
    ResolvedPrice,
    AppliedDiscount,
    LinePricingResult,
    BudgetCheckResult,
} from 'afenda-crm';

// ── Inventory Domain ────────────────────────────────────
export {
    resolveConversion,
    convertQuantity,
    convertUom,
    allocateLandedCost,
    traceForward,
    traceBackward,
    traceRecall,
    explodeBom,
    explodeBomFromDb,
    calculateCostRollup,
    getCostRollup,
    generateWipJournalEntries,
} from 'afenda-inventory';
export type {
    ResolvedConversion,
    ConversionResult,
    ReceiptLineInput,
    LandedCostLineAllocation,
    LandedCostAllocationResult,
    AffectedMovement,
    RecallTraceResult,
    WipMovementType,
    BomExplosionLine,
    BomExplosionResult,
    CostRollupResult,
    WipJournalSpec,
    WipJournalEntry,
} from 'afenda-inventory';

// ── Intercompany Domain ─────────────────────────────────
export {
    createIntercompanyTransaction,
    matchIntercompanyTransactions,
    generateEliminationEntries,
    getUnmatchedTransactions,
} from 'afenda-intercompany';
export type {
    IntercompanyPairResult,
    EliminationEntry,
    MatchedPair,
} from 'afenda-intercompany';

// ── Webhook dispatch ──────────────────────────────────
export {
    dispatchWebhookEvent,
    verifyWebhookSignature,
} from './services/webhook-dispatch';
export type {
    WebhookDeliveryResult,
    WebhookDispatchResult,
} from './services/webhook-dispatch';
