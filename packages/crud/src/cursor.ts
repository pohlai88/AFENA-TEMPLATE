/**
 * Cursor codec for listEntities pagination.
 * Phase 2B: base64url, ISO-only, strict validation.
 */

import { and, eq, lt, or } from 'drizzle-orm';

export type CursorPayload = {
  createdAt: string; // ISO string
  id: string;        // UUID
};

export type DecodedCursor = {
  createdAtIso: string; // for encoding/debugging
  createdAt: Date;      // for Drizzle comparisons
  id: string;
};

/** Encode cursor for wire (base64url). */
export function encodeCursor(payload: CursorPayload): string {
  const json = JSON.stringify(payload);
  return Buffer.from(json, 'utf8').toString('base64url');
}

/** Decode cursor; throws on invalid input. */
export function decodeCursor(cursor: string): DecodedCursor {
  let raw: string;
  try {
    raw = Buffer.from(cursor, 'base64url').toString('utf8');
  } catch {
    throw new Error('Invalid cursor: not base64url');
  }

  let obj: unknown;
  try {
    obj = JSON.parse(raw);
  } catch {
    throw new Error('Invalid cursor: not JSON');
  }

  if (typeof obj !== 'object' || obj === null) {
    throw new Error('Invalid cursor: not an object');
  }

  const rec = obj as Record<string, unknown>;
  const allowed = new Set(['createdAt', 'id']);
  for (const k of Object.keys(rec)) {
    if (!allowed.has(k)) throw new Error('Invalid cursor: unknown key');
  }

  const createdAt = rec.createdAt;
  const id = rec.id;

  if (typeof createdAt !== 'string' || createdAt.length < 10) {
    throw new Error('Invalid cursor: createdAt');
  }
  const ms = Date.parse(createdAt);
  if (!Number.isFinite(ms)) throw new Error('Invalid cursor: createdAt not ISO');

  if (typeof id !== 'string' || id.length < 16) {
    throw new Error('Invalid cursor: id');
  }

  const createdAtIso = createdAt;
  const createdAtDate = new Date(createdAtIso);

  return { createdAtIso, createdAt: createdAtDate, id };
}

/** Build WHERE clause for "rows after cursor" (DESC sort). */
export function buildCursorWhere(
  table: { createdAt: unknown; id: unknown },
  cursor: DecodedCursor,
) {
  const t = table as { createdAt: Parameters<typeof lt>[0]; id: Parameters<typeof lt>[0] };
  return or(
    lt(t.createdAt, cursor.createdAt),
    and(eq(t.createdAt, cursor.createdAt), lt(t.id, cursor.id)),
  );
}
