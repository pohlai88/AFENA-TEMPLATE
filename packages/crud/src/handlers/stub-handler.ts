/**
 * Stub handler for adopted entities without a full handler yet.
 * Throws when any mutation is attempted.
 */

import type { EntityHandler, HandlerResult } from './types';

function notImplemented(entityType: string): never {
  throw new Error(`Handler not yet implemented for entity type '${entityType}'. Run entity-new or add a full handler.`);
}

export function createStubHandler(entityType: string): EntityHandler {
  return {
    async create(): Promise<HandlerResult> {
      notImplemented(entityType);
    },
    async update(): Promise<HandlerResult> {
      notImplemented(entityType);
    },
    async delete(): Promise<HandlerResult> {
      notImplemented(entityType);
    },
    async restore(): Promise<HandlerResult> {
      notImplemented(entityType);
    },
  };
}
