import { z } from 'zod';

export const AUTH_SCOPES = ['org', 'self', 'company', 'site', 'team'] as const;
export type AuthScope = (typeof AUTH_SCOPES)[number];
export const authScopeSchema = z.enum(AUTH_SCOPES);
