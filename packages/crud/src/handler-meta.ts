/**
 * Handler metadata accessor — internal to packages/crud.
 * Declares which verbs each registered handler supports.
 * Used by the action-type invariant test (W2).
 *
 * This file is intentionally decoupled from actual handler imports
 * to avoid triggering database connections during testing.
 *
 * NEVER exported from packages/crud public API (K-05).
 */

/**
 * Static registry of handler metadata.
 * Each entry declares the entityType and the verbs its handler implements.
 *
 * MUST be kept in sync with HANDLER_REGISTRY in mutate.ts.
 * The W2 invariant test validates this against ACTION_TYPES in Canon.
 * The generator (entity-new.ts) updates this file automatically.
 */
const HANDLER_META: Record<string, readonly string[]> = {
  contacts: ['create', 'update', 'delete', 'restore', 'submit', 'cancel', 'approve', 'reject'],
  companies: ['create', 'update', 'delete', 'restore'],
  // @entity-gen:handler-meta
};

/**
 * Returns a map of entityType → supported verbs for all registered handlers.
 */
export function getRegisteredHandlerMeta(): Map<string, string[]> {
  const meta = new Map<string, string[]>();

  for (const [entityType, verbs] of Object.entries(HANDLER_META)) {
    meta.set(entityType, [...verbs]);
  }

  return meta;
}
