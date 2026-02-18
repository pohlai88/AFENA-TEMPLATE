/**
 * Group Purchasing Types
 */

import { z } from 'zod';

export enum AgreementStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  PENDING = 'PENDING',
}

export const purchaseAgreementSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  supplierId: z.string().uuid(),
  supplierName: z.string(),
  agreementNumber: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  totalCommitment: z.number().positive(),
  status: z.nativeEnum(AgreementStatus),
  createdAt: z.coerce.date(),
});

export const volumeDiscountSchema = z.object({
  id: z.string().uuid(),
  agreementId: z.string().uuid(),
  minVolume: z.number().min(0),
maxVolume: z.number().positive().optional(),
  discountPercent: z.number().min(0).max(100),
});

export type PurchaseAgreement = z.infer<typeof purchaseAgreementSchema>;
export type VolumeDiscount = z.infer<typeof volumeDiscountSchema>;

export interface ConsolidatedSpend {
  supplierId: string;
  supplierName: string;
  totalSpend: number;
  participatingEntities: number;
  potentialSavings: number;
}
