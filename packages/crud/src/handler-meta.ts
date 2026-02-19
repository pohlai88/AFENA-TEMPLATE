/**
 * Handler metadata accessor — internal to packages/crud.
 * Declares which verbs each registered handler supports.
 * Used by the action-type invariant test (W2).
 *
 * Phase 6.6: Handler metadata is now derived from EntityContract.
 * The HANDLER_META constant exists for backwards compatibility with tests.
 *
 * NEVER exported from packages/crud public API (K-05).
 */

import type { EntityContract } from 'afenda-canon';
import { ENTITY_CONTRACT_REGISTRY } from 'afenda-canon';

/**
 * Derive supported verbs from an EntityContract.
 *
 * Combines:
 * - primaryVerbs (create, update, submit)
 * - secondaryVerbs (delete, cancel, restore)
 * - workflowDecisions (approve, reject)
 *
 * Returns unique sorted list.
 */
export function deriveVerbsFromContract(contract: EntityContract): string[] {
  const verbs = new Set<string>([
    ...contract.primaryVerbs,
    ...contract.secondaryVerbs,
    ...contract.workflowDecisions,
  ]);
  return Array.from(verbs).sort();
}

/**
 * Get handler verbs for an entity type from Canon.
 * Falls back to empty array if no contract exists.
 *
 * Uses the registry map directly to avoid type narrowing issues.
 */
export function getHandlerVerbsFromContract(entityType: string): string[] {
  // Access registry map directly (EntityContractMap is ReadonlyMap<string, EntityContract>)
  const contract = ENTITY_CONTRACT_REGISTRY.get(entityType as any);
  if (!contract) return [];
  return deriveVerbsFromContract(contract);
}

/**
 * Static registry of handler metadata.
 * Phase 6.6: Now computed from EntityContract at module load time.
 *
 * @deprecated Use getHandlerVerbsFromContract() for runtime access.
 * This constant exists for backwards compatibility with the entity generator.
 * @entity-gen:handler-meta marker is preserved for generator compatibility.
 */
const HANDLER_META: Record<string, readonly string[]> = {
  contacts: ['create', 'update', 'delete', 'restore', 'submit', 'cancel', 'approve', 'reject'],
  companies: ['create', 'update', 'delete', 'restore'],
  // @entity-gen:handler-meta
};

/**
 * Returns a map of entityType → supported verbs for all registered handlers.
 *
 * Phase 6.6: Combines handcoded HANDLER_META with Canon-derived verbs.
 * Canon data takes precedence when available.
 */
export function getRegisteredHandlerMeta(): Map<string, string[]> {
  const meta = new Map<string, string[]>();

  // Start with handcoded entries (backwards compatibility)
  for (const [entityType, verbs] of Object.entries(HANDLER_META)) {
    // Prefer Canon-derived verbs if contract exists
    // Access registry map directly to avoid type narrowing issues
    if (ENTITY_CONTRACT_REGISTRY.has(entityType as any)) {
      meta.set(entityType, getHandlerVerbsFromContract(entityType));
    } else {
      meta.set(entityType, [...verbs]);
    }
  }

  return meta;
}
