import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

const LinkSparePartParams = z.object({
  assetId: z.string(),
  partId: z.string(),
  quantity: z.number().positive(),
  criticalityLevel: z.enum(['critical', 'important', 'normal']),
  minimumStockLevel: z.number().nonnegative(),
  reorderPoint: z.number().nonnegative(),
});

export interface SparePartLink {
  linkId: string;
  assetId: string;
  partId: string;
  quantity: number;
  criticalityLevel: string;
  minimumStockLevel: number;
  reorderPoint: number;
  currentStock: number;
  createdAt: Date;
}

export async function linkSparePart(
  db: DbInstance,
  orgId: string,
  userId: string,
  params: z.infer<typeof LinkSparePartParams>,
): Promise<Result<SparePartLink>> {
  const validated = LinkSparePartParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Implement spare part linking with inventory check
  return ok({
    linkId: `link-${Date.now()}`,
    assetId: validated.data.assetId,
    partId: validated.data.partId,
    quantity: validated.data.quantity,
    criticalityLevel: validated.data.criticalityLevel,
    minimumStockLevel: validated.data.minimumStockLevel,
    reorderPoint: validated.data.reorderPoint,
    currentStock: validated.data.quantity,
    createdAt: new Date(),
  });
}

const CheckPartsAvailabilityParams = z.object({
  assetId: z.string(),
  requiredParts: z.array(
    z.object({
      partId: z.string(),
      quantity: z.number().positive(),
    }),
  ),
});

export interface PartsAvailability {
  assetId: string;
  partsStatus: Array<{
    partId: string;
    requiredQuantity: number;
    availableQuantity: number;
    isAvailable: boolean;
    shortfall?: number;
  }>;
  allPartsAvailable: boolean;
  checkedAt: Date;
}

export async function checkPartsAvailability(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof CheckPartsAvailabilityParams>,
): Promise<Result<PartsAvailability>> {
  const validated = CheckPartsAvailabilityParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Implement parts availability check with warehouse integration
  return ok({
    assetId: validated.data.assetId,
    partsStatus: validated.data.requiredParts.map((part) => ({
      partId: part.partId,
      requiredQuantity: part.quantity,
      availableQuantity: part.quantity,
      isAvailable: true,
    })),
    allPartsAvailable: true,
    checkedAt: new Date(),
  });
}

const ConsumePartsParams = z.object({
  workOrderId: z.string(),
  assetId: z.string(),
  parts: z.array(
    z.object({
      partId: z.string(),
      quantity: z.number().positive(),
      reason: z.string(),
    }),
  ),
});

export interface PartsConsumption {
  consumptionId: string;
  workOrderId: string;
  assetId: string;
  consumedBy: string;
  parts: Array<{
    partId: string;
    quantity: number;
    reason: string;
    unitCost: number;
  }>;
  totalCost: number;
  consumedAt: Date;
}

export async function consumeParts(
  db: DbInstance,
  orgId: string,
  userId: string,
  params: z.infer<typeof ConsumePartsParams>,
): Promise<Result<PartsConsumption>> {
  const validated = ConsumePartsParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Implement parts consumption with inventory deduction
  return ok({
    consumptionId: `cons-${Date.now()}`,
    workOrderId: validated.data.workOrderId,
    assetId: validated.data.assetId,
    consumedBy: userId,
    parts: validated.data.parts.map((part) => ({
      partId: part.partId,
      quantity: part.quantity,
      reason: part.reason,
      unitCost: 100.0,
    })),
    totalCost: validated.data.parts.reduce((sum, part) => sum + part.quantity * 100, 0),
    consumedAt: new Date(),
  });
}

const GetPartsUsageParams = z.object({
  assetId: z.string().optional(),
  partId: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

export interface PartsUsageReport {
  assetId?: string;
  partId?: string;
  periodStart: Date;
  periodEnd: Date;
  usageEntries: Array<{
    partId: string;
    partDescription: string;
    totalQuantity: number;
    totalCost: number;
    usageCount: number;
    averagePerUsage: number;
  }>;
  totalPartsUsed: number;
  totalCost: number;
}

export async function getPartsUsage(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof GetPartsUsageParams>,
): Promise<Result<PartsUsageReport>> {
  const validated = GetPartsUsageParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Implement parts usage reporting with analytics
  return ok({
    assetId: validated.data.assetId,
    partId: validated.data.partId,
    periodStart: new Date(validated.data.startDate),
    periodEnd: new Date(validated.data.endDate),
    usageEntries: [
      {
        partId: 'part-001',
        partDescription: 'Sample part',
        totalQuantity: 10,
        totalCost: 1000.0,
        usageCount: 5,
        averagePerUsage: 2,
      },
    ],
    totalPartsUsed: 10,
    totalCost: 1000.0,
  });
}
