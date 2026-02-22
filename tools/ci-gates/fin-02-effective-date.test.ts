import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, test } from 'vitest';

/**
 * FIN-02 — `effectiveAt` Required on AccountingEvent-Emitting Commands
 *
 * All commands that ultimately produce an `AccountingEvent` (i.e., intent
 * types owned by `accounting-hub` or with `ledgerImpact: true` and
 * `effectiveDating: true`) must carry an effective date in their payload.
 *
 * Rationale: IFRS requires every posted journal to be dated to a fiscal
 * period. Events without `effectiveAt` (or period-equivalent field) cannot
 * be attributed to a reporting period, breaking period-end close.
 */

import { DOMAIN_INTENT_REGISTRY } from '../../packages/canon/src/registries/domain-intent-registry';

/** Fields that qualify as "effective date" carriers. */
const EFFECTIVE_DATE_FIELDS = [
  'effectiveAt',
  'periodKey',
  'recognitionDate',
  'disposalDate',
  'revaluationDate',
  'modificationDate',
  'designationDate',
  'impairmentDate',
  'reversalDate',
  'utilisationDate',
  'grantDate',
  'harvestDate',
  'transferDate',
  'cessationDate',
  'paymentDate',
  'periodStart',
  'taxPeriod',
] as const;

describe('FIN-02: effectiveAt required on accounting event intents', () => {
  const datedIntents = Object.entries(DOMAIN_INTENT_REGISTRY)
    .filter(([, meta]) => meta.effectiveDating === true)
    .map(([type]) => type);

  test('at least one effective-dated intent exists', () => {
    expect(datedIntents.length).toBeGreaterThan(0);
  });

  test('all effective-dated intents have a date/period field in payload', () => {
    const intentFile = resolve(__dirname, '../../packages/canon/src/types/domain-intent.ts');
    expect(existsSync(intentFile)).toBe(true);
    const source = readFileSync(intentFile, 'utf-8');

    // Map intent type → payload type name
    const intentPayloadMap = new Map<string, string>();
    const unionRe = /\{\s*type:\s*'([^']+)';\s*payload:\s*(\w+)\s*\}/g;
    let match: RegExpExecArray | null;
    while ((match = unionRe.exec(source)) !== null) {
      intentPayloadMap.set(match[1]!, match[2]!);
    }

    const violations: string[] = [];

    for (const intentType of datedIntents) {
      const payloadTypeName = intentPayloadMap.get(intentType);
      if (!payloadTypeName) continue;

      // Extract payload type body
      const typeBlockRe = new RegExp(
        `export\\s+type\\s+${payloadTypeName}\\s*=\\s*\\{([^}]+(?:\\{[^}]*\\}[^}]*)*)\\}`,
        's',
      );
      const blockMatch = typeBlockRe.exec(source);
      if (!blockMatch) continue;

      const block = blockMatch[1]!;
      const hasDateField = EFFECTIVE_DATE_FIELDS.some((field) =>
        new RegExp(`\\b${field}\\b`).test(block),
      );

      if (!hasDateField) {
        violations.push(
          `${intentType} → ${payloadTypeName} has no effective-date field (expected one of: ${EFFECTIVE_DATE_FIELDS.join(', ')})`,
        );
      }
    }

    if (violations.length > 0) {
      throw new Error(
        `FIN-02: ${violations.length} effective-dated intent(s) missing date/period field:\n` +
          violations.map((v) => `  - ${v}`).join('\n'),
      );
    }

    expect(violations).toEqual([]);
  });
});
