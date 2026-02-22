/**
 * signalWorkers() — Phase 4 / Phase 5 Stub
 *
 * Notifies outbox processors (workflow, search, webhook workers) that new
 * intents are available. Runs AFTER the TX commits (deliver phase).
 *
 * Implementation options:
 *   - LISTEN/NOTIFY (Postgres pub/sub) — low-latency, no extra infra
 *   - Redis pub/sub — for multi-region setups
 *   - Long-poll fallback — workers check on their own schedule
 *
 * This is best-effort: if signaling fails, workers will pick up on next
 * poll cycle. The outbox pattern guarantees delivery regardless.
 *
 * See: INTEGRATION_PLAN.md Phase 5 — DbSession Default + Observability
 */
export async function signalWorkers(
  _entityType: string,
  _orgId: string,
): Promise<void> {
  // TODO Phase 5: implement LISTEN/NOTIFY or Redis pub/sub
}
