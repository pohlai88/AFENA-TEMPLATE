import { z } from 'zod';
import { createEnumKit, type BaseEnumMetadata } from './_enum-kit';

export const FIELD_SOURCES = ['user', 'rule', 'import', 'system'] as const;
export type FieldSource = (typeof FIELD_SOURCES)[number];
export const fieldSourceSchema = z.enum(FIELD_SOURCES);

export const FIELD_SOURCE_METADATA = {
    user: {
        label: 'User',
        description: 'Manually entered by user',
        tone: 'success',
        sortOrder: 1,
    },
    rule: {
        label: 'Rule',
        description: 'Calculated by business rule',
        tone: 'info',
        sortOrder: 2,
    },
    import: {
        label: 'Import',
        description: 'Imported from external source',
        tone: 'warning',
        sortOrder: 3,
    },
    system: {
        label: 'System',
        description: 'System-generated value',
        tone: 'neutral',
        sortOrder: 4,
    },
} as const satisfies Record<FieldSource, BaseEnumMetadata>;

export const fieldSourceKit = createEnumKit(FIELD_SOURCES, fieldSourceSchema, FIELD_SOURCE_METADATA);

export const {
    isValid: isValidFieldSource,
    assert: assertFieldSource,
    getLabel: getFieldSourceLabel,
    getMeta: getFieldSourceMeta,
    labels: FIELD_SOURCE_LABELS,
} = fieldSourceKit;
