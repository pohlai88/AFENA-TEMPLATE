import { z } from 'zod';
import { createEnumKit, type BaseEnumMetadata } from './_enum-kit';

export const META_CLASSIFICATIONS = ['pii', 'financial', 'internal', 'public'] as const;
export type MetaClassification = (typeof META_CLASSIFICATIONS)[number];
export const metaClassificationSchema = z.enum(META_CLASSIFICATIONS);

export const META_CLASSIFICATION_METADATA = {
    pii: {
        label: 'PII',
        description: 'Personally Identifiable Information requiring special protection',
        tone: 'danger',
        sortOrder: 1,
    },
    financial: {
        label: 'Financial',
        description: 'Financial data requiring secure handling',
        tone: 'warning',
        sortOrder: 2,
    },
    internal: {
        label: 'Internal',
        description: 'Internal company data not for public disclosure',
        tone: 'info',
        sortOrder: 3,
    },
    public: {
        label: 'Public',
        description: 'Publicly accessible information',
        tone: 'neutral',
        sortOrder: 4,
    },
} as const satisfies Record<MetaClassification, BaseEnumMetadata>;

export const metaClassificationKit = createEnumKit(
    META_CLASSIFICATIONS,
    metaClassificationSchema,
    META_CLASSIFICATION_METADATA
);

export const {
    isValid: isValidMetaClassification,
    assert: assertMetaClassification,
    getLabel: getMetaClassificationLabel,
    getMeta: getMetaClassificationMeta,
    labels: META_CLASSIFICATION_LABELS,
} = metaClassificationKit;
