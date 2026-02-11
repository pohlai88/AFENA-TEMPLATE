import { advisories, advisoryEvidence, db, eq, and, sql } from 'afena-database';

import { buildEvidence } from './evidence';
import { renderExplanation } from './explain/render';
import { buildFingerprint } from './fingerprint';

import type { AdvisoryInput, EvidenceInput } from './types';

/**
 * Advisory writer — INVARIANT-P01: ONLY writes to advisories + advisory_evidence.
 * Never touches domain tables.
 *
 * - Fingerprint dedupe: skips if an open/ack advisory with same fingerprint exists.
 * - Append-only evidence: evidence rows are INSERT-only, never updated.
 */

export interface WriteAdvisoryResult {
  created: boolean;
  advisoryId: string | null;
  fingerprint: string;
  deduplicated: boolean;
}

/**
 * Write an advisory with its evidence.
 * Returns { created: true, advisoryId } if new, or { created: false, deduplicated: true } if skipped.
 */
export async function writeAdvisory(
  input: AdvisoryInput,
  evidence: EvidenceInput[],
): Promise<WriteAdvisoryResult> {
  // Build fingerprint
  const fingerprint = buildFingerprint({
    orgId: input.orgId,
    type: input.type,
    entityType: input.entityType,
    entityId: input.entityId,
    windowStart: input.windowStart,
    windowEnd: input.windowEnd,
    params: input.params,
  });

  // Check for existing open/ack advisory with same fingerprint (dedupe)
  const existing = await db
    .select({ id: advisories.id })
    .from(advisories)
    .where(
      and(
        eq(advisories.orgId, input.orgId),
        eq(advisories.fingerprint, fingerprint),
        sql`${advisories.status} IN ('open','ack')`,
      ),
    )
    .limit(1);

  if (existing.length > 0) {
    return {
      created: false,
      advisoryId: existing[0]!.id,
      fingerprint,
      deduplicated: true,
    };
  }

  // Render explanation
  const { explanation, explainVersion } = renderExplanation(
    input.method,
    input.params,
    input.score,
  );

  // Insert advisory
  const [row] = await db
    .insert(advisories)
    .values({
      orgId: input.orgId,
      type: input.type,
      severity: input.severity,
      entityType: input.entityType ?? null,
      entityId: input.entityId ?? null,
      summary: input.summary,
      explanation,
      explainVersion,
      method: input.method,
      params: input.params,
      score: input.score,
      recommendedActions: input.recommendedActions ?? null,
      fingerprint,
      runId: input.runId ?? null,
      windowStart: input.windowStart ?? null,
      windowEnd: input.windowEnd ?? null,
    })
    .returning({ id: advisories.id });

  const advisoryId = row!.id;

  // Insert evidence (append-only)
  if (evidence.length > 0) {
    const evidenceRows = evidence.map((e) => {
      const hashed = buildEvidence(e);
      return {
        orgId: input.orgId,
        advisoryId,
        evidenceType: hashed.evidenceType,
        source: hashed.source,
        payload: hashed.payload,
        hash: hashed.hash,
      };
    });

    await db.insert(advisoryEvidence).values(evidenceRows);
  }

  return {
    created: true,
    advisoryId,
    fingerprint,
    deduplicated: false,
  };
}
