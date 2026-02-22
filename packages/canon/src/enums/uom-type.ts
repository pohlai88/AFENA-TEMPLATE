import { z } from 'zod';
import { createEnumKit, type BaseEnumMetadata } from './_enum-kit';

export const UOM_TYPES = ['weight', 'volume', 'length', 'area', 'count', 'time', 'custom'] as const;
export type UomType = (typeof UOM_TYPES)[number];
export const uomTypeSchema = z.enum(UOM_TYPES);

export const UOM_TYPE_METADATA = {
    weight: {
        label: 'Weight',
        description: 'Mass or weight measurement (kg, lb, etc.)',
        tone: 'neutral',
        sortOrder: 1,
    },
    volume: {
        label: 'Volume',
        description: 'Volume or capacity measurement (L, gal, etc.)',
        tone: 'neutral',
        sortOrder: 2,
    },
    length: {
        label: 'Length',
        description: 'Distance or length measurement (m, ft, etc.)',
        tone: 'neutral',
        sortOrder: 3,
    },
    area: {
        label: 'Area',
        description: 'Surface area measurement (m², ft², etc.)',
        tone: 'neutral',
        sortOrder: 4,
    },
    count: {
        label: 'Count',
        description: 'Discrete unit count (pcs, ea, etc.)',
        tone: 'info',
        sortOrder: 5,
    },
    time: {
        label: 'Time',
        description: 'Time duration measurement (hr, day, etc.)',
        tone: 'neutral',
        sortOrder: 6,
    },
    custom: {
        label: 'Custom',
        description: 'Custom unit of measurement',
        tone: 'success',
        sortOrder: 7,
    },
} as const satisfies Record<UomType, BaseEnumMetadata>;

export const uomTypeKit = createEnumKit(UOM_TYPES, uomTypeSchema, UOM_TYPE_METADATA);

export const {
    isValid: isValidUomType,
    assert: assertUomType,
    getLabel: getUomTypeLabel,
    getMeta: getUomTypeMeta,
    labels: UOM_TYPE_LABELS,
} = uomTypeKit;
