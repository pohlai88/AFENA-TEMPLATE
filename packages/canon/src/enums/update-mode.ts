import { z } from 'zod';
import { createEnumKit, type BaseEnumMetadata } from './_enum-kit';

export const UPDATE_MODES = ['edit', 'correct', 'amend', 'adjust', 'reassign'] as const;
export type UpdateMode = (typeof UPDATE_MODES)[number];
export const updateModeSchema = z.enum(UPDATE_MODES);

export const UPDATE_MODE_METADATA = {
    edit: {
        label: 'Edit',
        description: 'Standard edit of draft record',
        tone: 'neutral',
        sortOrder: 1,
    },
    correct: {
        label: 'Correct',
        description: 'Correction of error in submitted record',
        tone: 'warning',
        sortOrder: 2,
    },
    amend: {
        label: 'Amend',
        description: 'Amendment creating new version',
        tone: 'info',
        sortOrder: 3,
    },
    adjust: {
        label: 'Adjust',
        description: 'Adjustment of values',
        tone: 'neutral',
        sortOrder: 4,
    },
    reassign: {
        label: 'Reassign',
        description: 'Reassignment to different owner',
        tone: 'info',
        sortOrder: 5,
    },
} as const satisfies Record<UpdateMode, BaseEnumMetadata>;

export const updateModeKit = createEnumKit(UPDATE_MODES, updateModeSchema, UPDATE_MODE_METADATA);

export const {
    isValid: isValidUpdateMode,
    assert: assertUpdateMode,
    getLabel: getUpdateModeLabel,
    getMeta: getUpdateModeMeta,
    labels: UPDATE_MODE_LABELS,
} = updateModeKit;
