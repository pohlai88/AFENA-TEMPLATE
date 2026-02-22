import { pgEnum } from 'drizzle-orm/pg-core';

/**
 * Document status enum for transactional documents.
 * Represents the lifecycle states: draft → submitted → active → cancelled
 */
export const docStatusEnum = pgEnum('doc_status', [
  'draft',
  'submitted',
  'active',
  'cancelled',
]);
