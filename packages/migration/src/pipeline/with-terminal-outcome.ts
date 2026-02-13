import type { RecordOutcome } from '../types/record-outcome.js';

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 200;

/**
 * F: Sharp edge neutralizer — wraps per-record processing.
 * NEVER throws. Always returns a RecordOutcome.
 * This is the ONLY place where errors are caught during record processing.
 */
export async function withTerminalOutcome(
  action: { entityType: string; legacyId: string },
  fn: () => Promise<RecordOutcome>,
): Promise<RecordOutcome> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const errorClass = classifyError(err);
      if (errorClass === 'permanent' || attempt === MAX_RETRIES) {
        return {
          entityType: action.entityType,
          legacyId: action.legacyId,
          status: 'quarantined',
          errorClass,
          errorCode: extractErrorCode(err),
          failureStage: extractFailureStage(err),
        };
      }
      await sleep(BASE_DELAY_MS * Math.pow(2, attempt));
    }
  }
  // Unreachable, but TypeScript needs it
  return { entityType: action.entityType, legacyId: action.legacyId, status: 'quarantined' };
}

export function classifyError(err: unknown): 'transient' | 'permanent' {
  const code = (err as { code?: string })?.code;
  // Postgres serialization failure, deadlock, statement timeout, connection reset
  if (code === '40001' || code === '40P01' || code === '57014' || code === '08006') {
    return 'transient';
  }
  const msg = String(err);
  if (/timeout|ECONNRESET|ECONNREFUSED|socket hang up/i.test(msg)) {
    return 'transient';
  }
  return 'permanent';
}

export function extractErrorCode(err: unknown): string {
  const code = (err as { code?: string })?.code;
  if (code) return code;
  const msg = (err as { message?: string })?.message;
  if (msg && msg.length < 100) return msg;
  return 'UNKNOWN';
}

export function extractFailureStage(
  err: unknown,
): 'extract' | 'transform' | 'detect' | 'reserve' | 'load' | 'snapshot' {
  const stage = (err as { stage?: string })?.stage;
  const valid = ['extract', 'transform', 'detect', 'reserve', 'load', 'snapshot'] as const;
  if (stage && (valid as readonly string[]).includes(stage)) {
    return stage as (typeof valid)[number];
  }
  return 'load';
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
