import { sha256Hex, stableStringify } from './fingerprint';

import type { EvidenceInput } from './types';

/**
 * Evidence builder — captures data that produced an advisory.
 * Each evidence piece gets a SHA-256 hash for reproducibility verification.
 * INVARIANT-P02: evidence is append-only. Never updated or deleted.
 *
 * Hash canonicalization (locked):
 * - hash = SHA-256 hex(stableJsonStringify(payload))
 * - sorted keys, no whitespace, arrays preserve order
 */

/** Build an evidence record with a reproducibility hash. */
export function buildEvidence(input: EvidenceInput): EvidenceInput & { hash: string } {
  const canonicalPayload = stableStringify(input.payload);
  const hash = sha256Hex(canonicalPayload);
  return { ...input, hash };
}

/** Verify that stored evidence payload matches its hash. */
export function verifyEvidenceHash(payload: Record<string, unknown>, hash: string): boolean {
  const canonicalPayload = stableStringify(payload);
  return sha256Hex(canonicalPayload) === hash;
}
