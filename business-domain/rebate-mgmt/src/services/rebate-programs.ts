import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

const CreateRebateProgramParams = z.object({
  programName: z.string(),
  description: z.string(),
  programType: z.enum(['volume', 'growth', 'tiered', 'mix', 'loyalty']),
  startDate: z.date(),
  endDate: z.date(),
  eligibleCustomers: z.array(z.string()).optional(),
  tiers: z.array(
    z.object({
      minVolume: z.number(),
      maxVolume: z.number().optional(),
      rebateRate: z.number(),
      rebateType: z.enum(['percentage', 'fixed_amount']),
    }),
  ),
});

export interface RebateProgram {
  programId: string;
  programName: string;
  description: string;
  programType: string;
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'active' | 'suspended' | 'completed';
  eligibleCustomers: string[];
  tiers: Array<{
    tierId: string;
    minVolume: number;
    maxVolume?: number;
    rebateRate: number;
    rebateType: string;
  }>;
  createdBy: string;
  createdAt: Date;
}

export async function createRebateProgram(
  db: DbInstance,
  orgId: string,
  userId: string,
  params: z.infer<typeof CreateRebateProgramParams>,
): Promise<Result<RebateProgram>> {
  const validated = CreateRebateProgramParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Create rebate program with tiers
  return ok({
    programId: `prog-${Date.now()}`,
    programName: validated.data.programName,
    description: validated.data.description,
    programType: validated.data.programType,
    startDate: validated.data.startDate,
    endDate: validated.data.endDate,
    status: 'draft',
    eligibleCustomers: validated.data.eligibleCustomers ?? [],
    tiers: validated.data.tiers.map((tier, idx) => ({
      tierId: `tier-${idx}`,
      ...tier,
    })),
    createdBy: userId,
    createdAt: new Date(),
  });
}

const UpdateProgramStatusParams = z.object({
  programId: z.string(),
  status: z.enum(['active', 'suspended', 'completed']),
});

export interface ProgramStatusUpdate {
  programId: string;
  previousStatus: string;
  newStatus: string;
  updatedBy: string;
  updatedAt: Date;
}

export async function updateProgramStatus(
  db: DbInstance,
  orgId: string,
  userId: string,
  params: z.infer<typeof UpdateProgramStatusParams>,
): Promise<Result<ProgramStatusUpdate>> {
  const validated = UpdateProgramStatusParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Update program status
  return ok({
    programId: validated.data.programId,
    previousStatus: 'draft',
    newStatus: validated.data.status,
    updatedBy: userId,
    updatedAt: new Date(),
  });
}

const GetProgramsParams = z.object({
  status: z.enum(['draft', 'active', 'suspended', 'completed']).optional(),
  customerId: z.string().optional(),
});

export interface ProgramList {
  programs: RebateProgram[];
  totalCount: number;
  activePrograms: number;
}

export async function getPrograms(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof GetProgramsParams>,
): Promise<Result<ProgramList>> {
  const validated = GetProgramsParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Get rebate programs with filters
  return ok({
    programs: [],
    totalCount: 0,
    activePrograms: 0,
  });
}

const CalculateTierParams = z.object({
  programId: z.string(),
  customerId: z.string(),
  purchaseVolume: z.number(),
});

export interface TierCalculation {
  programId: string;
  customerId: string;
  currentVolume: number;
  currentTier: {
    tierId: string;
    rebateRate: number;
    rebateType: string;
  } | null;
  nextTier: {
    tierId: string;
    volumeRequired: number;
    rebateRate: number;
  } | null;
  projectedRebate: number;
}

export async function calculateTier(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof CalculateTierParams>,
): Promise<Result<TierCalculation>> {
  const validated = CalculateTierParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Calculate customer's current tier and rebate
  return ok({
    programId: validated.data.programId,
    customerId: validated.data.customerId,
    currentVolume: validated.data.purchaseVolume,
    currentTier: {
      tierId: 'tier-2',
      rebateRate: 3.5,
      rebateType: 'percentage',
    },
    nextTier: {
      tierId: 'tier-3',
      volumeRequired: 50000,
      rebateRate: 5.0,
    },
    projectedRebate: 3500,
  });
}
