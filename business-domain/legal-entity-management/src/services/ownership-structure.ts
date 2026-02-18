/**
 * Ownership Structure Service
 *
 * Manages legal entity ownership hierarchies, control percentages, and effective dating
 * for consolidation accounting and tax planning.
 */

import { z } from 'zod';

// Schemas
export const createOwnershipSchema = z.object({
  parentEntityId: z.string().uuid(),
  childEntityId: z.string().uuid(),
  ownershipPercent: z.number().min(0).max(100),
  votingPercent: z.number().min(0).max(100).optional(),
  effectiveDate: z.string().datetime(),
  expirationDate: z.string().datetime().optional(),
  ownershipType: z.enum(['direct', 'indirect', 'cross-holding', 'treasury-stock']),
  notes: z.string().optional(),
});

export const calculateEffectiveOwnershipSchema = z.object({
  childEntityId: z.string().uuid(),
  asOfDate: z.string().datetime(),
});

// Types
export type CreateOwnershipInput = z.infer<typeof createOwnershipSchema>;
export type CalculateEffectiveOwnershipInput = z.infer<typeof calculateEffectiveOwnershipSchema>;

export interface OwnershipRelationship {
  id: string;
  parentEntityId: string;
  childEntityId: string;
  ownershipPercent: number;
  votingPercent: number;
  effectiveDate: string;
  expirationDate: string | null;
  ownershipType: string;
  notes: string | null;
}

export interface EffectiveOwnership {
  childEntityId: string;
  ultimateParentId: string;
  directOwnershipPercent: number;
  effectiveOwnershipPercent: number;
  consolidationMethod: 'full' | 'equity' | 'proportionate' | 'none';
  controlClassification: 'subsidiary' | 'associate' | 'joint-venture' | 'investment';
  ownershipChain: Array<{
    level: number;
    entityId: string;
    entityName: string;
    ownershipPercent: number;
  }>;
}

/**
 * Create ownership relationship between entities.
 *
 * @param input - Ownership relationship details with effective dating
 * @returns Created ownership relationship
 *
 * @example
 * ```typescript
 * const ownership = await createOwnership({
 *   parentEntityId: 'parent-123',
 *   childEntityId: 'sub-456',
 *   ownershipPercent: 75,
 *   votingPercent: 75,
 *   effectiveDate: '2024-01-01T00:00:00Z',
 *   ownershipType: 'direct',
 * });
 * ```
 */
export async function createOwnership(
  input: CreateOwnershipInput
): Promise<OwnershipRelationship> {
  const validated = createOwnershipSchema.parse(input);

  // TODO: Implement ownership creation with validation:
  // 1. Validate parent and child entities exist
  // 2. Check for circular ownership (A owns B owns A)
  // 3. Validate effective date (cannot be before parent incorporation)
  // 4. Check for overlapping ownership periods (same parent-child, date conflict)
  // 5. Validate ownership type rules:
  //    - Direct: immediate parent-child
  //    - Indirect: ownership through intermediate entities
  //    - Cross-holding: subsidiary owns parent shares (treasury stock)
  //    - Treasury stock: entity owns its own shares
  // 6. Store in legal_entity_ownership table with audit trail
  // 7. Trigger recalculation of effective ownership percentages

  return {
    id: 'ownership-uuid',
    parentEntityId: validated.parentEntityId,
    childEntityId: validated.childEntityId,
    ownershipPercent: validated.ownershipPercent,
    votingPercent: validated.votingPercent || validated.ownershipPercent,
    effectiveDate: validated.effectiveDate,
    expirationDate: validated.expirationDate || null,
    ownershipType: validated.ownershipType,
    notes: validated.notes || null,
  };
}

/**
 * Calculate effective ownership percentage through multi-level chains.
 *
 * Example: Parent owns 80% of HoldCo, HoldCo owns 75% of OpCo
 * → Effective ownership = 80% × 75% = 60%
 *
 * @param input - Child entity and calculation date
 * @returns Effective ownership with consolidation method
 *
 * @example
 * ```typescript
 * const effective = await calculateEffectiveOwnership({
 *   childEntityId: 'sub-456',
 *   asOfDate: '2024-12-31T00:00:00Z',
 * });
 * // Result: { effectiveOwnershipPercent: 60, consolidationMethod: 'full' }
 * ```
 */
export async function calculateEffectiveOwnership(
  input: CalculateEffectiveOwnershipInput
): Promise<EffectiveOwnership> {
  const validated = calculateEffectiveOwnershipSchema.parse(input);

  // TODO: Implement effective ownership calculation:
  // 1. Traverse ownership tree from child to ultimate parent
  // 2. Multiply ownership percentages along each path
  // 3. Handle multiple paths (e.g., parent owns child through 2 different chains)
  // 4. Apply consolidation rules:
  //    - Full consolidation: >50% ownership (IFRS 10, ASC 810)
  //    - Proportionate consolidation: joint venture, equal control
  //    - Equity method: 20-50% ownership (IAS 28, ASC 323)
  //    - Investment: <20% ownership, no significant influence
  // 5. Classify control:
  //    - Subsidiary: >50% voting or demonstrated control
  //    - Associate: 20-50% significant influence
  //    - Joint venture: contractual arrangement, equal control
  //    - Investment: passive holding
  // 6. Build ownership chain showing each level

  return {
    childEntityId: validated.childEntityId,
    ultimateParentId: 'ultimate-parent-uuid',
    directOwnershipPercent: 75,
    effectiveOwnershipPercent: 60, // Example: 80% × 75%
    consolidationMethod: 'full', // >50%
    controlClassification: 'subsidiary',
    ownershipChain: [
      { level: 0, entityId: 'ultimate-parent-uuid', entityName: 'Parent Corp', ownershipPercent: 100 },
      { level: 1, entityId: 'holdco-uuid', entityName: 'Holding Company', ownershipPercent: 80 },
      { level: 2, entityId: validated.childEntityId, entityName: 'Operating Company', ownershipPercent: 75 },
    ],
  };
}
