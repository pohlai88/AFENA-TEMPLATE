import { z } from 'zod';
import { createEnumKit, type BaseEnumMetadata } from './_enum-kit';

export const FX_SOURCES = ['manual', 'rate_table', 'system'] as const;
export type FxSource = (typeof FX_SOURCES)[number];
export const fxSourceSchema = z.enum(FX_SOURCES);

export const FX_SOURCE_METADATA = {
    manual: {
        label: 'Manual',
        description: 'Manually entered exchange rate',
        tone: 'neutral',
        sortOrder: 1,
    },
    rate_table: {
        label: 'Rate Table',
        description: 'Rate from configured exchange rate table',
        tone: 'info',
        sortOrder: 2,
    },
    system: {
        label: 'System',
        description: 'System-provided exchange rate',
        tone: 'success',
        sortOrder: 3,
    },
} as const satisfies Record<FxSource, BaseEnumMetadata>;

export const fxSourceKit = createEnumKit(FX_SOURCES, fxSourceSchema, FX_SOURCE_METADATA);

export const {
    isValid: isValidFxSource,
    assert: assertFxSource,
    getLabel: getFxSourceLabel,
    getMeta: getFxSourceMeta,
    labels: FX_SOURCE_LABELS,
} = fxSourceKit;
