import { z } from 'zod';

export enum LabelFormat { DRAFT = 'DRAFT', ACTIVE = 'ACTIVE' }
export enum AllergenStatus { PENDING = 'PENDING', APPROVED = 'APPROVED' }

export const primarySchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  status: z.string(),
  createdAt: z.coerce.date(),
});

export type NutritionLabel = z.infer<typeof primarySchema>;
export type Ingredient = { summary: string };
