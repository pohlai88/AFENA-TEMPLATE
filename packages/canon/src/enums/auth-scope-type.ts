import { z } from 'zod';

export const AUTH_SCOPE_TYPES = ['company', 'site', 'team'] as const;
export type AuthScopeType = (typeof AUTH_SCOPE_TYPES)[number];
export const authScopeTypeSchema = z.enum(AUTH_SCOPE_TYPES);
