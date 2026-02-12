import { z } from 'zod';

export const VIEW_TYPES = ['table', 'form', 'kanban', 'detail'] as const;
export type ViewType = (typeof VIEW_TYPES)[number];
export const viewTypeSchema = z.enum(VIEW_TYPES);
