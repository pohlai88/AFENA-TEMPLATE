/**
 * afenda-canon/domain/supply-chain — Supply Chain domain intent payloads & ports.
 *
 * TODO: 14 packages planned — procurement, purchasing, receiving, inventory,
 * lot-tracking, warehouse, landed-costs, supplier-management, contract-management,
 * demand-planning, mrp, logistics, returns-management, quality-control.
 *
 * When implementing:
 * 1. Define payload types in ../types/domain-intent.ts
 * 2. Re-export them here (grouped by sub-domain)
 * 3. Add port interfaces for cross-cutting reads
 * 4. Run: pnpm --filter "./business-domain/supply-chain/**" exec tsc --noEmit
 */

// ── Re-export shared types for convenience ──────────────────
export type { DomainContext } from '../types/domain-context';
export type { DomainResult } from '../types/domain-result';
export type { DomainIntent } from '../types/domain-intent';
export type { CalculatorResult } from '../types/calculator-result';
export { DomainError } from '../types/domain-error';
export { stableCanonicalJson } from '../utils/stable-json';

// ── Supply Chain Intent Payloads ────────────────────────────
// TODO: Add payload types as supply-chain packages are implemented
// Example:
//   export type { PurchaseOrderPayload } from '../types/domain-intent';
//   export type { GoodsReceiptPayload } from '../types/domain-intent';

// ── Shared with Finance (inventory) ─────────────────────────
export type { StockAdjustPayload } from '../types/domain-intent';

// ── Port Interfaces ─────────────────────────────────────────
// TODO: Add supply-chain-specific ports as needed
// Example:
//   export type { WarehousePort, InventoryPort } from '../ports/index';
