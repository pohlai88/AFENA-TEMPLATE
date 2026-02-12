import { z } from 'zod';

export const META_QUALITY_TIERS = ['gold', 'silver', 'bronze'] as const;
export type MetaQualityTier = (typeof META_QUALITY_TIERS)[number];
export const metaQualityTierSchema = z.enum(META_QUALITY_TIERS);
