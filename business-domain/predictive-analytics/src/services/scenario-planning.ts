import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

const CreateScenarioParams = z.object({ scenarioName: z.string(), variables: z.any(), assumptions: z.any() });
export interface Scenario { scenarioId: string; scenarioName: string; createdAt: Date; status: 'draft' | 'ready' }
export async function createScenario(db: DbInstance, orgId: string, params: z.infer<typeof CreateScenarioParams>): Promise<Result<Scenario>> {
  const validated = CreateScenarioParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  return ok({ scenarioId: 'scen-1', scenarioName: validated.data.scenarioName, createdAt: new Date(), status: 'ready' });
}

const CompareScenariosParams = z.object({ scenarioIds: z.array(z.string()), kpis: z.array(z.string()) });
export interface ScenarioComparison { kpi: string; scenarios: Array<{ scenarioId: string; value: number }> }
export async function compareScenarios(db: DbInstance, orgId: string, params: z.infer<typeof CompareScenariosParams>): Promise<Result<ScenarioComparison[]>> {
  const validated = CompareScenariosParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  return ok([{ kpi: 'revenue', scenarios: [{ scenarioId: 'scen-1', value: 5000000 }] }]);
}
