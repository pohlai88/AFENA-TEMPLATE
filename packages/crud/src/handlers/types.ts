import type { MutationContext } from '../context';
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';


/**
 * Internal handler result — returned by entity-specific create/update/delete/restore handlers.
 * NEVER exported from packages/crud (K-05).
 */
export interface HandlerResult {
  entityId: string;
  before: Record<string, unknown> | null;
  after: Record<string, unknown>;
  versionBefore: number | null;
  versionAfter: number;
}

/**
 * Internal handler interface for entity operations.
 * Each entity registers handlers for its supported verbs.
 * NEVER exported from packages/crud (K-05).
 */
export interface EntityHandler {
  create(
    tx: NeonHttpDatabase,
    input: Record<string, unknown>,
    ctx: MutationContext,
  ): Promise<HandlerResult>;

  update(
    tx: NeonHttpDatabase,
    entityId: string,
    input: Record<string, unknown>,
    expectedVersion: number,
    ctx: MutationContext,
  ): Promise<HandlerResult>;

  delete(
    tx: NeonHttpDatabase,
    entityId: string,
    expectedVersion: number,
    ctx: MutationContext,
  ): Promise<HandlerResult>;

  restore(
    tx: NeonHttpDatabase,
    entityId: string,
    expectedVersion: number,
    ctx: MutationContext,
  ): Promise<HandlerResult>;
}
