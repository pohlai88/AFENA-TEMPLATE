/**
 * Consolidation Hierarchy Service
 *
 * Builds multi-level entity ownership structures for consolidation.
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { z } from 'zod';

// Schemas
export const buildHierarchySchema = z.object({
  parentEntityId: z.string().uuid(),
  asOfDate: z.string().datetime(),
  includeAssociates: z.boolean().default(true),
});

export type BuildHierarchyInput = z.infer<typeof buildHierarchySchema>;

// Types
export type ConsolidationMethod = 'full' | 'equity' | 'proportionate' | 'none';

export interface ConsolidationNode {
  entityId: string;
  entityName: string;
  level: number;
  ownershipPercent: string;
  effectiveOwnershipPercent: string;
  consolidationMethod: ConsolidationMethod;
  children: ConsolidationNode[];
}

export interface ConsolidationHierarchy {
  rootEntity: ConsolidationNode;
  asOfDate: string;
  totalEntities: number;
  subsidiaries: number;
  associates: number;
}

/**
 * Build consolidation hierarchy from entity ownership structure
 *
 * Determines consolidation method based on ownership:
 * - >50%: Full consolidation
 * - 20-50%: Equity method
 * - <20%: No consolidation (investment)
 */
export async function buildConsolidationHierarchy(
  db: NeonHttpDatabase,
  orgId: string,
  input: BuildHierarchyInput,
): Promise<ConsolidationHierarchy> {
  const validated = buildHierarchySchema.parse(input);

  // TODO: Query legal_entity_ownership table
  // TODO: Build tree structure recursively
  // TODO: Calculate effective ownership percentages
  // TODO: Determine consolidation method per entity
  // TODO: Track level-by-level ownership dilution

  return {
    rootEntity: {
      entityId: validated.parentEntityId,
      entityName: 'Parent Inc.',
      level: 0,
      ownershipPercent: '100.00',
      effectiveOwnershipPercent: '100.00',
      consolidationMethod: 'full',
      children: [],
    },
    asOfDate: validated.asOfDate,
    totalEntities: 1,
    subsidiaries: 0,
    associates: 0,
  };
}

/**
 * Determine consolidation method based on ownership percentage
 */
export function determineConsolidationMethod(
  ownershipPercent: string,
): ConsolidationMethod {
  const percent = parseFloat(ownershipPercent);

  if (percent > 50) {
    return 'full';
  } else if (percent >= 20 && percent <= 50) {
    return 'equity';
  } else {
    return 'none';
  }
}

/**
 * Calculate effective ownership through chain
 *
 * Example: Parent owns 80% of Sub A, Sub A owns 60% of Sub B
 * Effective ownership of Sub B = 0.80 * 0.60 = 48%
 */
export function calculateEffectiveOwnership(
  ownershipChain: string[],
): string {
  const effective = ownershipChain.reduce((acc, percent) => {
    return acc * (parseFloat(percent) / 100);
  }, 1.0);

  return (effective * 100).toFixed(2);
}
