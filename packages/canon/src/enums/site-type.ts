import { z } from 'zod';
import { createEnumKit, type BaseEnumMetadata } from './_enum-kit';

export const SITE_TYPES = ['warehouse', 'branch', 'plant', 'office'] as const;
export type SiteType = (typeof SITE_TYPES)[number];
export const siteTypeSchema = z.enum(SITE_TYPES);

export const SITE_TYPE_METADATA = {
    warehouse: {
        label: 'Warehouse',
        description: 'Storage and distribution facility',
        tone: 'neutral',
        sortOrder: 1,
    },
    branch: {
        label: 'Branch',
        description: 'Branch office or retail location',
        tone: 'info',
        sortOrder: 2,
    },
    plant: {
        label: 'Plant',
        description: 'Manufacturing or production facility',
        tone: 'success',
        sortOrder: 3,
    },
    office: {
        label: 'Office',
        description: 'Administrative office location',
        tone: 'neutral',
        sortOrder: 4,
    },
} as const satisfies Record<SiteType, BaseEnumMetadata>;

export const siteTypeKit = createEnumKit(SITE_TYPES, siteTypeSchema, SITE_TYPE_METADATA);

export const {
    isValid: isValidSiteType,
    assert: assertSiteType,
    getLabel: getSiteTypeLabel,
    getMeta: getSiteTypeMeta,
    labels: SITE_TYPE_LABELS,
} = siteTypeKit;
