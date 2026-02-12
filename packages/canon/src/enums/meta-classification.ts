import { z } from 'zod';

export const META_CLASSIFICATIONS = ['pii', 'financial', 'internal', 'public'] as const;
export type MetaClassification = (typeof META_CLASSIFICATIONS)[number];
export const metaClassificationSchema = z.enum(META_CLASSIFICATIONS);
