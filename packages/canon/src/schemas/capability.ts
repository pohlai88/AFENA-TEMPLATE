import { z } from 'zod';

import {
    CAPABILITY_DOMAINS,
    CAPABILITY_KINDS,
    CAPABILITY_NAMESPACES,
    RBAC_SCOPES,
    RBAC_TIERS,
} from '../types/capability';

// ── Capability Descriptor Schema ────────────────────────────

export const capabilityKindSchema = z.enum(CAPABILITY_KINDS);

export const capabilityStatusSchema = z.enum([
  'planned',
  'active',
  'deprecated',
]);

export const capabilityScopeSchema = z.enum([
  'org',
  'company',
  'site',
  'global',
]);

export const capabilityRiskSchema = z.enum([
  'financial',
  'pii',
  'audit',
  'irreversible',
]);

export const rbacTierSchema = z.enum(RBAC_TIERS);

export const rbacScopeSchema = z.enum(RBAC_SCOPES);

export const capabilityDescriptorSchema = z.object({
  key: z.string().min(3),
  intent: z.string().min(1),
  kind: capabilityKindSchema.optional(),
  scope: capabilityScopeSchema,
  status: capabilityStatusSchema,
  entities: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  headlessOnly: z.boolean().optional(),
  requires: z.array(z.string()).optional(),
  produces: z.array(z.string()).optional(),
  risks: z.array(capabilityRiskSchema).optional(),
  rbacTier: rbacTierSchema.optional(),
  rbacScope: rbacScopeSchema.optional(),
});

// ── Exception Scope Schema ──────────────────────────────────

export const exceptionScopeSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('repo') }),
  z.object({ kind: z.literal('package'), package: z.string().min(1) }),
  z.object({ kind: z.literal('file'), file: z.string().min(1) }),
]);

export type ExceptionScope = z.infer<typeof exceptionScopeSchema>;

// ── Capability Exception Schema ─────────────────────────────

export const capabilityExceptionSchema = z.object({
  id: z.string().min(1),
  key: z.string().min(3),
  rule: z.string().min(1),
  scope: exceptionScopeSchema,
  reason: z.string().min(1),
  owner: z.string().min(1),
  createdAt: z.iso.date({ error: 'Must be YYYY-MM-DD' }),
  lastReviewedOn: z.iso.date({ error: 'Must be YYYY-MM-DD' }).optional(),
  reviewEveryDays: z.number().int().positive(),
  expiresOn: z.iso.date({ error: 'Must be YYYY-MM-DD' }),
});

export type CapabilityException = z.infer<typeof capabilityExceptionSchema>;

export const capabilityExceptionsFileSchema = z.object({
  exceptions: z.array(capabilityExceptionSchema),
});

// ── Domain & Namespace Schemas ──────────────────────────────

export const capabilityDomainSchema = z.enum(CAPABILITY_DOMAINS);

export const capabilityNamespaceSchema = z.enum(CAPABILITY_NAMESPACES);
