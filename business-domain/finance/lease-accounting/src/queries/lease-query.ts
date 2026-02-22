import type { DomainContext } from 'afenda-canon';
import { DomainError } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { leases } from 'afenda-database';
import { and, eq } from 'drizzle-orm';

export type LeaseReadModel = {
  leaseId: string;
  lessor: string;
  lessee: string;
  commencementDateIso: string;
  endDateIso: string;
  monthlyPaymentMinor: number;
  leaseType: string;
  status: string;
};

export async function getLease(
  db: DbSession,
  ctx: DomainContext,
  leaseId: string,
): Promise<LeaseReadModel> {
  const rows = await db.read((tx) =>
    tx
      .select({
        leaseId: leases.id,
        lessor: leases.lessor,
        lessee: leases.lessee,
        commencementDateIso: leases.startDate,
        endDateIso: leases.endDate,
        monthlyPaymentMinor: leases.monthlyPayment,
        leaseType: leases.leaseType,
        status: leases.docStatus,
      })
      .from(leases)
      .where(and(eq(leases.orgId, ctx.orgId), eq(leases.id, leaseId), eq(leases.isDeleted, false)))
      .limit(1),
  );

  if (rows.length === 0) {
    throw new DomainError('NOT_FOUND', `Lease not found: ${leaseId}`, { leaseId });
  }

  const r = rows[0]!;
  return {
    leaseId: r.leaseId,
    lessor: r.lessor,
    lessee: r.lessee,
    commencementDateIso: String(r.commencementDateIso ?? ''),
    endDateIso: String(r.endDateIso ?? ''),
    monthlyPaymentMinor: Number(r.monthlyPaymentMinor ?? 0),
    leaseType: r.leaseType,
    status: r.status,
  };
}
