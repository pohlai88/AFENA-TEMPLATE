import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

const CreateLeaseContractParams = z.object({
  leaseType: z.enum(['finance', 'operating', 'short_term']),
  lessor: z.string(),
  assetDescription: z.string(),
  commencementDate: z.date(),
  terminationDate: z.date(),
  monthlyPayment: z.number(),
  residualValue: z.number().optional(),
  discountRate: z.number(),
});

export interface LeaseContract {
  leaseId: string;
  leaseType: 'finance' | 'operating' | 'short_term';
  lessor: string;
  assetDescription: string;
  commencementDate: Date;
  terminationDate: Date;
  monthlyPayment: number;
  residualValue?: number;
  discountRate: number;
  classification: string;
  status: 'active' | 'modified' | 'terminated';
  createdAt: Date;
}

export async function createLeaseContract(
  db: DbInstance,
  orgId: string,
  userId: string,
  params: z.infer<typeof CreateLeaseContractParams>,
): Promise<Result<LeaseContract>> {
  const validated = CreateLeaseContractParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Create lease contract and classify per ASC 842
  return ok({
    leaseId: `lease-${Date.now()}`,
    leaseType: validated.data.leaseType,
    lessor: validated.data.lessor,
    assetDescription: validated.data.assetDescription,
    commencementDate: validated.data.commencementDate,
    terminationDate: validated.data.terminationDate,
    monthlyPayment: validated.data.monthlyPayment,
    residualValue: validated.data.residualValue,
    discountRate: validated.data.discountRate,
    classification: validated.data.leaseType,
    status: 'active',
    createdAt: new Date(),
  });
}

const ClassifyLeaseParams = z.object({
  leaseId: z.string(),
  presentValuePayments: z.number(),
  fairValue: z.number(),
  leaseTerm: z.number(),
  economicLife: z.number(),
});

export interface LeaseClassification {
  leaseId: string;
  classification: 'finance' | 'operating';
  criteria: {
    ownershipTransfer: boolean;
    purchaseOption: boolean;
    leaseTermMajorPart: boolean;
    presentValueSubstantial: boolean;
    specializedAsset: boolean;
  };
  effectiveDate: Date;
}

export async function classifyLease(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof ClassifyLeaseParams>,
): Promise<Result<LeaseClassification>> {
  const validated = ClassifyLeaseParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Apply ASC 842 classification criteria
  const pvRatio = validated.data.presentValuePayments / validated.data.fairValue;
  const termRatio = validated.data.leaseTerm / validated.data.economicLife;

  return ok({
    leaseId: validated.data.leaseId,
    classification: pvRatio >= 0.9 || termRatio >= 0.75 ? 'finance' : 'operating',
    criteria: {
      ownershipTransfer: false,
      purchaseOption: false,
      leaseTermMajorPart: termRatio >= 0.75,
      presentValueSubstantial: pvRatio >= 0.9,
      specializedAsset: false,
    },
    effectiveDate: new Date(),
  });
}

const GetLeasePortfolioParams = z.object({
  status: z.enum(['active', 'modified', 'terminated', 'all']).optional(),
  leaseType: z.enum(['finance', 'operating', 'short_term', 'all']).optional(),
});

export interface LeasePortfolio {
  totalLeases: number;
  activeLeases: number;
  financeLeases: number;
  operatingLeases: number;
  totalLiability: number;
  totalRouAsset: number;
  leases: LeaseContract[];
}

export async function getLeasePortfolio(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof GetLeasePortfolioParams>,
): Promise<Result<LeasePortfolio>> {
  const validated = GetLeasePortfolioParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Query lease portfolio with filters
  return ok({
    totalLeases: 0,
    activeLeases: 0,
    financeLeases: 0,
    operatingLeases: 0,
    totalLiability: 0,
    totalRouAsset: 0,
    leases: [],
  });
}

const UpdateLeaseTermsParams = z.object({
  leaseId: z.string(),
  monthlyPayment: z.number().optional(),
  terminationDate: z.date().optional(),
  discountRate: z.number().optional(),
});

export interface LeaseTermsUpdate {
  leaseId: string;
  updatedFields: string[];
  requiresRemeasurement: boolean;
  updatedAt: Date;
}

export async function updateLeaseTerms(
  db: DbInstance,
  orgId: string,
  userId: string,
  params: z.infer<typeof UpdateLeaseTermsParams>,
): Promise<Result<LeaseTermsUpdate>> {
  const validated = UpdateLeaseTermsParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Update lease terms and trigger remeasurement if needed
  const updatedFields: string[] = [];
  if (validated.data.monthlyPayment) updatedFields.push('monthlyPayment');
  if (validated.data.terminationDate) updatedFields.push('terminationDate');
  if (validated.data.discountRate) updatedFields.push('discountRate');

  return ok({
    leaseId: validated.data.leaseId,
    updatedFields,
    requiresRemeasurement: updatedFields.length > 0,
    updatedAt: new Date(),
  });
}
