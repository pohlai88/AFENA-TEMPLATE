import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

const GenerateAmortizationScheduleParams = z.object({
  leaseId: z.string(),
  presentValue: z.number(),
  monthlyPayment: z.number(),
  discountRate: z.number(),
  termMonths: z.number(),
});

export interface AmortizationSchedule {
  leaseId: string;
  totalPayments: number;
  totalInterest: number;
  totalPrincipal: number;
  schedule: {
    period: number;
    date: Date;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }[];
  generatedAt: Date;
}

export async function generateAmortizationSchedule(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof GenerateAmortizationScheduleParams>,
): Promise<Result<AmortizationSchedule>> {
  const validated = GenerateAmortizationScheduleParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Calculate amortization schedule using discount rate
  const schedule: AmortizationSchedule['schedule'] = [];
  let balance = validated.data.presentValue;
  const monthlyRate = validated.data.discountRate / 12;

  for (let period = 1; period <= validated.data.termMonths; period++) {
    const interest = balance * monthlyRate;
    const principal = validated.data.monthlyPayment - interest;
    balance -= principal;

    schedule.push({
      period,
      date: new Date(),
      payment: validated.data.monthlyPayment,
      principal,
      interest,
      balance: Math.max(0, balance),
    });
  }

  const totalPayments = validated.data.monthlyPayment * validated.data.termMonths;
  const totalInterest = schedule.reduce((sum, s) => sum + s.interest, 0);

  return ok({
    leaseId: validated.data.leaseId,
    totalPayments,
    totalInterest,
    totalPrincipal: totalPayments - totalInterest,
    schedule,
    generatedAt: new Date(),
  });
}

const CalculateRightOfUseParams = z.object({
  leaseId: z.string(),
  presentValuePayments: z.number(),
  initialDirectCosts: z.number(),
  leaseIncentives: z.number(),
});

export interface RightOfUseAsset {
  leaseId: string;
  initialValue: number;
  initialDirectCosts: number;
  leaseIncentives: number;
  netRouAsset: number;
  depreciationMethod: string;
  usefulLife: number;
  calculatedAt: Date;
}

export async function calculateRightOfUse(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof CalculateRightOfUseParams>,
): Promise<Result<RightOfUseAsset>> {
  const validated = CalculateRightOfUseParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Calculate ROU asset per ASC 842
  const netRouAsset =
    validated.data.presentValuePayments +
    validated.data.initialDirectCosts -
    validated.data.leaseIncentives;

  return ok({
    leaseId: validated.data.leaseId,
    initialValue: validated.data.presentValuePayments,
    initialDirectCosts: validated.data.initialDirectCosts,
    leaseIncentives: validated.data.leaseIncentives,
    netRouAsset,
    depreciationMethod: 'straight-line',
    usefulLife: 0,
    calculatedAt: new Date(),
  });
}

const RecalculateScheduleParams = z.object({
  leaseId: z.string(),
  modificationDate: z.date(),
  newMonthlyPayment: z.number(),
  newDiscountRate: z.number(),
  remainingTermMonths: z.number(),
});

export interface RecalculatedSchedule {
  leaseId: string;
  modificationDate: Date;
  previousBalance: number;
  newBalance: number;
  remeasurementAdjustment: number;
  newSchedule: AmortizationSchedule;
}

export async function recalculateSchedule(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof RecalculateScheduleParams>,
): Promise<Result<RecalculatedSchedule>> {
  const validated = RecalculateScheduleParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Recalculate schedule after modification
  const previousBalance = 0; // TODO: Get from DB
  const newBalance = validated.data.newMonthlyPayment * validated.data.remainingTermMonths;

  const newScheduleResult = await generateAmortizationSchedule(db, orgId, {
    leaseId: validated.data.leaseId,
    presentValue: newBalance,
    monthlyPayment: validated.data.newMonthlyPayment,
    discountRate: validated.data.newDiscountRate,
    termMonths: validated.data.remainingTermMonths,
  });

  if (!newScheduleResult.ok) return newScheduleResult;

  return ok({
    leaseId: validated.data.leaseId,
    modificationDate: validated.data.modificationDate,
    previousBalance,
    newBalance,
    remeasurementAdjustment: newBalance - previousBalance,
    newSchedule: newScheduleResult.value,
  });
}

const GetAmortizationSummaryParams = z.object({
  leaseId: z.string(),
  asOfDate: z.date(),
});

export interface AmortizationSummary {
  leaseId: string;
  asOfDate: Date;
  currentLiability: number;
  longTermLiability: number;
  totalLiability: number;
  interestExpenseMtd: number;
  interestExpenseYtd: number;
  nextPaymentDate: Date;
  nextPaymentAmount: number;
}

export async function getAmortizationSummary(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof GetAmortizationSummaryParams>,
): Promise<Result<AmortizationSummary>> {
  const validated = GetAmortizationSummaryParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Query amortization summary from DB
  return ok({
    leaseId: validated.data.leaseId,
    asOfDate: validated.data.asOfDate,
    currentLiability: 0,
    longTermLiability: 0,
    totalLiability: 0,
    interestExpenseMtd: 0,
    interestExpenseYtd: 0,
    nextPaymentDate: new Date(),
    nextPaymentAmount: 0,
  });
}
