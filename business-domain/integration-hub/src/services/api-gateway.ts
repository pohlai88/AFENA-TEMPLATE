import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

const RegisterAPIParams = z.object({ apiName: z.string(), endpoint: z.string(), methods: z.array(z.string()) });
export interface APIRegistration { apiId: string; apiName: string; endpoint: string; registeredAt: Date }
export async function registerAPI(db: DbInstance, orgId: string, params: z.infer<typeof RegisterAPIParams>): Promise<Result<APIRegistration>> {
  const validated = RegisterAPIParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  return ok({ apiId: 'api-1', apiName: validated.data.apiName, endpoint: validated.data.endpoint, registeredAt: new Date() });
}

const RouteRequestParams = z.object({ apiId: z.string(), requestData: z.any() });
export interface APIRoute { routeId: string; apiId: string; responseStatus: number; latencyMs: number }
export async function routeRequest(db: DbInstance, orgId: string, params: z.infer<typeof RouteRequestParams>): Promise<Result<APIRoute>> {
  const validated = RouteRequestParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  return ok({ routeId: 'route-1', apiId: validated.data.apiId, responseStatus: 200, latencyMs: 45 });
}
