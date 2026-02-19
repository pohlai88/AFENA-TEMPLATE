/**
 * afenda-crud-convenience — Convenience barrel for domain + infrastructure services.
 *
 * This package provides "one import" ergonomics for callers that need both
 * domain services and CRUD infrastructure helpers. It does NOT contain any
 * kernel logic — it's purely a convenience re-export layer.
 *
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  ARCHITECTURE NOTE                                           ║
 * ║  This is Layer 3 convenience only. For kernel-level calls:   ║
 * ║    import { mutate } from 'afenda-crud';                     ║
 * ║  For infrastructure helpers:                                 ║
 * ║    import { checkRateLimit } from 'afenda-crud/internal';    ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * Usage:
 *   import { calculateLineTax, resolvePrice } from 'afenda-crud-convenience';
 *   import { checkRateLimit } from 'afenda-crud-convenience';
 */

// ── Accounting Domain ─────────────────────────────────────────────────────────
export {
    allocatePayment, assertPeriodOpen, autoMatchStatementLines, calculateDepreciation, calculateLineTax,
    calculateTaxForLine, checkPeriodOpen, createRevenueSchedule, generateDepreciationSchedule, generateStraightLineSchedule, getAllocationsForTarget, getPaymentAllocationSummary, lookupFxRate, recognizeRevenue, recordReconciliationMatch, resolveTaxRate, scoreMatch
} from 'afenda-accounting';
export type {
    AllocationResult, AutoMatchResult, DepreciationPeriodResult,
    DepreciationScheduleResult, FiscalPeriodStatus, FxRateResult, MatchCandidate, PaymentAllocationSummary, RecognitionLineResult,
    RecognitionScheduleResult, ResolvedTaxRate, StatementLineForMatch, TaxLineResult
} from 'afenda-accounting';

// ── CRM Domain ────────────────────────────────────────────────────────────────
export {
    checkBudget,
    commitBudget, evaluateDiscounts,
    priceLineItem, releaseBudgetCommitment, resolvePrice
} from 'afenda-crm';
export type {
    AppliedDiscount, BudgetCheckResult, LinePricingResult, ResolvedPrice
} from 'afenda-crm';

// ── Inventory Domain ──────────────────────────────────────────────────────────
export {
    allocateLandedCost, calculateCostRollup, convertQuantity,
    convertUom, explodeBom,
    explodeBomFromDb, generateWipJournalEntries, getCostRollup, resolveConversion, traceBackward, traceForward, traceRecall
} from 'afenda-inventory';
export type {
    AffectedMovement, BomExplosionLine,
    BomExplosionResult, ConversionResult, CostRollupResult, LandedCostAllocationResult, LandedCostLineAllocation, RecallTraceResult, ReceiptLineInput, ResolvedConversion, WipJournalEntry, WipJournalSpec, WipMovementType
} from 'afenda-inventory';

// ── Intercompany Domain ───────────────────────────────────────────────────────
export {
    createIntercompanyTransaction, generateEliminationEntries,
    getUnmatchedTransactions, matchIntercompanyTransactions
} from 'afenda-intercompany';
export type {
    EliminationEntry, IntercompanyPairResult, MatchedPair
} from 'afenda-intercompany';

// ── Infrastructure services (from afenda-crud/internal) ───────────────────────
export {
    // Job quotas
    acquireJobSlot,
    // Doc numbers
    allocateDocNumber,
    // Rate limiting
    checkRateLimit, computeSchemaHash, getJobQuotaConfig, getJobQuotaState, getRateLimitConfig, getValueColumn,
    // Custom fields
    loadFieldDefs,
    // Metering
    meterApiRequest, meterDbTimeout, meterJobRun, meterStorageBytes, processSyncQueue,
    // Specialised reads
    readDeliveryNoteWithLines, releaseJob, resolveFiscalYear, syncCustomFieldValues, validateCustomData,
    // Webhook verification
    verifyWebhookSignature
} from 'afenda-crud/internal';
export type {
    CustomFieldDef, DocNumberResult, JobQuotaConfig, JobQuotaDenyReason, JobQuotaResult, RateLimitConfig,
    RateLimitResult, ValidationError, WebhookDeliveryResult,
    WebhookDispatchResult
} from 'afenda-crud/internal';

