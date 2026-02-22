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
 *   import { allocateDocNumber, checkRateLimit } from 'afenda-crud-convenience';
 *   import { resolveFiscalYear } from 'afenda-crud-convenience';
 */

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

