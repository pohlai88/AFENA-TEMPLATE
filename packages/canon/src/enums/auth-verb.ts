import { z } from 'zod';

export const AUTH_VERBS = ['create', 'update', 'delete', 'submit', 'cancel', 'amend', 'approve', 'reject', 'restore'] as const;
export type AuthVerb = (typeof AUTH_VERBS)[number];
export const authVerbSchema = z.enum(AUTH_VERBS);
