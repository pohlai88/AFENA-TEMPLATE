import { z } from 'zod';
import { createEnumKit, type BaseEnumMetadata } from './_enum-kit';

export const STORAGE_MODES = ['jsonb_only', 'indexed'] as const;
export type StorageMode = (typeof STORAGE_MODES)[number];
export const storageModeSchema = z.enum(STORAGE_MODES);

export const STORAGE_MODE_METADATA = {
    jsonb_only: {
        label: 'JSONB Only',
        description: 'Store value only in JSONB without dedicated columns',
        tone: 'neutral',
        sortOrder: 1,
    },
    indexed: {
        label: 'Indexed',
        description: 'Store with dedicated indexed columns for querying',
        tone: 'info',
        sortOrder: 2,
    },
} as const satisfies Record<StorageMode, BaseEnumMetadata>;

export const storageModeKit = createEnumKit(
    STORAGE_MODES,
    storageModeSchema,
    STORAGE_MODE_METADATA
);

export const {
    isValid: isValidStorageMode,
    assert: assertStorageMode,
    getLabel: getStorageModeLabel,
    getMeta: getStorageModeMeta,
    labels: STORAGE_MODE_LABELS,
} = storageModeKit;
