import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

const GenerateBOMParams = z.object({ configurationId: z.string() });
export interface BillOfMaterials { bomId: string; configurationId: string; totalComponents: number; components: Array<{ partId: string; quantity: number }> }
export async function generateBOM(db: DbInstance, orgId: string, params: z.infer<typeof GenerateBOMParams>): Promise<Result<BillOfMaterials>> {
  const validated = GenerateBOMParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  return ok({ bomId: 'bom-1', configurationId: validated.data.configurationId, totalComponents: 15, components: [{ partId: 'part-1', quantity: 2 }] });
}

const EstimateCostParams = z.object({ configurationId: z.string(), includeLabor: z.boolean().default(true) });
export interface CostEstimate { configurationId: string; materialCostMinor: number; laborCostMinor: number; totalCostMinor: number }
export async function estimateCost(db: DbInstance, orgId: string, params: z.infer<typeof EstimateCostParams>): Promise<Result<CostEstimate>> {
  const validated = EstimateCostParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  const materialCostMinor = 350000; const laborCostMinor = validated.data.includeLabor ? 75000 : 0;
  return ok({ configurationId: validated.data.configurationId, materialCostMinor, laborCostMinor, totalCostMinor: materialCostMinor + laborCostMinor });
}
