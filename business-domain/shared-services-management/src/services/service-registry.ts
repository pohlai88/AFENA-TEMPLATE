/**
 * Service Registry Service
 * 
 * Manage shared services catalog and allocation rules
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { z } from 'zod';
import type { AllocationRule, SharedService } from '../types/common.js';
import { allocationRuleSchema, sharedServiceSchema } from '../types/common.js';

// ── Schemas ────────────────────────────────────────────────────────

export const createServiceSchema = sharedServiceSchema.omit({ id: true, createdAt: true, updatedAt: true });

export const createRuleSchema = allocationRuleSchema.omit({ id: true });

// ── Types ──────────────────────────────────────────────────────────

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type CreateRuleInput = z.infer<typeof createRuleSchema>;

// ── Functions ──────────────────────────────────────────────────────

/**
 * Create shared service
 */
export async function createSharedService(
  db: NeonHttpDatabase,
  orgId: string,
  input: CreateServiceInput,
): Promise<SharedService> {
  const validated = createServiceSchema.parse(input);

  // TODO: Implement database logic

  throw new Error('Not implemented');
}

/**
 * Create allocation rule
 */
export async function createAllocationRule(
  db: NeonHttpDatabase,
  orgId: string,
  input: CreateRuleInput,
): Promise<AllocationRule> {
  const validated = createRuleSchema.parse(input);

  // TODO: Implement database logic

  throw new Error('Not implemented');
}

/**
 * Get all shared services
 */
export async function getSharedServices(
  db: NeonHttpDatabase,
  orgId: string,
  activeOnly: boolean = true,
): Promise<SharedService[]> {
  // TODO: Implement database query

  throw new Error('Not implemented');
}

/**
 * Get allocation rules for service
 */
export async function getAllocationRules(
  db: NeonHttpDatabase,
  orgId: string,
  serviceId: string,
): Promise<AllocationRule[]> {
  // TODO: Implement database query

  throw new Error('Not implemented');
}

/**
 * Update allocation rule
 */
export async function updateAllocationRule(
  db: NeonHttpDatabase,
  orgId: string,
  ruleId: string,
  updates: Partial<CreateRuleInput>,
): Promise<AllocationRule> {
  // TODO: Implement database logic

  throw new Error('Not implemented');
}

