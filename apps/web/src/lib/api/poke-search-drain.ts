import { drainSearchOutbox } from 'afena-search';

/**
 * Poke the search drain after a mutation (GAP-DB-004).
 *
 * Fire-and-forget: triggers near-real-time search updates without blocking.
 * Uses direct function call (no HTTP) — same process, no URL needed.
 * Vercel Cron remains the safety net for any missed pokes.
 */

const SEARCHABLE_ENTITY_TYPES = new Set(['contacts', 'companies']);

export function shouldPokeSearchDrain(entityType: string): boolean {
  return SEARCHABLE_ENTITY_TYPES.has(entityType);
}

/** Time budget for poke (leave headroom; cron is safety net). */
const POKE_TIME_BUDGET_MS = 5_000;

/**
 * Fire-and-forget drain invocation.
 * Call via after() from next/server so it runs after response is sent.
 * Direct call — no fetch, no NEXT_PUBLIC_APP_URL needed for poke.
 */
export function pokeSearchDrain(): void {
  drainSearchOutbox(POKE_TIME_BUDGET_MS).catch(() => {
    // Swallow errors — cron will catch up
  });
}
