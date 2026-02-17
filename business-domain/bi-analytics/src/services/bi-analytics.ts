import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

const AnalyzeUserActivityParams = z.object({ periodStart: z.date(), periodEnd: z.date() });
export interface UserActivity { totalUsers: number; activeUsers: number; topDashboards: Array<{ dashboardId: string; views: number }> }
export async function analyzeUserActivity(db: DbInstance, orgId: string, params: z.infer<typeof AnalyzeUserActivityParams>): Promise<Result<UserActivity>> {
  const validated = AnalyzeUserActivityParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  return ok({ totalUsers: 85, activeUsers: 62, topDashboards: [{ dashboardId: 'dash-1', views: 450 }] });
}

const RecommendInsightsParams = z.object({ userId: z.string(), context: z.any() });
export interface InsightRecommendation { insightType: string; title: string; description: string; confidence: number }
export async function recommendInsights(db: DbInstance, orgId: string, params: z.infer<typeof RecommendInsightsParams>): Promise<Result<InsightRecommendation[]>> {
  const validated = RecommendInsightsParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  return ok([{ insightType: 'anomaly', title: 'Sales spike detected', description: 'Revenue increased 25% vs last week', confidence: 0.92 }]);
}
