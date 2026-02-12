import { z } from 'zod';

export const DOC_STATUSES = ['draft', 'submitted', 'active', 'cancelled', 'amended'] as const;
export type DocStatus = (typeof DOC_STATUSES)[number];
export const docStatusSchema = z.enum(DOC_STATUSES);
