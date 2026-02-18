/**
 * Entity Contract Registry
 *
 * Registry of entity contracts defining valid states and transitions.
 * Supports partial entries in v1 (Phase 2 adds mandatory coverage).
 *
 * Used by audit and compliance services to track entity lifecycle and permissions.
 */

import type { EntityType } from '../types/entity';
import type { EntityContract } from '../types/entity-contract';

/**
 * Registry of entity contracts
 * v1: Partial coverage (some entities defined, others deferred)
 * v2: Mandatory coverage for all EntityTypes
 *
 * Register Invariant (R1): Every key that exists must be a valid EntityContract;
 * missing keys are allowed in v1.
 */
export const ENTITY_CONTRACT_REGISTRY: Partial<Record<EntityType, EntityContract>> = {
  companies: {
    entityType: 'companies',
    label: 'Company',
    labelPlural: 'Companies',
    hasLifecycle: true,
    hasSoftDelete: true,
    transitions: [
      {
        from: 'draft',
        allowed: ['update', 'submit', 'delete'],
      },
      {
        from: 'submitted',
        allowed: ['approve', 'reject', 'cancel'],
      },
      {
        from: 'active',
        allowed: ['update', 'cancel'],
      },
      {
        from: 'cancelled',
        allowed: ['restore'],
      },
      {
        from: 'amended',
        allowed: ['update', 'submit'],
      },
    ],
    updateModes: ['edit', 'correct', 'amend'],
    reasonRequired: ['delete', 'cancel', 'reject'],
    workflowDecisions: ['approve', 'reject'],
    primaryVerbs: ['create', 'update', 'submit'],
    secondaryVerbs: ['delete', 'cancel', 'restore'],
  },
} satisfies Partial<Record<EntityType, EntityContract>>;
