import { and, eq, numberSequences, sql } from 'afena-database';

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

// Re-export pure function from DB-free module
export { resolveFiscalYear } from './fiscal-year';

/**
 * Result of a successful doc number allocation.
 */
export interface DocNumberResult {
  docNo: string;
  rawValue: number;
  fiscalYear: number;
}

/**
 * Allocate the next document number for a given entity type.
 *
 * PRD Phase A #2 — Allocate-on-Post:
 * - Called in handler submit(), NOT create()
 * - Atomic: single UPDATE ... SET next_value = next_value + 1 ... RETURNING
 * - SET LOCAL lock_timeout = '2s' before allocation (prevents blocking behind long txns)
 * - Fiscal year rollover: auto-creates new sequence row when fiscal year changes
 *
 * @param tx - Transaction handle (MUST be inside db.transaction())
 * @param orgId - Tenant org ID
 * @param companyId - Company ID (required for doc entities)
 * @param entityType - Entity type key (e.g. 'invoices', 'purchase_orders')
 * @param fiscalYear - Current fiscal year (caller resolves from company.fiscalYearStart)
 */
export async function allocateDocNumber(
  tx: NeonHttpDatabase,
  orgId: string,
  companyId: string,
  entityType: string,
  fiscalYear: number,
): Promise<DocNumberResult> {
  // Tighten lock_timeout for sequence allocation specifically (2s)
  await (tx as any).execute(sql`SET LOCAL lock_timeout = '2000'`);

  // Atomic allocation: UPDATE ... RETURNING
  const rows = await (tx as any)
    .update(numberSequences)
    .set({ nextValue: sql`${numberSequences.nextValue} + 1` })
    .where(
      and(
        eq(numberSequences.orgId, orgId),
        eq(numberSequences.companyId, companyId),
        eq(numberSequences.entityType, entityType),
        eq(numberSequences.fiscalYear, fiscalYear),
      ),
    )
    .returning({
      nextValue: numberSequences.nextValue,
      prefix: numberSequences.prefix,
      suffix: numberSequences.suffix,
      padLength: numberSequences.padLength,
    });

  // Fiscal year rollover: no matching sequence → create one from template
  const allocated = rows[0] ?? await rolloverFiscalYear(
    tx,
    orgId,
    companyId,
    entityType,
    fiscalYear,
  );

  // The allocated value is next_value AFTER increment, so the assigned number
  // is (next_value - 1) — the value that was consumed.
  const assignedValue = allocated.nextValue - 1;
  const paddedValue = String(assignedValue).padStart(allocated.padLength, '0');
  const docNo = `${allocated.prefix}${paddedValue}${allocated.suffix}`;

  return {
    docNo,
    rawValue: assignedValue,
    fiscalYear,
  };
}

/**
 * Fiscal year rollover: copy sequence config from the most recent fiscal year
 * and create a new row for the target fiscal year, starting at next_value = 2
 * (1 is consumed by the current allocation).
 */
async function rolloverFiscalYear(
  tx: NeonHttpDatabase,
  orgId: string,
  companyId: string,
  entityType: string,
  fiscalYear: number,
): Promise<{ nextValue: number; prefix: string; suffix: string; padLength: number }> {
  // Find the most recent sequence for this entity type (any fiscal year)
  const [template] = await (tx as any)
    .select({
      prefix: numberSequences.prefix,
      suffix: numberSequences.suffix,
      padLength: numberSequences.padLength,
    })
    .from(numberSequences)
    .where(
      and(
        eq(numberSequences.orgId, orgId),
        eq(numberSequences.companyId, companyId),
        eq(numberSequences.entityType, entityType),
      ),
    )
    .orderBy(sql`${numberSequences.fiscalYear} DESC NULLS LAST`)
    .limit(1);

  if (!template) {
    throw new Error(
      `No number sequence found for entity '${entityType}' in org '${orgId}', company '${companyId}'. ` +
      `Ensure seed_org_defaults() has been called.`,
    );
  }

  // Create new fiscal year sequence starting at 2 (1 consumed now)
  const [inserted] = await (tx as any)
    .insert(numberSequences)
    .values({
      orgId,
      companyId,
      entityType,
      fiscalYear,
      prefix: template.prefix,
      suffix: template.suffix,
      padLength: template.padLength,
      nextValue: 2,
    })
    .returning({
      nextValue: numberSequences.nextValue,
      prefix: numberSequences.prefix,
      suffix: numberSequences.suffix,
      padLength: numberSequences.padLength,
    });

  return inserted;
}
