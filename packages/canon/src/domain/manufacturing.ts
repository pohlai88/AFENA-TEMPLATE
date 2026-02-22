/**
 * afenda-canon/domain/manufacturing — Manufacturing domain intent payloads & ports.
 *
 * TODO: 12 packages planned — production, bom, routing, quality-mgmt, plm,
 * shop-floor, maintenance, subcontracting, process-manufacturing,
 * variant-management, production-planning, traceability.
 *
 * When implementing:
 * 1. Define payload types in ../types/domain-intent.ts
 * 2. Re-export them here (grouped by sub-domain)
 * 3. Add port interfaces for cross-cutting reads
 * 4. Run: pnpm --filter "./business-domain/manufacturing/**" exec tsc --noEmit
 */

// ── Re-export shared types for convenience ──────────────────
export type { DomainContext } from '../types/domain-context';
export type { DomainResult } from '../types/domain-result';
export type { DomainIntent } from '../types/domain-intent';
export type { CalculatorResult } from '../types/calculator-result';
export { DomainError } from '../types/domain-error';
export { stableCanonicalJson } from '../utils/stable-json';

// ── Manufacturing Intent Payloads ───────────────────────────
// TODO: Add payload types as manufacturing packages are implemented
// Example:
//   export type { WorkOrderPayload } from '../types/domain-intent';
//   export type { BomExplosionPayload } from '../types/domain-intent';

// ── Port Interfaces ─────────────────────────────────────────
// TODO: Add manufacturing-specific ports as needed
// Example:
//   export type { BomPort, RoutingPort } from '../ports/index';
