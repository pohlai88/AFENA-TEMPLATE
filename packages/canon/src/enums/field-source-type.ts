import { z } from 'zod';
import { createEnumKit, type BaseEnumMetadata } from './_enum-kit';

export const FIELD_SOURCE_TYPES = ['core', 'module', 'custom'] as const;
export type FieldSourceType = (typeof FIELD_SOURCE_TYPES)[number];
export const fieldSourceTypeSchema = z.enum(FIELD_SOURCE_TYPES);

export const FIELD_SOURCE_TYPE_METADATA = {
    core: {
        label: 'Core',
        description: 'Built-in system field',
        tone: 'info',
        sortOrder: 1,
    },
    module: {
        label: 'Module',
        description: 'Field provided by a module',
        tone: 'neutral',
        sortOrder: 2,
    },
    custom: {
        label: 'Custom',
        description: 'User-defined custom field',
        tone: 'success',
        sortOrder: 3,
    },
} as const satisfies Record<FieldSourceType, BaseEnumMetadata>;

export const fieldSourceTypeKit = createEnumKit(
    FIELD_SOURCE_TYPES,
    fieldSourceTypeSchema,
    FIELD_SOURCE_TYPE_METADATA
);

export const {
    isValid: isValidFieldSourceType,
    assert: assertFieldSourceType,
    getLabel: getFieldSourceTypeLabel,
    getMeta: getFieldSourceTypeMeta,
    labels: FIELD_SOURCE_TYPE_LABELS,
} = fieldSourceTypeKit;
