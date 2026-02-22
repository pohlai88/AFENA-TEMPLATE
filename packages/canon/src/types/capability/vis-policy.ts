/**
 * VIS Policy (Visibility/Enforcement Policy)
 * 
 * Phase-aware enforcement policy for capability visibility.
 */

import type { CapabilityKind } from './kinds';

/** Phase-aware enforcement policy. Bump `phase` + update `uiSeverity` when ready. */
export const VIS_POLICY = {
  phase: 3,
  rules: {
    mutation: {
      kernelRequired: true,
      appRequired: true,
      uiSeverity: 'error',
    },
    read: {
      kernelRequired: false,
      appRequired: true,
      uiSeverity: 'error',
    },
    search: {
      kernelRequired: false,
      appRequired: true,
      uiSeverity: 'error',
    },
    admin: {
      kernelRequired: false,
      appRequired: true,
      uiSeverity: 'error',
    },
    system: {
      kernelRequired: false,
      appRequired: true,
      uiSeverity: 'error',
    },
    auth: {
      kernelRequired: false,
      appRequired: true,
      uiSeverity: 'error',
    },
    storage: {
      kernelRequired: false,
      appRequired: true,
      uiSeverity: 'error',
    },
  },
} as const satisfies {
  phase: number;
  rules: Record<CapabilityKind, {
    kernelRequired: boolean;
    appRequired: boolean;
    uiSeverity: string;
  }>;
};

export type VisPolicy = typeof VIS_POLICY;
