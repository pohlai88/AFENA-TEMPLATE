import type { ActionType } from './action';
import type { EntityRef } from './entity';

/** JSON-compatible value for mutation input payloads. */
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

/**
 * Single normalized mutation contract.
 * This is the only shape accepted by mutate().
 *
 * K-04: expectedVersion required on update/delete/restore.
 * K-09: entityRef.id optional on create (kernel generates UUID).
 * K-10: idempotencyKey for *.create only.
 */
export interface MutationSpec {
  actionType: ActionType;
  entityRef: EntityRef;
  input: JsonValue;
  expectedVersion?: number;
  batchId?: string;
  reason?: string;
  idempotencyKey?: string;
}
