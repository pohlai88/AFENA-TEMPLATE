import { z } from 'zod';
import { createEnumKit, type BaseEnumMetadata } from './_enum-kit';

export const VIEW_TYPES = ['table', 'form', 'kanban', 'detail'] as const;
export type ViewType = (typeof VIEW_TYPES)[number];
export const viewTypeSchema = z.enum(VIEW_TYPES);

export const VIEW_TYPE_METADATA = {
    table: {
        label: 'Table',
        description: 'Tabular list view with columns',
        tone: 'neutral',
        sortOrder: 1,
    },
    form: {
        label: 'Form',
        description: 'Form view for data entry',
        tone: 'info',
        sortOrder: 2,
    },
    kanban: {
        label: 'Kanban',
        description: 'Kanban board with cards',
        tone: 'success',
        sortOrder: 3,
    },
    detail: {
        label: 'Detail',
        description: 'Detailed single-record view',
        tone: 'info',
        sortOrder: 4,
    },
} as const satisfies Record<ViewType, BaseEnumMetadata>;

export const viewTypeKit = createEnumKit(VIEW_TYPES, viewTypeSchema, VIEW_TYPE_METADATA);

export const {
    isValid: isValidViewType,
    assert: assertViewType,
    getLabel: getViewTypeLabel,
    getMeta: getViewTypeMeta,
    labels: VIEW_TYPE_LABELS,
} = viewTypeKit;
