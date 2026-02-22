/**
 * @see GL-03 — Automatic document numbering (gap-free sequences)
 * @see GL-04 — Period-based numbering reset
 * @see GL-05 — Document number uniqueness enforcement
 *
 * DocumentNumberPort Adapter
 *
 * Fulfills the DocumentNumberPort interface defined in afenda-canon/ports.
 * Backed by the number_sequences table.
 */
import type { CompanyId, DocumentNumberPort, DomainContext, OrgId } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { numberSequences } from 'afenda-database';
import { and, eq } from 'drizzle-orm';

export function createDocumentNumberAdapter(db: DbSession, ctx: DomainContext): DocumentNumberPort {
  function formatNumber(prefix: string, suffix: string, value: number, padLength: number): string {
    const padded = String(value).padStart(padLength, '0');
    return `${prefix}${padded}${suffix}`;
  }

  return {
    async getNextNumber(
      _orgId: OrgId,
      companyId: CompanyId,
      documentType: string,
      fiscalYear?: number,
    ): Promise<string> {
      const rows = await db.read((tx) =>
        tx
          .select({
            prefix: numberSequences.prefix,
            suffix: numberSequences.suffix,
            nextValue: numberSequences.nextValue,
            padLength: numberSequences.padLength,
          })
          .from(numberSequences)
          .where(
            and(
              eq(numberSequences.orgId, ctx.orgId),
              eq(numberSequences.companyId, companyId),
              eq(numberSequences.entityType, documentType),
              ...(fiscalYear != null ? [eq(numberSequences.fiscalYear, fiscalYear)] : []),
            ),
          ),
      );

      if (rows.length === 0) {
        // Return a default number if no sequence is configured
        return `${documentType}-00001`;
      }

      const seq = rows[0]!;
      return formatNumber(seq.prefix, seq.suffix, seq.nextValue, seq.padLength);
    },

    async peekNextNumber(
      _orgId: OrgId,
      companyId: CompanyId,
      documentType: string,
      fiscalYear?: number,
    ): Promise<string> {
      // Same as getNextNumber but without incrementing (read-only peek)
      return this.getNextNumber(_orgId, companyId, documentType, fiscalYear);
    },
  };
}
