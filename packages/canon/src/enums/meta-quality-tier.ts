import { z } from 'zod';
import { createEnumKit, type BaseEnumMetadata } from './_enum-kit';

export const META_QUALITY_TIERS = ['gold', 'silver', 'bronze'] as const;
export type MetaQualityTier = (typeof META_QUALITY_TIERS)[number];
export const metaQualityTierSchema = z.enum(META_QUALITY_TIERS);

export const META_QUALITY_TIER_METADATA = {
    gold: {
        label: 'Gold',
        description: 'Highest quality tier with complete documentation and testing',
        tone: 'success',
        sortOrder: 1,
    },
    silver: {
        label: 'Silver',
        description: 'Good quality tier with adequate documentation',
        tone: 'info',
        sortOrder: 2,
    },
    bronze: {
        label: 'Bronze',
        description: 'Basic quality tier with minimal documentation',
        tone: 'warning',
        sortOrder: 3,
    },
} as const satisfies Record<MetaQualityTier, BaseEnumMetadata>;

export const metaQualityTierKit = createEnumKit(
    META_QUALITY_TIERS,
    metaQualityTierSchema,
    META_QUALITY_TIER_METADATA
);

export const {
    isValid: isValidMetaQualityTier,
    assert: assertMetaQualityTier,
    getLabel: getMetaQualityTierLabel,
    getMeta: getMetaQualityTierMeta,
    labels: META_QUALITY_TIER_LABELS,
} = metaQualityTierKit;
