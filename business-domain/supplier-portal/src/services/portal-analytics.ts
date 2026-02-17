/**
 * Portal Analytics
 */

import type { Result } from 'afenda-canon';
import { err, ok } from 'afenda-canon';
import type { Database } from 'afenda-database';
import { z } from 'zod';

export const PortalUsageSchema = z.object({
  supplierId: z.string(),
  period: z.string(),
  logins: z.number(),
  poAcknowledgments: z.number(),
  asnSubmissions: z.number(),
  documentsViewed: z.number(),
  messagesExchanged: z.number(),
  averageResponseTime: z.number(),
});

export type PortalUsage = z.infer<typeof PortalUsageSchema>;

export const EngagementMetricsSchema = z.object({
  period: z.string(),
  totalSuppliers: z.number(),
  activeSuppliers: z.number(),
  engagementRate: z.number(),
  adoptionRate: z.number(),
  topActivities: z.array(z.object({
    activity: z.string(),
    count: z.number(),
  })),
});

export type EngagementMetrics = z.infer<typeof EngagementMetricsSchema>;

export async function trackUsage(
  db: Database,
  orgId: string,
  params: {
    supplierId: string;
    period: string;
    activities: {
      logins: number;
      poAcknowledgments: number;
      asnSubmissions: number;
      documentsViewed: number;
      messagesExchanged: number;
    };
    averageResponseTimeHours: number;
  },
): Promise<Result<PortalUsage>> {
  const validation = z.object({
    supplierId: z.string().min(1),
    period: z.string(),
    activities: z.object({
      logins: z.number().int().nonnegative(),
      poAcknowledgments: z.number().int().nonnegative(),
      asnSubmissions: z.number().int().nonnegative(),
      documentsViewed: z.number().int().nonnegative(),
      messagesExchanged: z.number().int().nonnegative(),
    }),
    averageResponseTimeHours: z.number().nonnegative(),
  }).safeParse(params);

  if (!validation.success) {
    return err({ code: 'VALIDATION_ERROR', message: validation.error.message });
  }

  return ok({
    supplierId: params.supplierId,
    period: params.period,
    ...params.activities,
    averageResponseTime: params.averageResponseTimeHours,
  });
}

export async function measureEngagement(
  db: Database,
  orgId: string,
  params: {
    period: string;
    totalSuppliers: number;
    activeSuppliers: number;
    topActivities: Array<{ activity: string; count: number }>;
  },
): Promise<Result<EngagementMetrics>> {
  const validation = z.object({
    period: z.string(),
    totalSuppliers: z.number().int().positive(),
    activeSuppliers: z.number().int().nonnegative(),
    topActivities: z.array(z.object({
      activity: z.string(),
      count: z.number().int().nonnegative(),
    })),
  }).safeParse(params);

  if (!validation.success) {
    return err({ code: 'VALIDATION_ERROR', message: validation.error.message });
  }

  const engagementRate = (params.activeSuppliers / params.totalSuppliers) * 100;
  const adoptionRate = engagementRate; // Simplified

  return ok({
    period: params.period,
    totalSuppliers: params.totalSuppliers,
    activeSuppliers: params.activeSuppliers,
    engagementRate: Math.round(engagementRate * 100) / 100,
    adoptionRate: Math.round(adoptionRate * 100) / 100,
    topActivities: params.topActivities,
  });
}
