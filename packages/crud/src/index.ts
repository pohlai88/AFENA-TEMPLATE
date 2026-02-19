/**
 * afenda-crud — Mutation Kernel (K-05 Sealed)
 *
 * This is the ONLY public API surface of the CRUD package.
 * Everything else is internal to this package or lives in `afenda-crud/internal`.
 *
 * INVARIANT: This file must export ≤10 symbols. The CI gate `G-CRUD-01` enforces this.
 * See: tools/ci-gates/crud-exports.test.ts
 *
 * If you need infrastructure services (rate limiting, metering, custom fields, etc.),
 * import from `afenda-crud/internal`.
 *
 * If you need domain services (accounting, CRM, inventory, etc.),
 * import directly from the domain package (e.g. `afenda-accounting`).
 */

// ── Mutation kernel ──────────────────────────────────────────────────────────
export { mutate } from './mutate';
export { listEntities, readEntity } from './read';

// ── Context builders ─────────────────────────────────────────────────────────
export { buildSystemContext, buildUserContext } from './context';
export type { MutationContext } from './context';

// ── Observability hooks ──────────────────────────────────────────────────────
export { setObservabilityHooks } from './observability-hooks';
export type { ObservabilityHooks } from './observability-hooks';

// ── Public types (needed to call mutate / read / list) ───────────────────────
export type { ApiResponse, MutationReceipt, MutationSpec } from 'afenda-canon';

// ── Error codes ──────────────────────────────────────────────────────────────
export { KERNEL_ERROR_CODES } from './errors';
export type { KernelErrorCode } from './errors';

