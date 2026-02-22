/**
 * Outbox Intent Types — re-export from Canon (SSOT)
 *
 * Import OutboxIntent from here within CRUD internals to keep
 * the import path stable if Canon's path ever changes.
 */
export { CANON_EVENT_NAMES, assertCanonEventName } from 'afenda-canon';
export type { CanonEventName, OutboxIntent } from 'afenda-canon';

