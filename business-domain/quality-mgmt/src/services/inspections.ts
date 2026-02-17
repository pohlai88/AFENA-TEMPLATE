/**
 * Inspections
 * 
 * Quality inspection plans and execution.
 */

import type { Result } from 'afenda-canon';
import { err, ok } from 'afenda-canon';
import type { Database } from 'afenda-database';
import { z } from 'zod';

export const InspectionPlanSchema = z.object({
  planId: z.string(),
  itemId: z.string(),
  inspectionType: z.enum(['receiving', 'in_process', 'final', 'source']),
  samplingPlan: z.enum(['zero_defects', 'ansi_z1_4', 'mil_std_105', 'full_inspection']),
  acceptanceQuality: z.number(),
  tests: z.array(z.object({
    testId: z.string(),
    characteristic: z.string(),
    method: z.string(),
    lowerLimit: z.number().optional(),
    upperLimit: z.number().optional(),
    target: z.number().optional(),
    required: z.boolean(),
  })),
  active: z.boolean(),
});

export type InspectionPlan = z.infer<typeof InspectionPlanSchema>;

export const InspectionResultSchema = z.object({
  inspectionId: z.string(),
  planId: z.string(),
  lotNumber: z.string(),
  lotSize: z.number(),
  sampleSize: z.number(),
  inspectedBy: z.string(),
  inspectedAt: z.string(),
  testResults: z.array(z.object({
    testId: z.string(),
    characteristic: z.string(),
    measuredValue: z.number().optional(),
    pass: z.boolean(),
    notes: z.string().optional(),
  })),
  disposition: z.enum(['accept', 'reject', 'conditional', 'hold']),
  defectsFound: z.number(),
});

export type InspectionResult = z.infer<typeof InspectionResultSchema>;

/**
 * Create inspection plan
 */
export async function createInspectionPlan(
  db: Database,
  orgId: string,
  params: {
    planId: string;
    itemId: string;
    inspectionType: 'receiving' | 'in_process' | 'final' | 'source';
    samplingPlan: 'zero_defects' | 'ansi_z1_4' | 'mil_std_105' | 'full_inspection';
    acceptanceQuality: number;
    tests: Array<{
      testId: string;
      characteristic: string;
      method: string;
      lowerLimit?: number;
      upperLimit?: number;
      target?: number;
      required?: boolean;
    }>;
  },
): Promise<Result<InspectionPlan>> {
  const validation = z.object({
    planId: z.string().min(1),
    itemId: z.string().min(1),
    inspectionType: z.enum(['receiving', 'in_process', 'final', 'source']),
    samplingPlan: z.enum(['zero_defects', 'ansi_z1_4', 'mil_std_105', 'full_inspection']),
    acceptanceQuality: z.number().min(0).max(100),
    tests: z.array(z.object({
      testId: z.string(),
      characteristic: z.string(),
      method: z.string(),
      lowerLimit: z.number().optional(),
      upperLimit: z.number().optional(),
      target: z.number().optional(),
      required: z.boolean().optional(),
    })).min(1),
  }).safeParse(params);

  if (!validation.success) {
    return err({
      code: 'VALIDATION_ERROR',
      message: validation.error.message,
    });
  }

  // Placeholder: In production, insert into inspection_plans table
  return ok({
    planId: params.planId,
    itemId: params.itemId,
    inspectionType: params.inspectionType,
    samplingPlan: params.samplingPlan,
    acceptanceQuality: params.acceptanceQuality,
    tests: params.tests.map((test) => ({
      ...test,
      required: test.required !== false,
    })),
    active: true,
  });
}

/**
 * Perform inspection
 */
export async function performInspection(
  db: Database,
  orgId: string,
  params: {
    inspectionId: string;
    planId: string;
    lotNumber: string;
    lotSize: number;
    sampleSize: number;
    inspectedBy: string;
    testResults: Array<{
      testId: string;
      characteristic: string;
      measuredValue?: number;
      pass: boolean;
      notes?: string;
    }>;
  },
): Promise<Result<InspectionResult>> {
  const validation = z.object({
    inspectionId: z.string().min(1),
    planId: z.string().min(1),
    lotNumber: z.string().min(1),
    lotSize: z.number().int().positive(),
    sampleSize: z.number().int().positive(),
    inspectedBy: z.string().min(1),
    testResults: z.array(z.object({
      testId: z.string(),
      characteristic: z.string(),
      measuredValue: z.number().optional(),
      pass: z.boolean(),
      notes: z.string().optional(),
    })).min(1),
  }).safeParse(params);

  if (!validation.success) {
    return err({
      code: 'VALIDATION_ERROR',
      message: validation.error.message,
    });
  }

  if (params.sampleSize > params.lotSize) {
    return err({
      code: 'VALIDATION_ERROR',
      message: 'Sample size cannot exceed lot size',
    });
  }

  // Determine disposition based on test results
  const failedTests = params.testResults.filter((t) => !t.pass);
  const defectsFound = failedTests.length;

  let disposition: 'accept' | 'reject' | 'conditional' | 'hold';
  if (defectsFound === 0) {
    disposition = 'accept';
  } else if (failedTests.some((t) => t.characteristic.includes('critical'))) {
    disposition = 'reject';
  } else if (defectsFound <= 2) {
    disposition = 'conditional';
  } else {
    disposition = 'reject';
  }

  // Placeholder: In production, insert into inspection_results table
  return ok({
    inspectionId: params.inspectionId,
    planId: params.planId,
    lotNumber: params.lotNumber,
    lotSize: params.lotSize,
    sampleSize: params.sampleSize,
    inspectedBy: params.inspectedBy,
    inspectedAt: new Date().toISOString(),
    testResults: params.testResults,
    disposition,
    defectsFound,
  });
}
