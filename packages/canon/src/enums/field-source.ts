import { z } from 'zod';

export const FIELD_SOURCES = ['user', 'rule', 'import', 'system'] as const;
export type FieldSource = (typeof FIELD_SOURCES)[number];
export const fieldSourceSchema = z.enum(FIELD_SOURCES);
