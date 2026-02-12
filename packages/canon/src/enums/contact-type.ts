import { z } from 'zod';

export const CONTACT_TYPES = ['customer', 'supplier', 'lead', 'employee', 'other'] as const;
export type ContactType = (typeof CONTACT_TYPES)[number];
export const contactTypeSchema = z.enum(CONTACT_TYPES);
