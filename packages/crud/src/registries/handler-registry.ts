/**
 * Entity handler registry — SSOT for HANDLER_REGISTRY.
 * Exported for CI invariant checks (INVARIANT-HANDLER-00/01/02).
 * mutate.ts imports from here.
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
