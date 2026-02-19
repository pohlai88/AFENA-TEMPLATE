/**
 * Entity handler registry — SSOT for HANDLER_REGISTRY.
 * Exported for CI invariant checks (INVARIANT-HANDLER-00/01/02).
 * mutate.ts imports from here.
 *
 * Phase 5: companies + contacts are now native v1.1 handlers (createBaseHandler).
 * adaptV10Handler() wrapper removed — all registered handlers now implement
 * EntityHandlerV11 directly.
 */

import type { EntityHandler } from '../handlers/types';

import { companiesHandler } from '../handlers/companies';
import { contactsHandler } from '../handlers/contacts';
// @entity-gen:handler-import

export const HANDLER_REGISTRY: Record<string, EntityHandler> = {
  contacts: contactsHandler,
  companies: companiesHandler,
  // @entity-gen:handler-registry
} as const;

