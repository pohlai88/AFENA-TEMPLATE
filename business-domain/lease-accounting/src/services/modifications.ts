import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

const RecordModificationParams = z.object({
  leaseId: z.string(),
  modificationType: z.enum(['payment_change', 'term_extension', 'term_reduction', 'scope_change']),
  effectiveDate: z.date(),
  description: z.string(),
  newMonthlyPayment: z.number().optional(),
  newTerminationDate: z.date().optional(),
  additionalConsideration: z.number().optional(),
});

export interface LeaseModification {
  modificationId: string;
  leaseId: string;
  modificationType: string;
  effectiveDate: Date;
  description: string;
  accountingTreatment: 'separate_contract' | 'remeasurement' | 'adjustment';
  requiresRemeasurement: boolean;
  impactAmount: number;
  status: 'pending' | 'approved' | 'processed';
  createdAt: Date;
}

export async function recordModification(
  db: DbInstance,
  orgId: string,
  userId: string,
  params: z.infer<typeof RecordModificationParams>,
): Promise<Result<LeaseModification>> {
  const validated = RecordModificationParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Record lease modification and determine accounting treatment
  let accountingTreatment: LeaseModification['accountingTreatment'] = 'remeasurement';
  let requiresRemeasurement = true;

  if (validated.data.additionalConsideration && validated.data.additionalConsideration > 0) {
    accountingTreatment = 'separate_contract';
    requiresRemeasurement = false;
  }

  return ok({
    modificationId: `mod-${Date.now()}`,
    leaseId: validated.data.leaseId,
    modificationType: validated.data.modificationType,
    effectiveDate: validated.data.effectiveDate,
    description: validated.data.description,
    accountingTreatment,
    requiresRemeasurement,
    impactAmount: validated.data.newMonthlyPayment ?? 0,
    status: 'pending',
    createdAt: new Date(),
  });
}

const ReassessLeaseParams = z.object({
  leaseId: z.string(),
  reassessmentDate: z.date(),
  reassessmentTrigger: z.enum([
    'significant_event',
    'option_exercise',
    'termination_penalty',
    'purchase_option',
  ]),
  newAssumptions: z.object({
    discountRate: z.number().optional(),
    leaseTerm: z.number().optional(),
    residualValue: z.number().optional(),
  }),
});

export interface LeaseReassessment {
  reassessmentId: string;
  leaseId: string;
  reassessmentDate: Date;
  trigger: string;
  previousLiability: number;
  newLiability: number;
  adjustment: number;
  previousRouAsset: number;
  newRouAsset: number;
  remeasurementRequired: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected';
}

export async function reassessLease(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof ReassessLeaseParams>,
): Promise<Result<LeaseReassessment>> {
  const validated = ReassessLeaseParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Perform lease reassessment and calculate adjustments
  const previousLiability = 0; // TODO: Get from DB
  const newLiability = 0; // TODO: Calculate with new assumptions

  return ok({
    reassessmentId: `reassess-${Date.now()}`,
    leaseId: validated.data.leaseId,
    reassessmentDate: validated.data.reassessmentDate,
    trigger: validated.data.reassessmentTrigger,
    previousLiability,
    newLiability,
    adjustment: newLiability - previousLiability,
    previousRouAsset: 0,
    newRouAsset: 0,
    remeasurementRequired: true,
    approvalStatus: 'pending',
  });
}

const EvaluateTerminationParams = z.object({
  leaseId: z.string(),
  terminationDate: z.date(),
  terminationPenalty: z.number(),
  remainingPayments: z.number(),
});

export interface TerminationEvaluation {
  leaseId: string;
  terminationDate: Date;
  remainingLiability: number;
  terminationPenalty: number;
  totalCostToTerminate: number;
  routAssetBalance: number;
  gainLossOnTermination: number;
  recommendation: 'terminate' | 'continue' | 'renegotiate';
  costAnalysis: {
    terminateCost: number;
    continueCost: number;
    savings: number;
  };
}

export async function evaluateTermination(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof EvaluateTerminationParams>,
): Promise<Result<TerminationEvaluation>> {
  const validated = EvaluateTerminationParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Evaluate financial impact of early termination
  const remainingLiability = validated.data.remainingPayments * 1000; // TODO: Calculate actual
  const totalCostToTerminate = remainingLiability + validated.data.terminationPenalty;
  const routAssetBalance = 0; // TODO: Get from DB

  return ok({
    leaseId: validated.data.leaseId,
    terminationDate: validated.data.terminationDate,
    remainingLiability,
    terminationPenalty: validated.data.terminationPenalty,
    totalCostToTerminate,
    routAssetBalance,
    gainLossOnTermination: routAssetBalance - totalCostToTerminate,
    recommendation: 'continue',
    costAnalysis: {
      terminateCost: totalCostToTerminate,
      continueCost: remainingLiability,
      savings: 0,
    },
  });
}

const GetModificationHistoryParams = z.object({
  leaseId: z.string(),
  fromDate: z.date().optional(),
  toDate: z.date().optional(),
});

export interface ModificationHistory {
  leaseId: string;
  totalModifications: number;
  modifications: LeaseModification[];
  cumulativeImpact: number;
  lastModificationDate?: Date;
}

export async function getModificationHistory(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof GetModificationHistoryParams>,
): Promise<Result<ModificationHistory>> {
  const validated = GetModificationHistoryParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Query modification history from DB
  return ok({
    leaseId: validated.data.leaseId,
    totalModifications: 0,
    modifications: [],
    cumulativeImpact: 0,
    lastModificationDate: undefined,
  });
}
