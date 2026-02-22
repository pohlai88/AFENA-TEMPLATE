/**
 * Accounting Hub Service
 *
 * Orchestrates the event→journal derivation engine.
 * - Receives accounting events from domain packages
 * - Looks up mapping rules (versioned)
 * - Applies derivation engine to produce journal lines
 * - Returns DomainResult with commit/publish intents
 */
import type { DomainContext, DomainResult } from 'afenda-canon';
import { stableCanonicalJson } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import type { AccrualInput } from '../calculators/accrual-calculator';
import { computeAccrualLines } from '../calculators/accrual-calculator';
import type { AllocationTarget } from '../calculators/allocation-engine';
import { allocateProportional } from '../calculators/allocation-engine';
import type { MappingRule } from '../calculators/derivation-engine';
import { deriveJournalLines } from '../calculators/derivation-engine';
import type { ReclassEntry } from '../calculators/reclass-calculator';
import { computeReclassLines } from '../calculators/reclass-calculator';
import {
  buildAccrualRunIntent,
  buildAllocationRunIntent,
  buildDeriveCommitIntent,
  buildPublishMappingIntent,
  buildReclassRunIntent,
} from '../commands/hub-intent';
import type { DerivedEntryReadModel, MappingRuleSetReadModel } from '../queries/hub-query';
import {
  getAccountingEvent,
  getCurrentMappingRules,
  getDerivedEntries,
} from '../queries/hub-query';

/* ---------- Derivation Flow ---------- */

/**
 * Main derivation: receive an eventId, look up mapping, derive journal lines,
 * return a commit intent.
 */
export async function deriveFromEvent(
  db: DbSession,
  ctx: DomainContext,
  input: { eventId: string; effectiveAt: string },
): Promise<DomainResult> {
  // 1. Fetch the accounting event
  const event = await getAccountingEvent(db, ctx, input.eventId);

  // 2. Get current mapping rules for this event type
  const mapping = await getCurrentMappingRules(db, ctx, event.eventType);

  // 3. Parse rules from mapping (stored as JSONB)
  const rules = (mapping.rules as MappingRule[]) ?? [];

  // 4. Extract amount from event payload
  const payload = event.payload as Record<string, unknown>;
  const amountMinor = Number(payload['amountMinor'] ?? 0);

  // 5. Run derivation engine
  const { result: derivation } = deriveJournalLines({
    eventId: event.eventId,
    amountMinor,
    currencyCode: event.currencyCode,
    rules,
    mappingVersion: mapping.versionNumber,
  });

  // 6. Build intent
  return {
    kind: 'intent',
    intents: [
      buildDeriveCommitIntent(
        {
          eventId: event.eventId,
          mappingVersion: mapping.versionNumber,
          effectiveAt: input.effectiveAt,
          derivationId: derivation.derivationId,
          journalLines: derivation.journalLines,
        },
        stableCanonicalJson({
          derivationId: derivation.derivationId,
          eventId: event.eventId,
        }),
      ),
    ],
  };
}

/**
 * Fetch existing derivation results for an event.
 */
export async function getDerivationAudit(
  db: DbSession,
  ctx: DomainContext,
  eventId: string,
): Promise<DomainResult<DerivedEntryReadModel[]>> {
  const entries = await getDerivedEntries(db, ctx, eventId);
  return { kind: 'read', data: entries };
}

/**
 * Publish a new mapping version.
 */
export async function publishMapping(
  _db: DbSession,
  _ctx: DomainContext,
  input: { mappingId: string; version: number; ruleCount: number },
): Promise<DomainResult> {
  return {
    kind: 'intent',
    intents: [
      buildPublishMappingIntent(
        {
          mappingId: input.mappingId,
          version: input.version,
          ruleCount: input.ruleCount,
        },
        stableCanonicalJson({
          mappingId: input.mappingId,
          version: input.version,
        }),
      ),
    ],
  };
}

/* ---------- Reclassification ---------- */

export async function runReclassification(
  _db: DbSession,
  _ctx: DomainContext,
  input: { periodKey: string; entries: ReclassEntry[]; effectiveAt: string },
): Promise<DomainResult> {
  const { result: reclassResult } = computeReclassLines(input.entries);
  const totalMinor = input.entries.reduce((s, e) => s + e.amountMinor, 0);

  return {
    kind: 'intent',
    intents: [
      buildReclassRunIntent(
        {
          periodKey: input.periodKey,
          effectiveAt: input.effectiveAt,
          reclassCount: input.entries.length,
          totalMinor,
          reclassEvidence: reclassResult,
        },
        stableCanonicalJson({ periodKey: input.periodKey, reclassCount: input.entries.length }),
      ),
    ],
  };
}

/* ---------- Allocation ---------- */

export async function runAllocation(
  _db: DbSession,
  _ctx: DomainContext,
  input: {
    periodKey: string;
    totalMinor: number;
    method: 'proportional' | 'fixed' | 'step_down';
    targets: AllocationTarget[];
    effectiveAt: string;
  },
): Promise<DomainResult> {
  // Currently only proportional is implemented
  const { result: allocResult } = allocateProportional(input.totalMinor, input.targets);

  return {
    kind: 'intent',
    intents: [
      buildAllocationRunIntent(
        {
          periodKey: input.periodKey,
          effectiveAt: input.effectiveAt,
          allocationMethod: input.method,
          poolCount: input.targets.length,
          allocationEvidence: allocResult,
        },
        stableCanonicalJson({ periodKey: input.periodKey, method: input.method }),
      ),
    ],
  };
}

/* ---------- Accrual ---------- */

export async function runAccrual(
  _db: DbSession,
  _ctx: DomainContext,
  input: {
    periodKey: string;
    accruals: AccrualInput[];
    effectiveAt: string;
  },
): Promise<DomainResult> {
  let totalMinor = 0;
  for (const accrual of input.accruals) {
    const { result } = computeAccrualLines(accrual);
    totalMinor += result.reduce((s, l) => (l.side === 'debit' ? s + l.amountMinor : s), 0);
  }

  return {
    kind: 'intent',
    intents: [
      buildAccrualRunIntent(
        {
          periodKey: input.periodKey,
          effectiveAt: input.effectiveAt,
          accrualCount: input.accruals.length,
          totalMinor,
        },
        stableCanonicalJson({ periodKey: input.periodKey, accrualCount: input.accruals.length }),
      ),
    ],
  };
}

export type { DerivedEntryReadModel, MappingRuleSetReadModel };
