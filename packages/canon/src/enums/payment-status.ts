import { z } from 'zod';

export const PAYMENT_STATUSES = ['unpaid', 'partial', 'paid', 'overpaid', 'refunded'] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
export const paymentStatusSchema = z.enum(PAYMENT_STATUSES);
