// ── K-05: packages/crud exports ONLY these 3 functions ──
// Internal handlers, audit writer, version helpers are NEVER exported.
export { mutate } from './mutate';
export { readEntity, listEntities } from './read';

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
