/**
 * companies handler — Phase 5 (v1.1 native)
 *
 * Converted from v1.0 verb-based implementation to a bare v1.1 base handler.
 * All entity write logic (INSERT / UPDATE / soft-delete / restore) is now
 * handled generically by `commit/apply-entity.ts` in the kernel.
 *
 * Custom plan or commit hooks can be added here when company-specific
 * hierarchy / dedup logic is needed (K-15 writeRules or commitAfterEntityWrite).
 *
 * @see handlers/base-handler.ts — createBaseHandler()
 * @see commit/apply-entity.ts  — generic entity write
 */

import { createBaseHandler } from './base-handler';
import type { EntityHandlerV11 } from './types';

export const CAPABILITIES = [
  'companies.create',
  'companies.update',
  'companies.delete',
  'companies.restore',
] as const;

export const companiesHandler: EntityHandlerV11 = createBaseHandler('companies');

