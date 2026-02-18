import { z } from 'zod';

export enum ComplianceStatus { COMPLIANT = 'COMPLIANT', NON_COMPLIANT = 'NON_COMPLIANT' }
export enum TransferStatus { PENDING = 'PENDING', APPROVED = 'APPROVED', DENIED = 'DENIED' }

export const fddVersionSchema = z.object({
  id: z.string().uuid(),
  version: z.number(),
  effectiveDate: z.coerce.date(),
  changes: z.array(z.string()),
});

export type FDDVersion = z.infer<typeof fddVersionSchema>;
export interface ComplianceMetrics {
  totalUnits: number;
  compliantUnits: number;
  pendingTransfers: number;
  expiringTerms: number;
}
