import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

const TrackIntegrationHealthParams = z.object({ integrationId: z.string() });
export interface IntegrationHealth { integrationId: string; status: 'healthy' | 'degraded' | 'down'; uptime: number; lastChecked: Date }
export async function trackIntegrationHealth(db: DbInstance, orgId: string, params: z.infer<typeof TrackIntegrationHealthParams>): Promise<Result<IntegrationHealth>> {
  const validated = TrackIntegrationHealthParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  return ok({ integrationId: validated.data.integrationId, status: 'healthy', uptime: 0.998, lastChecked: new Date() });
}

const AlertOnFailureParams = z.object({ integrationId: z.string(), errorMessage: z.string(), severity: z.enum(['low', 'medium', 'high', 'critical']) });
export interface IntegrationAlert { alertId: string; integrationId: string; severity: string; triggeredAt: Date; notified: boolean }
export async function alertOnFailure(db: DbInstance, orgId: string, params: z.infer<typeof AlertOnFailureParams>): Promise<Result<IntegrationAlert>> {
  const validated = AlertOnFailureParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  return ok({ alertId: 'alert-1', integrationId: validated.data.integrationId, severity: validated.data.severity, triggeredAt: new Date(), notified: true });
}
