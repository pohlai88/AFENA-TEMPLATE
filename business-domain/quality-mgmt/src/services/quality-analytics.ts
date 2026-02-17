/**
 * Quality Analytics
 * 
 * Defect analysis and cost of quality.
 */

import type { Result } from 'afenda-canon';
import { err, ok } from 'afenda-canon';
import type { Database } from 'afenda-database';
import { z } from 'zod';

export const DefectAnalysisSchema = z.object({
  period: z.string(),
  totalInspections: z.number(),
  totalDefects: z.number(),
  defectRate: z.number(),
  defectsByType: z.array(z.object({
    defectCode: z.string(),
    description: z.string(),
    count: z.number(),
    percentage: z.number(),
    cumulativePercentage: z.number(),
  })),
  top3Defects: z.array(z.string()),
  dpmo: z.number(), // Defects per million opportunities
});

export type DefectAnalysis = z.infer<typeof DefectAnalysisSchema>;

export const CostOfQualitySchema = z.object({
  period: z.string(),
  prevention: z.object({
    training: z.number(),
    processImprovement: z.number(),
    qualityPlanning: z.number(),
    total: z.number(),
  }),
  appraisal: z.object({
    inspections: z.number(),
    testing: z.number(),
    audits: z.number(),
    total: z.number(),
  }),
  internalFailure: z.object({
    scrap: z.number(),
    rework: z.number(),
    retest: z.number(),
    total: z.number(),
  }),
  externalFailure: z.object({
    returns: z.number(),
    warranty: z.number(),
    recalls: z.number(),
    total: z.number(),
  }),
  totalCOQ: z.number(),
  revenue: z.number(),
  coqPercentage: z.number(),
});

export type CostOfQuality = z.infer<typeof CostOfQualitySchema>;

/**
 * Analyze defects using Pareto principle
 */
export async function analyzeDefects(
  db: Database,
  orgId: string,
  params: {
    period: string;
    defectData: Array<{
      defectCode: string;
      description: string;
      count: number;
    }>;
    totalInspections: number;
    opportunitiesPerUnit?: number;
  },
): Promise<Result<DefectAnalysis>> {
  const validation = z.object({
    period: z.string(),
    defectData: z.array(z.object({
      defectCode: z.string(),
      description: z.string(),
      count: z.number().int().nonnegative(),
    })),
    totalInspections: z.number().int().positive(),
    opportunitiesPerUnit: z.number().int().positive().optional(),
  }).safeParse(params);

  if (!validation.success) {
    return err({
      code: 'VALIDATION_ERROR',
      message: validation.error.message,
    });
  }

  // Sort defects by count (descending)
  const sorted = [...params.defectData].sort((a, b) => b.count - a.count);

  const totalDefects = sorted.reduce((sum, d) => sum + d.count, 0);
  const defectRate = params.totalInspections > 0 ? (totalDefects / params.totalInspections) * 100 : 0;

  // Calculate Pareto percentages
  let cumulative = 0;
  const defectsByType = sorted.map((defect) => {
    const percentage = totalDefects > 0 ? (defect.count / totalDefects) * 100 : 0;
    cumulative += percentage;

    return {
      defectCode: defect.defectCode,
      description: defect.description,
      count: defect.count,
      percentage: Math.round(percentage * 100) / 100,
      cumulativePercentage: Math.round(cumulative * 100) / 100,
    };
  });

  const top3Defects = defectsByType.slice(0, 3).map((d) => d.defectCode);

  // Calculate DPMO (Defects Per Million Opportunities)
  const opportunities = params.totalInspections * (params.opportunitiesPerUnit || 1);
  const dpmo = opportunities > 0 ? Math.round((totalDefects / opportunities) * 1_000_000) : 0;

  return ok({
    period: params.period,
    totalInspections: params.totalInspections,
    totalDefects,
    defectRate: Math.round(defectRate * 100) / 100,
    defectsByType,
    top3Defects,
    dpmo,
  });
}

/**
 * Calculate Cost of Quality (COQ)
 */
export async function calculateCOQ(
  db: Database,
  orgId: string,
  params: {
    period: string;
    prevention: {
      training: number;
      processImprovement: number;
      qualityPlanning: number;
    };
    appraisal: {
      inspections: number;
      testing: number;
      audits: number;
    };
    internalFailure: {
      scrap: number;
      rework: number;
      retest: number;
    };
    externalFailure: {
      returns: number;
      warranty: number;
      recalls: number;
    };
    revenue: number;
  },
): Promise<Result<CostOfQuality>> {
  const validation = z.object({
    period: z.string(),
    prevention: z.object({
      training: z.number().nonnegative(),
      processImprovement: z.number().nonnegative(),
      qualityPlanning: z.number().nonnegative(),
    }),
    appraisal: z.object({
      inspections: z.number().nonnegative(),
      testing: z.number().nonnegative(),
      audits: z.number().nonnegative(),
    }),
    internalFailure: z.object({
      scrap: z.number().nonnegative(),
      rework: z.number().nonnegative(),
      retest: z.number().nonnegative(),
    }),
    externalFailure: z.object({
      returns: z.number().nonnegative(),
      warranty: z.number().nonnegative(),
      recalls: z.number().nonnegative(),
    }),
    revenue: z.number().positive(),
  }).safeParse(params);

  if (!validation.success) {
    return err({
      code: 'VALIDATION_ERROR',
      message: validation.error.message,
    });
  }

  // Calculate category totals
  const preventionTotal =
    params.prevention.training +
    params.prevention.processImprovement +
    params.prevention.qualityPlanning;

  const appraisalTotal =
    params.appraisal.inspections +
    params.appraisal.testing +
    params.appraisal.audits;

  const internalFailureTotal =
    params.internalFailure.scrap +
    params.internalFailure.rework +
    params.internalFailure.retest;

  const externalFailureTotal =
    params.externalFailure.returns +
    params.externalFailure.warranty +
    params.externalFailure.recalls;

  const totalCOQ = preventionTotal + appraisalTotal + internalFailureTotal + externalFailureTotal;

  const coqPercentage = (totalCOQ / params.revenue) * 100;

  return ok({
    period: params.period,
    prevention: {
      ...params.prevention,
      total: preventionTotal,
    },
    appraisal: {
      ...params.appraisal,
      total: appraisalTotal,
    },
    internalFailure: {
      ...params.internalFailure,
      total: internalFailureTotal,
    },
    externalFailure: {
      ...params.externalFailure,
      total: externalFailureTotal,
    },
    totalCOQ,
    revenue: params.revenue,
    coqPercentage: Math.round(coqPercentage * 100) / 100,
  });
}
