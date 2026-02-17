import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

const CalculateLandedCostParams = z.object({
  shipmentId: z.string(),
  items: z.array(
    z.object({
      itemId: z.string(),
      quantity: z.number(),
      unitCost: z.number(),
    }),
  ),
  freight: z.number(),
  insurance: z.number(),
  duties: z.number(),
  brokerageFees: z.number(),
  otherFees: z.number().optional(),
});

export interface LandedCost {
  shipmentId: string;
  totalProductCost: number;
  totalFreight: number;
  totalInsurance: number;
  totalDuties: number;
  totalBrokerage: number;
  totalOtherFees: number;
  totalLandedCost: number;
  items: {
    itemId: string;
    quantity: number;
    unitProductCost: number;
    allocatedFreight: number;
    allocatedInsurance: number;
    allocatedDuty: number;
    allocatedBrokerage: number;
    unitLandedCost: number;
    totalLandedCost: number;
  }[];
  calculatedAt: Date;
}

export async function calculateLandedCost(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof CalculateLandedCostParams>,
): Promise<Result<LandedCost>> {
  const validated = CalculateLandedCostParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Calculate landed cost with proper allocation
  const totalProductCost = validated.data.items.reduce(
    (sum, item) => sum + item.quantity * item.unitCost,
    0,
  );

  const totalLandedCost =
    totalProductCost +
    validated.data.freight +
    validated.data.insurance +
    validated.data.duties +
    validated.data.brokerageFees +
    (validated.data.otherFees ?? 0);

  const items = validated.data.items.map((item) => {
    const itemTotal = item.quantity * item.unitCost;
    const allocationRatio = itemTotal / totalProductCost;

    const allocatedFreight = validated.data.freight * allocationRatio;
    const allocatedInsurance = validated.data.insurance * allocationRatio;
    const allocatedDuty = validated.data.duties * allocationRatio;
    const allocatedBrokerage = validated.data.brokerageFees * allocationRatio;

    const unitLandedCost =
      item.unitCost +
      allocatedFreight / item.quantity +
      allocatedInsurance / item.quantity +
      allocatedDuty / item.quantity +
      allocatedBrokerage / item.quantity;

    return {
      itemId: item.itemId,
      quantity: item.quantity,
      unitProductCost: item.unitCost,
      allocatedFreight,
      allocatedInsurance,
      allocatedDuty,
      allocatedBrokerage,
      unitLandedCost,
      totalLandedCost: unitLandedCost * item.quantity,
    };
  });

  return ok({
    shipmentId: validated.data.shipmentId,
    totalProductCost,
    totalFreight: validated.data.freight,
    totalInsurance: validated.data.insurance,
    totalDuties: validated.data.duties,
    totalBrokerage: validated.data.brokerageFees,
    totalOtherFees: validated.data.otherFees ?? 0,
    totalLandedCost,
    items,
    calculatedAt: new Date(),
  });
}

const AllocateDutyParams = z.object({
  shipmentId: z.string(),
  totalDuty: z.number(),
  allocationMethod: z.enum(['value', 'weight', 'quantity']),
});

export interface DutyAllocation {
  shipmentId: string;
  totalDuty: number;
  allocationMethod: string;
  allocations: {
    itemId: string;
    allocationPercent: number;
    dutyAmount: number;
  }[];
}

export async function allocateDuty(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof AllocateDutyParams>,
): Promise<Result<DutyAllocation>> {
  const validated = AllocateDutyParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Allocate duty based on selected method
  return ok({
    shipmentId: validated.data.shipmentId,
    totalDuty: validated.data.totalDuty,
    allocationMethod: validated.data.allocationMethod,
    allocations: [],
  });
}

const PostLandedCostParams = z.object({
  shipmentId: z.string(),
  landedCostData: z.any(),
  postToInventory: z.boolean(),
});

export interface LandedCostPosting {
  shipmentId: string;
  journalEntryId?: string;
  inventoryUpdates: {
    itemId: string;
    newUnitCost: number;
    previousUnitCost: number;
    adjustment: number;
  }[];
  postedAt: Date;
  status: 'posted' | 'pending' | 'failed';
}

export async function postLandedCost(
  db: DbInstance,
  orgId: string,
  userId: string,
  params: z.infer<typeof PostLandedCostParams>,
): Promise<Result<LandedCostPosting>> {
  const validated = PostLandedCostParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Post landed cost to inventory and GL
  return ok({
    shipmentId: validated.data.shipmentId,
    journalEntryId: undefined,
    inventoryUpdates: [],
    postedAt: new Date(),
    status: 'posted',
  });
}

const GetLandedCostSummaryParams = z.object({
  fromDate: z.date(),
  toDate: z.date(),
  supplier: z.string().optional(),
});

export interface LandedCostSummary {
  period: { from: Date; to: Date };
  totalShipments: number;
  totalProductCost: number;
  totalLandedCost: number;
  averageDutyRate: number;
  byCountry: {
    country: string;
    shipments: number;
    landedCost: number;
    dutyRate: number;
  }[];
}

export async function getLandedCostSummary(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof GetLandedCostSummaryParams>,
): Promise<Result<LandedCostSummary>> {
  const validated = GetLandedCostSummaryParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Query landed cost summary
  return ok({
    period: { from: validated.data.fromDate, to: validated.data.toDate },
    totalShipments: 0,
    totalProductCost: 0,
    totalLandedCost: 0,
    averageDutyRate: 0,
    byCountry: [],
  });
}
