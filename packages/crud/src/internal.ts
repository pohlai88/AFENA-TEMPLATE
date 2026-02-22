/**
 * afenda-crud/internal — Infrastructure services sub-path export.
 *
 * This sub-path exposes CRUD's infrastructure utilities that are NOT part of
 * the sealed kernel API (K-05). Import from here when you need:
 *   - Rate limiting / job quotas / metering
 *   - Custom field validation / sync
 *   - Document number allocation
 *   - Webhook signature verification
 *   - Specialised entity reads (delivery notes, legacy)
 *
 * ⚠️  Do NOT re-export anything from this file in packages/crud/src/index.ts.
 *     The kernel surface must stay sealed.
 *
 * Usage:
 *   import { checkRateLimit } from 'afenda-crud/internal';
 *   import { loadFieldDefs } from 'afenda-crud/internal';
 */

// ── Governors: Rate Limiting ─────────────────────────────────────────────────
export {
    _resetRateLimitStore, checkRateLimit,
    getRateLimitConfig
} from './plan/enforce/rate-limiter';
export type { RateLimitConfig, RateLimitResult } from './plan/enforce/rate-limiter';

// ── Governors: Job Quotas ────────────────────────────────────────────────────
export {
    _resetJobQuotaStore, acquireJobSlot, getJobQuotaConfig, getJobQuotaState, releaseJob
} from './job-quota';
export type {
    JobQuotaConfig, JobQuotaDenyReason, JobQuotaResult
} from './job-quota';

// ── Governors: Metering ──────────────────────────────────────────────────────
export {
    meterApiRequest, meterDbTimeout, meterJobRun, meterStorageBytes
} from './deliver/best-effort-metering';

// ── Custom field services ────────────────────────────────────────────────────
export {
    computeSchemaHash, getValueColumn, loadFieldDefs,
    validateCustomData
} from './plan/validate/custom-fields';
export type {
    CustomFieldDef,
    ValidationError
} from './plan/validate/custom-fields';

export {
    processSyncQueue, syncCustomFieldValues
} from './commit/sync-custom-fields';

// ── Doc number allocation ────────────────────────────────────────────────────
export {
    allocateDocNumber,
    resolveFiscalYear
} from './commit/allocate-doc-number';
export type { DocNumberResult } from './commit/allocate-doc-number';

// ── Webhook signature verification ─────────────────────────────────────────
// NOTE: Webhook *dispatch* (outgoing HTTP) is NOT here — it moved to the
//       worker package. Only inbound signature verification stays.
export { verifyWebhookSignature } from './services/webhook-dispatch';
export type {
    WebhookDeliveryResult,
    WebhookDispatchResult
} from './services/webhook-dispatch';

// ── Specialised entity reads ────────────────────────────────────────────────
export { readDeliveryNoteWithLines } from './read-delivery-note';

