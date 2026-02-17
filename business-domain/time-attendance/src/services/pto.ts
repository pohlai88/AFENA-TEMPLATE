import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

export const RequestPTOParams = z.object({
  employeeId: z.string(),
  ptoType: z.enum(['vacation', 'sick', 'personal', 'bereavement']),
  startDate: z.date(),
  endDate: z.date(),
  hoursRequested: z.number(),
});

export interface PTORequest {
  requestId: string;
  employeeId: string;
  ptoType: string;
  hoursRequested: number;
  status: 'pending' | 'approved' | 'denied';
  remainingBalance: number;
}

export async function requestPTO(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof RequestPTOParams>,
): Promise<Result<PTORequest>> {
  const validated = RequestPTOParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  return ok({ requestId: 'pto-1', employeeId: validated.data.employeeId, ptoType: validated.data.ptoType, hoursRequested: validated.data.hoursRequested, status: 'pending', remainingBalance: 80 });
}

export const ApprovePTOParams = z.object({
  requestId: z.string(),
  approvedBy: z.string(),
  decision: z.enum(['approve', 'deny']),
  denialReason: z.string().optional(),
});

export interface PTOApproval {
  requestId: string;
  decision: string;
  approvedBy: string;
  processedAt: Date;
}

export async function approvePTO(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof ApprovePTOParams>,
): Promise<Result<PTOApproval>> {
  const validated = ApprovePTOParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  return ok({ requestId: validated.data.requestId, decision: validated.data.decision, approvedBy: validated.data.approvedBy, processedAt: new Date() });
}
