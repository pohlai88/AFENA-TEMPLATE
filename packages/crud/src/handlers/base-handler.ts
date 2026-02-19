/**
 * Base Handler Factory (Phase 3)
 *
 * Creates a minimal v1.1 EntityHandlerV11 that delegates entirely to the
 * kernel's Plan → Commit → Deliver pipeline. Use this for any entity type
 * that doesn't need custom plan or commit hooks.
 *
 * ~209 of 211 entity types should use this. Only companies and contacts
 * (which have custom hierarchy/dedup logic) need custom handlers.
 *
 * The base handler intentionally has NO plan hooks and NO commit hook.
 * The kernel provides:
 *   - Field policy from Canon EntityContract.writeRules (K-15)
 *   - Generic entity insert/update/delete/restore via the table registry
 *   - Standard workflow + search outbox intents
 *   - Audit log + version write
 *   - Idempotency key check (if provided)
 */

import type { EntityHandlerV11 } from './types';

/**
 * Create a base v1.1 handler for an entity type.
 *
 * @param entityType - The entity type string (matches TABLE_REGISTRY key)
 * @returns An EntityHandlerV11 with no custom hooks — fully kernel-driven
 *
 * @example
 *   export const invoicesHandler = createBaseHandler('invoices');
 *   export const projectsHandler = createBaseHandler('projects');
 */
export function createBaseHandler(entityType: string): EntityHandlerV11 {
  return {
    __v11: true as const,
    entityType,
    // No plan hooks — kernel uses Canon EntityContract.writeRules (K-15)
    // No commit hook — kernel does standard entity write
    // No pickWritableFields — kernel uses pickWritable(table, input) backstop
  };
}
