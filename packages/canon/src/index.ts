// ── Types ────────────────────────────────────────────────
export type { EntityType, EntityRef, BaseEntity } from './types/entity';
export { ENTITY_TYPES } from './types/entity';

export type { ActorRef } from './types/actor';

export type { ActionVerb, ActionType, ActionFamily } from './types/action';
export {
  ACTION_VERBS,
  ACTION_TYPES,
  ACTION_FAMILIES,
  extractVerb,
  extractEntityNamespace,
  getActionFamily,
} from './types/action';

export type { JsonValue, MutationSpec } from './types/mutation';

export type { ReceiptStatus, Receipt } from './types/receipt';

export type { ApiResponse } from './types/envelope';

export type { ErrorCode, KernelError } from './types/errors';
export { ERROR_CODES } from './types/errors';

export type { AuditLogEntry } from './types/audit';

// ── Zod Schemas ──────────────────────────────────────────
export { entityTypeSchema, entityRefSchema } from './schemas/entity';
export { actionTypeSchema, actionFamilySchema } from './schemas/action';
export { errorCodeSchema, kernelErrorSchema } from './schemas/errors';
export { mutationSpecSchema } from './schemas/mutation';
export { receiptStatusSchema, receiptSchema } from './schemas/receipt';
export { apiResponseSchema } from './schemas/envelope';
export { auditLogEntrySchema } from './schemas/audit';
