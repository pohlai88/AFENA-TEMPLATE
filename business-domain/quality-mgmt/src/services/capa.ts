/**
 * CAPA (Corrective and Preventive Actions)
 * 
 * Systematic problem resolution and prevention.
 */

import type { Result } from 'afenda-canon';
import { err, ok } from 'afenda-canon';
import type { Database } from 'afenda-database';
import { z } from 'zod';

export const CAPASchema = z.object({
  capaId: z.string(),
  type: z.enum(['corrective', 'preventive']),
  source: z.string(),
  problemStatement: z.string(),
  rootCause: z.string(),
  actionPlan: z.array(z.object({
    actionId: z.string(),
    description: z.string(),
    responsible: z.string(),
    targetDate: z.string(),
    status: z.enum(['planned', 'in_progress', 'completed', 'verified']),
  })),
  priority: z.enum(['high', 'medium', 'low']),
  status: z.enum(['draft', 'approved', 'in_progress', 'completed', 'verified', 'closed']),
  initiatedBy: z.string(),
  initiatedAt: z.string(),
});

export type CAPA = z.infer<typeof CAPASchema>;

export const EffectivenessCheckSchema = z.object({
  capaId: z.string(),
  checkId: z.string(),
  checkDate: z.string(),
  checkedBy: z.string(),
  metricsEvaluated: z.array(z.object({
    metric: z.string(),
    beforeValue: z.number(),
    afterValue: z.number(),
    targetValue: z.number(),
    achieved: z.boolean(),
  })),
  effective: z.boolean(),
  notes: z.string().optional(),
});

export type EffectivenessCheck = z.infer<typeof EffectivenessCheckSchema>;

/**
 * Initiate CAPA process
 */
export async function initiateCAPA(
  db: Database,
  orgId: string,
  params: {
    capaId: string;
    type: 'corrective' | 'preventive';
    source: string;
    problemStatement: string;
    rootCause: string;
    actionPlan: Array<{
      actionId: string;
      description: string;
      responsible: string;
      targetDate: string;
    }>;
    priority?: 'high' | 'medium' | 'low';
    initiatedBy: string;
  },
): Promise<Result<CAPA>> {
  const validation = z.object({
    capaId: z.string().min(1),
    type: z.enum(['corrective', 'preventive']),
    source: z.string().min(1),
    problemStatement: z.string().min(1),
    rootCause: z.string().min(1),
    actionPlan: z.array(z.object({
      actionId: z.string(),
      description: z.string(),
      responsible: z.string(),
      targetDate: z.string().datetime(),
    })).min(1),
    priority: z.enum(['high', 'medium', 'low']).optional(),
    initiatedBy: z.string().min(1),
  }).safeParse(params);

  if (!validation.success) {
    return err({
      code: 'VALIDATION_ERROR',
      message: validation.error.message,
    });
  }

  // Placeholder: In production, insert into capa table, create tasks
  const actionPlan = params.actionPlan.map((action) => ({
    ...action,
    status: 'planned' as const,
  }));

  return ok({
    capaId: params.capaId,
    type: params.type,
    source: params.source,
    problemStatement: params.problemStatement,
    rootCause: params.rootCause,
    actionPlan,
    priority: params.priority || 'medium',
    status: 'draft',
    initiatedBy: params.initiatedBy,
    initiatedAt: new Date().toISOString(),
  });
}

/**
 * Verify CAPA effectiveness
 */
export async function verifyEffectiveness(
  db: Database,
  orgId: string,
  params: {
    capaId: string;
    checkId: string;
    checkedBy: string;
    metricsEvaluated: Array<{
      metric: string;
      beforeValue: number;
      afterValue: number;
      targetValue: number;
    }>;
    notes?: string;
  },
): Promise<Result<EffectivenessCheck>> {
  const validation = z.object({
    capaId: z.string().min(1),
    checkId: z.string().min(1),
    checkedBy: z.string().min(1),
    metricsEvaluated: z.array(z.object({
      metric: z.string(),
      beforeValue: z.number(),
      afterValue: z.number(),
      targetValue: z.number(),
    })).min(1),
    notes: z.string().optional(),
  }).safeParse(params);

  if (!validation.success) {
    return err({
      code: 'VALIDATION_ERROR',
      message: validation.error.message,
    });
  }

  // Evaluate each metric
  const metricsEvaluated = params.metricsEvaluated.map((metric) => {
    // Simple logic: if improvement moves value closer to target, it's achieved
    const beforeDistance = Math.abs(metric.beforeValue - metric.targetValue);
    const afterDistance = Math.abs(metric.afterValue - metric.targetValue);
    const achieved = afterDistance <= beforeDistance * 0.5; // 50% improvement threshold

    return {
      ...metric,
      achieved,
    };
  });

  const effective = metricsEvaluated.every((m) => m.achieved);

  // Placeholder: In production, update CAPA status
  return ok({
    capaId: params.capaId,
    checkId: params.checkId,
    checkDate: new Date().toISOString(),
    checkedBy: params.checkedBy,
    metricsEvaluated,
    effective,
    notes: params.notes,
  });
}
