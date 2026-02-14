import { createHash } from 'node:crypto';

/**
 * Canonical JSON serialization: deterministic key ordering + no whitespace.
 *
 * Rules (from PRD § Canonical JSON Hashing):
 * - Keys sorted lexicographically at every nesting level
 * - No whitespace
 * - null preserved (not stripped)
 * - Numbers: minor integers only (no floats in workflow hashing context)
 * - Arrays preserve order (elements are recursively canonicalized)
 *
 * Used by WF-02 (step idempotency), WF-11 (outbox idempotency), WF-12 (compile determinism).
 */
export function canonicalJsonSerialize(value: unknown): string {
  if (value === null || value === undefined) {
    return 'null';
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      throw new Error(`canonicalJsonSerialize: non-finite number not allowed: ${String(value)}`);
    }
    return JSON.stringify(value);
  }

  if (typeof value === 'string') {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    const items = value.map((item) => canonicalJsonSerialize(item));
    return `[${items.join(',')}]`;
  }

  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj).sort();
    const pairs = keys.map((key) => `${JSON.stringify(key)}:${canonicalJsonSerialize(obj[key])}`);
    return `{${pairs.join(',')}}`;
  }

  throw new Error(`canonicalJsonSerialize: unsupported type: ${typeof value}`);
}

/**
 * Compute SHA-256 hash of a canonically serialized JSON value.
 *
 * canonicalJsonHash({b:1, a:2}) === canonicalJsonHash({a:2, b:1})
 */
export function canonicalJsonHash(value: unknown): string {
  const serialized = canonicalJsonSerialize(value);
  return createHash('sha256').update(serialized, 'utf8').digest('hex');
}

/**
 * Compute idempotency key for step execution (WF-02).
 * sha256(instance_id + node_id + token_id + entity_version)
 */
export function computeStepIdempotencyKey(
  instanceId: string,
  nodeId: string,
  tokenId: string,
  entityVersion: number,
): string {
  const input = `${instanceId}+${nodeId}+${tokenId}+${String(entityVersion)}`;
  return createHash('sha256').update(input, 'utf8').digest('hex');
}

/**
 * Compute idempotency key for outbox events (WF-11).
 * sha256(instance_id + event_type + canonicalJsonHash(payload_json) + entity_version)
 */
export function computeEventIdempotencyKey(
  instanceId: string,
  eventType: string,
  payload: unknown,
  entityVersion: number,
): string {
  const payloadHash = canonicalJsonHash(payload);
  const input = `${instanceId}+${eventType}+${payloadHash}+${String(entityVersion)}`;
  return createHash('sha256').update(input, 'utf8').digest('hex');
}

/**
 * Compute idempotency key for side-effect outbox (WF-11).
 * sha256(step_execution_id + effect_type + canonicalJsonHash(payload_json))
 */
export function computeSideEffectIdempotencyKey(
  stepExecutionId: string,
  effectType: string,
  payload: unknown,
): string {
  const payloadHash = canonicalJsonHash(payload);
  const input = `${stepExecutionId}+${effectType}+${payloadHash}`;
  return createHash('sha256').update(input, 'utf8').digest('hex');
}

/**
 * Compute join idempotency key (WF-16).
 * sha256(instance_id + join_node_id + entity_version + join_epoch)
 */
export function computeJoinIdempotencyKey(
  instanceId: string,
  joinNodeId: string,
  entityVersion: number,
  joinEpoch: number,
): string {
  const input = `${instanceId}+${joinNodeId}+${String(entityVersion)}+${String(joinEpoch)}`;
  return createHash('sha256').update(input, 'utf8').digest('hex');
}
