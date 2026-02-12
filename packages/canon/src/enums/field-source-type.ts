import { z } from 'zod';

export const FIELD_SOURCE_TYPES = ['core', 'module', 'custom'] as const;
export type FieldSourceType = (typeof FIELD_SOURCE_TYPES)[number];
export const fieldSourceTypeSchema = z.enum(FIELD_SOURCE_TYPES);
