import { z } from 'zod';
import { createEnumKit, createSubset, type BaseEnumMetadata } from './_enum-kit';

export const CONTACT_TYPES = ['customer', 'supplier', 'lead', 'employee', 'other'] as const;
export type ContactType = (typeof CONTACT_TYPES)[number];
export const contactTypeSchema = z.enum(CONTACT_TYPES);

export const CONTACT_TYPE_METADATA = {
    customer: {
        label: 'Customer',
        description: 'Customer contact',
        tone: 'success',
        sortOrder: 1,
    },
    supplier: {
        label: 'Supplier',
        description: 'Supplier contact',
        tone: 'info',
        sortOrder: 2,
    },
    lead: {
        label: 'Lead',
        description: 'Prospective customer',
        tone: 'warning',
        sortOrder: 3,
    },
    employee: {
        label: 'Employee',
        description: 'Internal employee contact',
        tone: 'neutral',
        sortOrder: 4,
    },
    other: {
        label: 'Other',
        description: 'Other contact type',
        tone: 'neutral',
        sortOrder: 5,
    },
} as const satisfies Record<ContactType, BaseEnumMetadata>;

export const contactTypeKit = createEnumKit(CONTACT_TYPES, contactTypeSchema, CONTACT_TYPE_METADATA);

export const {
    isValid: isValidContactType,
    assert: assertContactType,
    getLabel: getContactTypeLabel,
    getMeta: getContactTypeMeta,
    labels: CONTACT_TYPE_LABELS,
} = contactTypeKit;

export const BUSINESS_CONTACT_TYPES = createSubset(['customer', 'supplier'] as const);
export const INTERNAL_CONTACT_TYPES = createSubset(['employee'] as const);
export const PROSPECT_CONTACT_TYPES = createSubset(['lead'] as const);

export const isBusinessContact = (t: ContactType) => BUSINESS_CONTACT_TYPES.has(t);
export const isInternalContact = (t: ContactType) => INTERNAL_CONTACT_TYPES.has(t);
export const isProspectContact = (t: ContactType) => PROSPECT_CONTACT_TYPES.has(t);
