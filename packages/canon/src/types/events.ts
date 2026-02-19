/**
 * Canonical Event Vocabulary — afenda-canon SSOT
 *
 * Every outbox intent MUST use a CanonEventName.
 * Format: {domain}.{noun}.{past-tense-verb}
 *
 * Adding a new event:
 *   1. Add the string literal to CanonEventName
 *   2. Add it to CANON_EVENT_NAMES
 *   3. Update the integration plan success criteria
 *
 * Anti-pattern: "company.updated" vs "companies.updated" vs "CompanyUpdated"
 * → This registry is the single source of truth for event naming.
 */
export type CanonEventName =
  // Entity lifecycle
  | 'entity.created'
  | 'entity.updated'
  | 'entity.deleted'
  | 'entity.restored'
  // Workflow
  | 'workflow.triggered'
  | 'workflow.completed'
  | 'workflow.transitioned'
  // Search
  | 'search.upsert.requested'
  | 'search.delete.requested'
  // Webhook
  | 'webhook.dispatch.requested'
  // Integration
  | 'integration.sync.requested';

/** Runtime set — mirrors CanonEventName for validation. */
export const CANON_EVENT_NAMES = new Set<CanonEventName>([
  'entity.created',
  'entity.updated',
  'entity.deleted',
  'entity.restored',
  'workflow.triggered',
  'workflow.completed',
  'workflow.transitioned',
  'search.upsert.requested',
  'search.delete.requested',
  'webhook.dispatch.requested',
  'integration.sync.requested',
]);

/**
 * Type guard: throws if `name` is not a valid CanonEventName.
 * Use at event boundary edges (API handlers, import parsers).
 */
export function assertCanonEventName(name: string): asserts name is CanonEventName {
  if (!CANON_EVENT_NAMES.has(name as CanonEventName)) {
    throw new Error(
      `Unknown event name "${name}". Add it to CANON_EVENT_NAMES in afenda-canon/src/types/events.ts`,
    );
  }
}

/**
 * OutboxIntent — discriminated union of all outbox intent shapes.
 *
 * Every outbox row written by mutate() MUST match one of these shapes.
 * The `kind` discriminant determines outbox table + worker routing.
 *
 * Design: all intents carry `entityType` + `entityId` for tracing.
 * Payload is always plain JSON (no class instances, no Dates).
 */
export type OutboxIntent =
  | {
      kind: 'workflow';
      event: CanonEventName;
      entityType: string;
      entityId: string;
      payload: Record<string, unknown>;
    }
  | {
      kind: 'search';
      op: 'upsert' | 'delete';
      entityType: string;
      entityId: string;
      payload?: Record<string, unknown>;
    }
  | {
      kind: 'webhook';
      event: CanonEventName;
      urlId: string;
      entityType: string;
      entityId: string;
      payload: Record<string, unknown>;
    }
  | {
      kind: 'integration';
      target: string;
      event: CanonEventName;
      entityType: string;
      entityId: string;
      payload: Record<string, unknown>;
    };
