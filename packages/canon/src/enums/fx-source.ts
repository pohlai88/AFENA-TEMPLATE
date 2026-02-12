import { z } from 'zod';

export const FX_SOURCES = ['manual', 'rate_table', 'system'] as const;
export type FxSource = (typeof FX_SOURCES)[number];
export const fxSourceSchema = z.enum(FX_SOURCES);
