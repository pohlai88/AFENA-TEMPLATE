/**
 * Certifications
 * 
 * Certificate of Analysis and regulatory compliance verification.
 */

import type { Result } from 'afenda-canon';
import { err, ok } from 'afenda-canon';
import type { Database } from 'afenda-database';
import { z } from 'zod';

export const CertificateOfAnalysisSchema = z.object({
  coaId: z.string(),
  itemId: z.string(),
  lotNumber: z.string(),
  manufactureDate: z.string(),
  expirationDate: z.string().optional(),
  tests: z.array(z.object({
    testId: z.string(),
    parameter: z.string(),
    method: z.string(),
    specification: z.string(),
    result: z.string(),
    units: z.string(),
    pass: z.boolean(),
  })),
  approvedBy: z.string(),
  approvedAt: z.string(),
  certificateNumber: z.string(),
});

export type CertificateOfAnalysis = z.infer<typeof CertificateOfAnalysisSchema>;

export const CertificationVerificationSchema = z.object({
  verificationId: z.string(),
  certificationType: z.enum(['iso_9001', 'iso_14001', 'iso_45001', 'fda', 'ce', 'ul', 'other']),
  supplierId: z.string(),
  certificateNumber: z.string(),
  issuingBody: z.string(),
  issueDate: z.string(),
  expirationDate: z.string(),
  verified: z.boolean(),
  verifiedBy: z.string(),
  verifiedAt: z.string(),
  notes: z.string().optional(),
});

export type CertificationVerification = z.infer<typeof CertificationVerificationSchema>;

/**
 * Generate Certificate of Analysis
 */
export async function generateCOA(
  db: Database,
  orgId: string,
  params: {
    coaId: string;
    itemId: string;
    lotNumber: string;
    manufactureDate: string;
    expirationDate?: string;
    tests: Array<{
      testId: string;
      parameter: string;
      method: string;
      specification: string;
      result: string;
      units: string;
      pass: boolean;
    }>;
    approvedBy: string;
  },
): Promise<Result<CertificateOfAnalysis>> {
  const validation = z.object({
    coaId: z.string().min(1),
    itemId: z.string().min(1),
    lotNumber: z.string().min(1),
    manufactureDate: z.string().datetime(),
    expirationDate: z.string().datetime().optional(),
    tests: z.array(z.object({
      testId: z.string(),
      parameter: z.string(),
      method: z.string(),
      specification: z.string(),
      result: z.string(),
      units: z.string(),
      pass: z.boolean(),
    })).min(1),
    approvedBy: z.string().min(1),
  }).safeParse(params);

  if (!validation.success) {
    return err({
      code: 'VALIDATION_ERROR',
      message: validation.error.message,
    });
  }

  // Verify all tests passed
  const failedTests = params.tests.filter((t) => !t.pass);
  if (failedTests.length > 0) {
    return err({
      code: 'VALIDATION_ERROR',
      message: `Cannot issue COA: ${failedTests.length} test(s) failed`,
    });
  }

  // Generate certificate number
  const timestamp = Date.now().toString(36).toUpperCase();
  const certificateNumber = `COA-${params.lotNumber}-${timestamp}`;

  // Placeholder: In production, insert into coa table, generate PDF
  return ok({
    coaId: params.coaId,
    itemId: params.itemId,
    lotNumber: params.lotNumber,
    manufactureDate: params.manufactureDate,
    expirationDate: params.expirationDate,
    tests: params.tests,
    approvedBy: params.approvedBy,
    approvedAt: new Date().toISOString(),
    certificateNumber,
  });
}

/**
 * Verify supplier certification
 */
export async function verifyCertification(
  db: Database,
  orgId: string,
  params: {
    verificationId: string;
    certificationType: 'iso_9001' | 'iso_14001' | 'iso_45001' | 'fda' | 'ce' | 'ul' | 'other';
    supplierId: string;
    certificateNumber: string;
    issuingBody: string;
    issueDate: string;
    expirationDate: string;
    verifiedBy: string;
    notes?: string;
  },
): Promise<Result<CertificationVerification>> {
  const validation = z.object({
    verificationId: z.string().min(1),
    certificationType: z.enum(['iso_9001', 'iso_14001', 'iso_45001', 'fda', 'ce', 'ul', 'other']),
    supplierId: z.string().min(1),
    certificateNumber: z.string().min(1),
    issuingBody: z.string().min(1),
    issueDate: z.string().datetime(),
    expirationDate: z.string().datetime(),
    verifiedBy: z.string().min(1),
    notes: z.string().optional(),
  }).safeParse(params);

  if (!validation.success) {
    return err({
      code: 'VALIDATION_ERROR',
      message: validation.error.message,
    });
  }

  // Check if certification is current
  const now = new Date();
  const expiration = new Date(params.expirationDate);
  const verified = expiration > now;

  if (!verified && !params.notes) {
    return err({
      code: 'VALIDATION_ERROR',
      message: 'Notes required for expired certifications',
    });
  }

  // Placeholder: In production, store verification record, trigger alerts if expired
  return ok({
    verificationId: params.verificationId,
    certificationType: params.certificationType,
    supplierId: params.supplierId,
    certificateNumber: params.certificateNumber,
    issuingBody: params.issuingBody,
    issueDate: params.issueDate,
    expirationDate: params.expirationDate,
    verified,
    verifiedBy: params.verifiedBy,
    verifiedAt: new Date().toISOString(),
    notes: params.notes,
  });
}
