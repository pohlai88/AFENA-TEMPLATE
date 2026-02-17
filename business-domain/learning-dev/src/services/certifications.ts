import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

export const AwardCertificationParams = z.object({
  employeeId: z.string(),
  certificationName: z.string(),
  issuedDate: z.date(),
  expiryDate: z.date().optional(),
  issuingAuthority: z.string(),
});

export interface CertificationAward {
  certificationId: string;
  employeeId: string;
  certificationName: string;
  issuedDate: Date;
  expiryDate: Date | null;
  status: 'active' | 'expired';
}

export async function awardCertification(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof AwardCertificationParams>,
): Promise<Result<CertificationAward>> {
  const validated = AwardCertificationParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  return ok({ certificationId: 'cert-1', employeeId: validated.data.employeeId, certificationName: validated.data.certificationName, issuedDate: validated.data.issuedDate, expiryDate: validated.data.expiryDate || null, status: 'active' });
}

export const TrackCertificationExpiryParams = z.object({
  daysAhead: z.number().default(90),
  certificationTypes: z.array(z.string()).optional(),
});

export interface ExpiringCertification {
  certificationId: string;
  employeeId: string;
  employeeName: string;
  certificationName: string;
  expiryDate: Date;
  daysRemaining: number;
}

export async function trackCertificationExpiry(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof TrackCertificationExpiryParams>,
): Promise<Result<ExpiringCertification[]>> {
  const validated = TrackCertificationExpiryParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 60);
  
  return ok([{ certificationId: 'cert-1', employeeId: 'emp-1', employeeName: 'John Doe', certificationName: 'PMP', expiryDate, daysRemaining: 60 }]);
}
