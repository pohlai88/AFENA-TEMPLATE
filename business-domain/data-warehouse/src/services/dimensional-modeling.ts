import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

export const CreateDimensionParams = z.object({
  dimensionName: z.string(),
  attributes: z.array(z.object({ name: z.string(), dataType: z.string() })),
  slowlyChangingType: z.enum(['type1', 'type2', 'type3']),
});

export interface Dimension {
  dimensionId: string;
  dimensionName: string;
  tableName: string;
  totalAttributes: number;
  slowlyChangingType: string;
  createdAt: Date;
}

export async function createDimension(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof CreateDimensionParams>,
): Promise<Result<Dimension>> {
  const validated = CreateDimensionParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  const tableName = `dim_${validated.data.dimensionName.toLowerCase().replace(/\s+/g, '_')}`;
  return ok({ dimensionId: 'dim-1', dimensionName: validated.data.dimensionName, tableName, totalAttributes: validated.data.attributes.length, slowlyChangingType: validated.data.slowlyChangingType, createdAt: new Date() });
}

export const CreateFactTableParams = z.object({
  factName: z.string(),
  measures: z.array(z.object({ name: z.string(), aggregation: z.enum(['sum', 'avg', 'count', 'min', 'max']) })),
  dimensions: z.array(z.string()),
});

export interface FactTable {
  factId: string;
  factName: string;
  tableName: string;
  totalMeasures: number;
  totalDimensions: number;
  granularity: string;
}

export async function createFactTable(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof CreateFactTableParams>,
): Promise<Result<FactTable>> {
  const validated = CreateFactTableParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  const tableName = `fact_${validated.data.factName.toLowerCase().replace(/\s+/g, '_')}`;
  return ok({ factId: 'fact-1', factName: validated.data.factName, tableName, totalMeasures: validated.data.measures.length, totalDimensions: validated.data.dimensions.length, granularity: 'daily' });
}
