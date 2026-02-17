import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

export const ScheduleShiftParams = z.object({
  employeeId: z.string(),
  shiftDate: z.date(),
  startTime: z.string(),
  endTime: z.string(),
  locationId: z.string().optional(),
});

export interface ShiftSchedule {
  shiftId: string;
  employeeId: string;
  shiftDate: Date;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'completed';
}

export async function scheduleShift(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof ScheduleShiftParams>,
): Promise<Result<ShiftSchedule>> {
  const validated = ScheduleShiftParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  return ok({ shiftId: 'shift-1', employeeId: validated.data.employeeId, shiftDate: validated.data.shiftDate, duration: 8, status: 'scheduled' });
}

export const SwapShiftParams = z.object({
  originalShiftId: z.string(),
  requestingEmployeeId: z.string(),
  coveringEmployeeId: z.string(),
  reason: z.string().optional(),
});

export interface ShiftSwap {
  swapId: string;
  originalShiftId: string;
  coveringEmployeeId: string;
  status: 'pending' | 'approved' | 'denied';
  processedAt: Date;
}

export async function swapShift(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof SwapShiftParams>,
): Promise<Result<ShiftSwap>> {
  const validated = SwapShiftParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  return ok({ swapId: 'swap-1', originalShiftId: validated.data.originalShiftId, coveringEmployeeId: validated.data.coveringEmployeeId, status: 'pending', processedAt: new Date() });
}
