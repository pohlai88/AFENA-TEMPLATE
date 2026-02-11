// ── K-05: packages/crud exports ONLY these 3 functions ──
// Internal handlers, audit writer, version helpers are NEVER exported.
export { mutate } from './mutate';
export { readEntity, listEntities } from './read';

// ── Re-export context type for callers ──
export type { MutationContext } from './context';
