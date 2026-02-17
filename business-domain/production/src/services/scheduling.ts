/**
 * Production Scheduling
 * 
 * Finite/infinite capacity scheduling and dispatch lists.
 */

import type { Result } from 'afenda-canon';
import { err, ok } from 'afenda-canon';
import type { Database } from 'afenda-database';
import { z } from 'zod';

export const ProductionScheduleSchema = z.object({
  scheduleId: z.string(),
  workCenterId: z.string(),
  scheduledJobs: z.array(z.object({
    workOrderId: z.string(),
    operationId: z.string(),
    sequence: z.number(),
    startTime: z.string(),
    endTime: z.string(),
    setupMinutes: z.number(),
    runMinutes: z.number(),
  })),
  utilizationPercent: z.number(),
  makespan: z.number(),
});

export type ProductionSchedule = z.infer<typeof ProductionScheduleSchema>;

export const DispatchListSchema = z.object({
  workCenterId: z.string(),
  generatedAt: z.string(),
  jobs: z.array(z.object({
    workOrderId: z.string(),
    operationId: z.string(),
    itemId: z.string(),
    quantity: z.number(),
    priority: z.number(),
    dueDate: z.string(),
    estimatedDuration: z.number(),
    dispatchPriority: z.number(),
  })),
  sortRule: z.enum(['earliest_due_date', 'shortest_processing_time', 'critical_ratio']),
});

export type DispatchList = z.infer<typeof DispatchListSchema>;

/**
 * Schedule production using finite capacity
 */
export async function scheduleProduction(
  db: Database,
  orgId: string,
  params: {
    scheduleId: string;
    workCenterId: string;
    jobs: Array<{
      workOrderId: string;
      operationId: string;
      setupMinutes: number;
      runMinutes: number;
      dueDate: string;
    }>;
    capacityMinutesPerDay: number;
    startDate: string;
  },
): Promise<Result<ProductionSchedule>> {
  const validation = z.object({
    scheduleId: z.string().min(1),
    workCenterId: z.string().min(1),
    jobs: z.array(z.object({
      workOrderId: z.string(),
      operationId: z.string(),
      setupMinutes: z.number().nonnegative(),
      runMinutes: z.number().positive(),
      dueDate: z.string().datetime(),
    })).min(1),
    capacityMinutesPerDay: z.number().positive(),
    startDate: z.string().datetime(),
  }).safeParse(params);

  if (!validation.success) {
    return err({
      code: 'VALIDATION_ERROR',
      message: validation.error.message,
    });
  }

  // Simple forward scheduling
  let currentTime = new Date(params.startDate);
  const scheduledJobs: Array<{
    workOrderId: string;
    operationId: string;
    sequence: number;
    startTime: string;
    endTime: string;
    setupMinutes: number;
    runMinutes: number;
  }> = [];

  let dayMinutesUsed = 0;

  for (let i = 0; i < params.jobs.length; i++) {
    const job = params.jobs[i]!;
    const totalMinutes = job.setupMinutes + job.runMinutes;

    // Check if job fits in remaining day capacity
    if (dayMinutesUsed + totalMinutes > params.capacityMinutesPerDay) {
      // Move to next day
      currentTime = new Date(currentTime);
      currentTime.setDate(currentTime.getDate() + 1);
      currentTime.setHours(8, 0, 0, 0); // Start of workday
      dayMinutesUsed = 0;
    }

    const startTime = new Date(currentTime);
    const endTime = new Date(currentTime.getTime() + totalMinutes * 60000);

    scheduledJobs.push({
      workOrderId: job.workOrderId,
      operationId: job.operationId,
      sequence: i + 1,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      setupMinutes: job.setupMinutes,
      runMinutes: job.runMinutes,
    });

    currentTime = endTime;
    dayMinutesUsed += totalMinutes;
  }

  const totalTime = scheduledJobs.reduce((sum, j) => sum + j.setupMinutes + j.runMinutes, 0);
  const makespan = scheduledJobs.length > 0
    ? new Date(scheduledJobs[scheduledJobs.length - 1]!.endTime).getTime() - new Date(params.startDate).getTime()
    : 0;

  const utilizationPercent = makespan > 0
    ? (totalTime / (makespan / 60000)) * 100
    : 0;

  return ok({
    scheduleId: params.scheduleId,
    workCenterId: params.workCenterId,
    scheduledJobs,
    utilizationPercent: Math.round(utilizationPercent * 100) / 100,
    makespan: makespan / 60000, // Convert to minutes
  });
}

/**
 * Generate dispatch list using priority rules
 */
export async function generateDispatchList(
  db: Database,
  orgId: string,
  params: {
    workCenterId: string;
    sortRule: 'earliest_due_date' | 'shortest_processing_time' | 'critical_ratio';
  },
): Promise<Result<DispatchList>> {
  const validation = z.object({
    workCenterId: z.string().min(1),
    sortRule: z.enum(['earliest_due_date', 'shortest_processing_time', 'critical_ratio']),
  }).safeParse(params);

  if (!validation.success) {
    return err({
      code: 'VALIDATION_ERROR',
      message: validation.error.message,
    });
  }

  // Placeholder: In production, fetch ready jobs from database
  const sampleJobs = [
    {
      workOrderId: 'WO-001',
      operationId: 'OP-10',
      itemId: 'ITEM-A',
      quantity: 100,
      priority: 5,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedDuration: 120,
    },
    {
      workOrderId: 'WO-002',
      operationId: 'OP-20',
      itemId: 'ITEM-B',
      quantity: 50,
      priority: 8,
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedDuration: 60,
    },
    {
      workOrderId: 'WO-003',
      operationId: 'OP-15',
      itemId: 'ITEM-C',
      quantity: 200,
      priority: 3,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedDuration: 180,
    },
  ];

  // Calculate dispatch priority based on rule
  const jobs = sampleJobs.map((job) => {
    let dispatchPriority = 0;

    switch (params.sortRule) {
      case 'earliest_due_date':
        dispatchPriority = new Date(job.dueDate).getTime();
        break;
      case 'shortest_processing_time':
        dispatchPriority = job.estimatedDuration;
        break;
      case 'critical_ratio':
        {
          const timeRemaining = new Date(job.dueDate).getTime() - Date.now();
          const criticalRatio = timeRemaining / (job.estimatedDuration * 60000);
          dispatchPriority = criticalRatio;
        }
        break;
    }

    return { ...job, dispatchPriority };
  });

  // Sort by dispatch priority (ascending for EDD and SPT, ascending for CR too)
  jobs.sort((a, b) => a.dispatchPriority - b.dispatchPriority);

  return ok({
    workCenterId: params.workCenterId,
    generatedAt: new Date().toISOString(),
    jobs,
    sortRule: params.sortRule,
  });
}
