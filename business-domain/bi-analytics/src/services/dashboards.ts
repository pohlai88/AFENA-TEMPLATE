import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

const CreateDashboardParams = z.object({ name: z.string(), widgets: z.array(z.object({ type: z.string(), config: z.any() })) });
export interface Dashboard { dashboardId: string; name: string; widgetCount: number; createdAt: Date }
export async function createDashboard(db: DbInstance, orgId: string, params: z.infer<typeof CreateDashboardParams>): Promise<Result<Dashboard>> {
  const validated = CreateDashboardParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  return ok({ dashboardId: 'dash-1', name: validated.data.name, widgetCount: validated.data.widgets.length, createdAt: new Date() });
}

const UpdateDashboardParams = z.object({ dashboardId: z.string(), updates: z.any() });
export interface DashboardUpdate { dashboardId: string; updatedAt: Date }
export async function updateDashboard(db: DbInstance, orgId: string, params: z.infer<typeof UpdateDashboardParams>): Promise<Result<DashboardUpdate>> {
  const validated = UpdateDashboardParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  return ok({ dashboardId: validated.data.dashboardId, updatedAt: new Date() });
}
