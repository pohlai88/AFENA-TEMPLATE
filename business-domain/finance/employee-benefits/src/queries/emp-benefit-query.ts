import type { DomainContext } from 'afenda-canon';
import { DomainError } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { employeeBenefitPlans } from 'afenda-database';
import { and, eq } from 'drizzle-orm';

export type BenefitPlanReadModel = {
  id: string;
  planName: string;
  planType: string;
  benefitType: string;
  measurementDate: string;
  currencyCode: string;
  obligationMinor: number;
  planAssetMinor: number;
  netLiabilityMinor: number;
  discountRateBps: number | null;
  isActive: boolean;
};

export async function getBenefitPlan(
  db: DbSession,
  ctx: DomainContext,
  id: string,
): Promise<BenefitPlanReadModel> {
  const rows = await db.read((tx) =>
    tx
      .select({
        id: employeeBenefitPlans.id,
        planName: employeeBenefitPlans.planName,
        planType: employeeBenefitPlans.planType,
        benefitType: employeeBenefitPlans.benefitType,
        measurementDate: employeeBenefitPlans.measurementDate,
        currencyCode: employeeBenefitPlans.currencyCode,
        obligationMinor: employeeBenefitPlans.obligationMinor,
        planAssetMinor: employeeBenefitPlans.planAssetMinor,
        netLiabilityMinor: employeeBenefitPlans.netLiabilityMinor,
        discountRateBps: employeeBenefitPlans.discountRateBps,
        isActive: employeeBenefitPlans.isActive,
      })
      .from(employeeBenefitPlans)
      .where(
        and(
          eq(employeeBenefitPlans.orgId, ctx.orgId),
          eq(employeeBenefitPlans.companyId, ctx.companyId),
          eq(employeeBenefitPlans.id, id),
          eq(employeeBenefitPlans.isDeleted, false),
        ),
      )
      .limit(1),
  );
  if (rows.length === 0)
    throw new DomainError('NOT_FOUND', `Benefit plan not found: ${id}`);
  return rows[0]!;
}

export async function listActivePlans(
  db: DbSession,
  ctx: DomainContext,
): Promise<BenefitPlanReadModel[]> {
  return db.read((tx) =>
    tx
      .select({
        id: employeeBenefitPlans.id,
        planName: employeeBenefitPlans.planName,
        planType: employeeBenefitPlans.planType,
        benefitType: employeeBenefitPlans.benefitType,
        measurementDate: employeeBenefitPlans.measurementDate,
        currencyCode: employeeBenefitPlans.currencyCode,
        obligationMinor: employeeBenefitPlans.obligationMinor,
        planAssetMinor: employeeBenefitPlans.planAssetMinor,
        netLiabilityMinor: employeeBenefitPlans.netLiabilityMinor,
        discountRateBps: employeeBenefitPlans.discountRateBps,
        isActive: employeeBenefitPlans.isActive,
      })
      .from(employeeBenefitPlans)
      .where(
        and(
          eq(employeeBenefitPlans.orgId, ctx.orgId),
          eq(employeeBenefitPlans.companyId, ctx.companyId),
          eq(employeeBenefitPlans.isActive, true),
          eq(employeeBenefitPlans.isDeleted, false),
        ),
      ),
  );
}
