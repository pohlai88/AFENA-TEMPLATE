import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

export const GenerateProjectInvoiceParams = z.object({
  projectId: z.string(),
  billingPeriodStart: z.date(),
  billingPeriodEnd: z.date(),
  billingType: z.enum(['fixed-price', 'time-materials', 'cost-plus', 'milestone']),
  lineItems: z.array(z.object({ description: z.string(), amountMinor: z.number() })).optional(),
});

export interface ProjectInvoice {
  invoiceId: string;
  projectId: string;
  invoiceNumber: string;
  totalAmountMinor: number;
  status: 'draft' | 'sent' | 'paid';
  dueDate: Date;
}

export async function generateProjectInvoice(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof GenerateProjectInvoiceParams>,
): Promise<Result<ProjectInvoice>> {
  const validated = GenerateProjectInvoiceParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  const totalAmountMinor = validated.data.lineItems?.reduce((sum, item) => sum + item.amountMinor, 0) || 5000000;
  const dueDate = new Date(validated.data.billingPeriodEnd);
  dueDate.setDate(dueDate.getDate() + 30);
  
  return ok({ invoiceId: 'inv-proj-1', projectId: validated.data.projectId, invoiceNumber: 'PI-2026-001', totalAmountMinor, status: 'draft', dueDate });
}

export const RecognizeRevenueParams = z.object({
  projectId: z.string(),
  fiscalPeriodId: z.string(),
  method: z.enum(['percentage-completion', 'completed-contract', 'milestone']),
  completionPercentage: z.number().min(0).max(100).optional(),
});

export interface RevenueRecognition {
  recognitionId: string;
  projectId: string;
  recognizedRevenueMinor: number;
  method: string;
  fiscalPeriodId: string;
}

export async function recognizeRevenue(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof RecognizeRevenueParams>,
): Promise<Result<RevenueRecognition>> {
  const validated = RecognizeRevenueParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  const totalContractMinor = 10000000;
  const recognizedRevenueMinor = validated.data.method === 'percentage-completion' ? totalContractMinor * ((validated.data.completionPercentage || 0) / 100) : totalContractMinor;
  
  return ok({ recognitionId: 'rev-rec-1', projectId: validated.data.projectId, recognizedRevenueMinor, method: validated.data.method, fiscalPeriodId: validated.data.fiscalPeriodId });
}
