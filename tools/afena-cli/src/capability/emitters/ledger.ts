/**
 * Ledger emitter — generates .afena/capability.ledger.json
 * with deterministic statuses derived from booleans.
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

import {
  ACTION_TYPES,
  CAPABILITY_CATALOG,
  ENTITY_TYPES,
  VIS_POLICY,
  inferKindFromVerb,
  parseCapabilityKey,
} from 'afena-canon';

import { getOrInit } from '../../core/get-or-init';

import type { ScanResult } from '../collectors/surface-scanner';
import type { CapabilityKind, ExceptionScope , CapabilityException } from 'afena-canon';


export type LedgerStatus = 'covered' | 'orphaned' | 'phantom' | 'excepted' | 'planned';

export interface LedgerEntry {
  key: string;
  declared: boolean;
  observed: boolean;
  kind: CapabilityKind;
  status: LedgerStatus;
  kernel: { actionType: boolean; handler: boolean } | null;
  surfaces: { file: string; kind: string }[];
  uiSurfaces: { file: string; surfaceId: string; page: string }[];
  exception?: {
    id: string;
    rule: string;
    scope: ExceptionScope;
    reason: string;
    expiresOn: string;
    reviewOverdue: boolean;
  };
}

export interface CapabilityLedger {
  version: '1.0';
  generatedAt: string;
  policyPhase: number;
  summary: {
    total: number;
    covered: number;
    orphaned: number;
    phantom: number;
    excepted: number;
    planned: number;
  };
  entries: LedgerEntry[];
}

function deriveStatus(
  declared: boolean,
  observed: boolean,
  catalogStatus: string | undefined,
  hasException: boolean,
): LedgerStatus {
  if (hasException) return 'excepted';
  if (declared && catalogStatus === 'planned') return 'planned';
  if (!declared && observed) return 'phantom';
  if (declared && !observed && catalogStatus !== 'planned') return 'orphaned';
  return 'covered';
}

/**
 * Generate the capability ledger from scan results + exceptions.
 */
export function generateLedger(
  scanResult: ScanResult,
  exceptions: CapabilityException[],
): CapabilityLedger {
  const entries: LedgerEntry[] = [];
  const now = new Date().toISOString().slice(0, 10);

  // Build observed sets from scan
  const observedCapKeys = new Set<string>();
  const surfacesByKey = new Map<string, { file: string; kind: string }[]>();
  const uiSurfacesByKey = new Map<string, { file: string; surfaceId: string; page: string }[]>();

  for (const cap of scanResult.capabilities) {
    for (const key of cap.capabilities) {
      observedCapKeys.add(key);
      getOrInit(surfacesByKey, key).push({ file: cap.file, kind: cap.kind });
    }
  }

  for (const ui of scanResult.uiSurfaces) {
    for (const key of ui.exposes) {
      observedCapKeys.add(key);
      getOrInit(uiSurfacesByKey, key).push({
        file: ui.file,
        surfaceId: ui.surfaceId,
        page: ui.page,
      });
    }
  }

  // Process declared capabilities
  for (const [key, descriptor] of Object.entries(CAPABILITY_CATALOG)) {
    const parsed = parseCapabilityKey(key);
    const kind = descriptor.kind ?? inferKindFromVerb(parsed.verb);
    const observed = observedCapKeys.has(key);

    // Check for exception
    const exc = exceptions.find(
      (e) => e.key === key && e.expiresOn >= now,
    );

    const reviewOverdue = exc
      ? (() => {
        const reviewBase = exc.lastReviewedOn ?? exc.createdAt;
        const reviewDate = new Date(reviewBase);
        reviewDate.setDate(reviewDate.getDate() + exc.reviewEveryDays);
        return reviewDate.toISOString().slice(0, 10) < now;
      })()
      : false;

    const status = deriveStatus(true, observed, descriptor.status, !!exc);

    entries.push({
      key,
      declared: true,
      observed,
      kind,
      status,
      kernel:
        kind === 'mutation'
          ? {
            actionType: (ACTION_TYPES as readonly string[]).includes(key),
            handler:
              parsed.domain !== null &&
              (ENTITY_TYPES as readonly string[]).includes(parsed.domain),
          }
          : null,
      surfaces: surfacesByKey.get(key) ?? [],
      uiSurfaces: uiSurfacesByKey.get(key) ?? [],
      ...(exc
        ? {
          exception: {
            id: exc.id,
            rule: exc.rule,
            scope: exc.scope,
            reason: exc.reason,
            expiresOn: exc.expiresOn,
            reviewOverdue,
          },
        }
        : {}),
    });

    observedCapKeys.delete(key);
  }

  // Process phantom capabilities (observed but not declared)
  for (const key of observedCapKeys) {
    let kind: CapabilityKind = 'mutation';
    try {
      const parsed = parseCapabilityKey(key);
      kind = inferKindFromVerb(parsed.verb);
    } catch {
      // Unknown verb — default to mutation for safety
    }

    entries.push({
      key,
      declared: false,
      observed: true,
      kind,
      status: 'phantom',
      kernel: null,
      surfaces: surfacesByKey.get(key) ?? [],
      uiSurfaces: uiSurfacesByKey.get(key) ?? [],
    });
  }

  const summary = {
    total: entries.length,
    covered: entries.filter((e) => e.status === 'covered').length,
    orphaned: entries.filter((e) => e.status === 'orphaned').length,
    phantom: entries.filter((e) => e.status === 'phantom').length,
    excepted: entries.filter((e) => e.status === 'excepted').length,
    planned: entries.filter((e) => e.status === 'planned').length,
  };

  return {
    version: '1.0',
    generatedAt: new Date().toISOString(),
    policyPhase: VIS_POLICY.phase,
    summary,
    entries,
  };
}

/**
 * Write the ledger to .afena/capability.ledger.json.
 */
export function writeLedger(repoRoot: string, ledger: CapabilityLedger): void {
  const outPath = join(repoRoot, '.afena', 'capability.ledger.json');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, `${JSON.stringify(ledger, null, 2)  }\n`, 'utf-8');
}
